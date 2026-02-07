"""
Denoise Service - Orchestrates audio denoising workflow
"""

import os
import time
import logging
import numpy as np
import librosa
import librosa.display
import soundfile as sf
import matplotlib.pyplot as plt
from typing import Callable, Optional
from PIL import Image
import io

from app.services.model_service import ModelService

logger = logging.getLogger("audio_denoise")


class DenoiseService:
    """Service for audio denoising operations"""
    
    def __init__(self, model_service: ModelService):
        self.model_service = model_service
        
    def _generate_spectrogram_image(self, audio: np.ndarray, save_path: str):
        """Generate a spectrogram image and save it"""
        try:
            plt.figure(figsize=(10, 4))
            D = librosa.amplitude_to_db(np.abs(librosa.stft(audio)), ref=np.max)
            librosa.display.specshow(D, sr=16000, hop_length=128, x_axis='time', y_axis='hz')
            plt.axis('off')
            plt.tight_layout(pad=0)
            plt.savefig(save_path, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
            plt.close()
            logger.info(f"Spectrogram saved to {save_path}")
        except Exception as e:
            logger.error(f"Error generating spectrogram: {e}")

    async def denoise(
        self,
        input_path: str,
        output_path: str,
        job_id: str,
        progress_callback: Optional[Callable[[float, str], None]] = None
    ) -> dict:
        """
        Denoise an audio file with chunked inference to save memory
        """
        start_time = time.time()
        logger.info(f"Denoising job {job_id}: {input_path}")
        
        def update_progress(progress: float, message: str):
            if progress_callback:
                progress_callback(progress, message)
        
        # Load audio exactly as in reference (16000Hz)
        update_progress(10.0, "Loading audio file...")
        try:
            # Try to load with librosa (which uses soundfile/audioread)
            audio, sr = librosa.load(input_path, sr=16000, mono=True)
            logger.info(f"Loaded audio: {len(audio)} samples, {sr}Hz")
        except Exception as e:
            logger.error(f"Error loading audio: {e}")
            raise RuntimeError(f"Failed to load audio: {str(e)}")

        if len(audio) == 0:
            raise RuntimeError("Audio file is empty")
            
        original_length = len(audio)
        duration = float(original_length / 16000)
        
        # Generate input spectrogram image
        update_progress(20.0, "Generating visualization...")
        input_spec_path = output_path.replace("_output.wav", "_input_spec.png")
        self._generate_spectrogram_image(audio, input_spec_path)
        
        # Preprocess (STFT, Normalize, Pad x32)
        update_progress(35.0, "Computing spectrogram...")
        spectrogram_input, metadata = self.model_service.preprocess(audio, 16000)
        logger.info(f"Preprocessed shape: {spectrogram_input.shape}")
        
        # Run inference in CHUNKS to save memory on Render
        update_progress(50.0, "AI Inference (Chunked)...")
        _, freq, frames, chan = spectrogram_input.shape
        spectrogram_output = np.zeros_like(spectrogram_input)
        
        chunk_size = 128 # Multiple of 32
        num_chunks = int(np.ceil(frames / chunk_size))
        
        try:
            for i in range(num_chunks):
                start = i * chunk_size
                end = min(start + chunk_size, frames)
                
                chunk = spectrogram_input[:, :, start:end, :]
                
                # Ensure chunk width is multiple of 32 for U-Net
                actual_w = end - start
                if actual_w % 32 != 0:
                    padding = 32 - (actual_w % 32)
                    chunk = np.pad(chunk, ((0,0), (0,0), (0, padding), (0,0)))
                
                # Inference
                chunk_out = self.model_service.predict(chunk)
                if hasattr(chunk_out, 'numpy'):
                    chunk_out = chunk_out.numpy()
                
                # Assign back to output (slicing out any padding added for divisibility)
                spectrogram_output[:, :, start:end, :] = chunk_out[:, :, :actual_w, :]
                
                # Update sub-progress
                progress = 50 + (i / num_chunks) * 30
                update_progress(progress, f"AI Processing: {int((i+1)/num_chunks*100)}%")
                
                # Clear memory for each chunk
                del chunk
                del chunk_out
            
            # Explicitly delete large input
            del spectrogram_input
            
        except Exception as e:
            logger.error(f"Inference error: {e}")
            raise RuntimeError(f"AI Model Error: {str(e)}")
        
        # Postprocess (ISTFT, Denormalize, Crop)
        update_progress(80.0, "Reconstructing audio...")
        audio_denoised = self.model_service.postprocess(
            spectrogram_output,
            metadata,
            original_length
        )
        logger.info("Reconstruction complete")
        
        # Explicitly delete large output spectrogram
        del spectrogram_output
        
        # Generate output spectrogram image
        update_progress(85.0, "Finalizing visualization...")
        output_spec_path = output_path.replace("_output.wav", "_output_spec.png")
        self._generate_spectrogram_image(audio_denoised, output_spec_path)

        
        # Calculate real metrics from reference
        update_progress(90.0, "Calculating quality metrics...")
        noisy_power = np.mean(audio ** 2)
        denoised_power = np.mean(audio_denoised ** 2)
        eps = 1e-10
        noise_reduction_db = 10 * np.log10((noisy_power + eps) / (denoised_power + eps))
        
        # Save output
        update_progress(95.0, "Exporting results...")
        
        # Apply Peak Normalization to -1dB
        try:
            peak = np.max(np.abs(audio_denoised))
            if peak > 0:
                target_peak = 10**(-1/20) # -1dB
                audio_denoised = audio_denoised * (target_peak / peak)
            logger.info("Applied -1dB peak normalization")
        except Exception as e:
            logger.warning(f"Normalization failed: {e}")

        sf.write(output_path, audio_denoised, 16000)
        logger.info(f"Saved output to {output_path}")
        
        processing_time = time.time() - start_time
        
        update_progress(100.0, "Processing complete")
        
        return {
            "noise_reduction_db": float(noise_reduction_db),
            "snr_improvement_db": float(noise_reduction_db),
            "confidence_score": float(np.clip(100 - abs(noise_reduction_db), 0, 100)),
            "processing_time": float(processing_time),
            "duration": duration,
            "input_duration": duration,
            "sample_rate": 16000,
            "input_spec_url": f"/api/jobs/{job_id}/spec/input",
            "output_spec_url": f"/api/jobs/{job_id}/spec/output"
        }
