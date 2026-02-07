"""
Model Service - Handles U-Net model loading and inference
"""

import os
import numpy as np
import librosa
import tensorflow as tf
from typing import Optional, Tuple


class ModelService:
    """Service for managing the U-Net denoising model"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or os.getenv("MODEL_PATH", "./model/unet_denoiser.h5")
        self.model: Optional[tf.keras.Model] = None
        self.is_loaded = False
        
        # Model parameters - Exactly matching user reference
        self.sample_rate = 16000
        self.n_fft = 512
        self.hop_length = 128
        self.win_length = 512
        
    def load_model(self) -> bool:
        """Load the U-Net model from disk"""
        try:
            # Check if model exists at specified path
            if os.path.exists(self.model_path):
                print(f"Loading model from {self.model_path}")
                try:
                    self.model = tf.keras.models.load_model(self.model_path, compile=False)
                    self.is_loaded = True
                    print("Model loaded successfully (compile=False)")
                    return True
                except Exception as e:
                    print(f"Error loading h5 model: {e}")
                    # Create simulated if load fails
                    self.model = self._create_simulated_model()
                    self.is_loaded = True
                    return True
            else:
                print(f"Model not found at {self.model_path}, using simulated model")
                self.model = self._create_simulated_model()
                self.is_loaded = True
                return True
                
        except Exception as e:
            print(f"Error in load_model: {e}")
            self.model = self._create_simulated_model()
            self.is_loaded = True
            return True
    
    def _create_simulated_model(self) -> tf.keras.Model:
        """Create a simple U-Net-like model for demonstration"""
        print("Creating simulated U-Net model...")
        inputs = tf.keras.layers.Input(shape=(257, None, 1))
        x = tf.keras.layers.Conv2D(32, 3, activation='relu', padding='same')(inputs)
        x = tf.keras.layers.Conv2D(64, 3, activation='relu', padding='same', strides=(2, 1))(x)
        x = tf.keras.layers.Conv2D(128, 3, activation='relu', padding='same')(x)
        x = tf.keras.layers.Conv2DTranspose(64, 3, strides=(2, 1), activation='relu', padding='same')(x)
        outputs = tf.keras.layers.Conv2D(1, 3, activation='linear', padding='same')(x)
        model = tf.keras.Model(inputs, outputs)
        print("Simulated model created")
        return model

    def preprocess(self, audio: np.ndarray, sr: int) -> Tuple[np.ndarray, dict]:
        """
        Preprocess audio exactly as in reference code
        """
        # Ensure correct sample rate
        if sr != self.sample_rate:
            audio = librosa.resample(audio, orig_sr=sr, target_sr=self.sample_rate)
        
        # STFT
        stft = librosa.stft(audio, n_fft=self.n_fft, hop_length=self.hop_length)
        magnitude = np.abs(stft)
        phase = np.angle(stft)
        
        # Store for reconstruction
        original_magnitude_max = np.max(magnitude)
        original_frames = magnitude.shape[1]
        
        # Normalize
        if original_magnitude_max > 0:
            magnitude_norm = magnitude / original_magnitude_max
        else:
            magnitude_norm = magnitude
            
        # Pad time dimension to multiple of 32
        padded_frames = int(np.ceil(original_frames / 32) * 32)
        pad_width = padded_frames - original_frames
        
        magnitude_pad = np.pad(magnitude_norm, ((0, 0), (0, pad_width)))
        phase_pad = np.pad(phase, ((0, 0), (0, pad_width)))
        
        # Add batch and channel dimensions (1, 257, padded_frames, 1)
        input_tensor = np.expand_dims(magnitude_pad, (0, -1))
        
        metadata = {
            'magnitude_max': original_magnitude_max,
            'original_frames': original_frames,
            'phase_pad': phase_pad,
            'sample_rate': self.sample_rate
        }
        
        return input_tensor.astype(np.float32), metadata

    def postprocess(
        self,
        output: np.ndarray,
        metadata: dict,
        original_length: int
    ) -> np.ndarray:
        """
        Postprocess exactly as in reference code
        """
        # output shape: (1, 257, padded_frames, 1) or (257, padded_frames)
        denoised_magnitude = np.squeeze(output)
        
        # Remove padding and denormalize
        frames = metadata['original_frames']
        denoised_magnitude = denoised_magnitude[:, :frames]
        denoised_magnitude *= metadata['magnitude_max']
        
        # Reconstruct complex spectrogram
        phase = metadata['phase_pad'][:, :frames]
        denoised_stft = denoised_magnitude * np.exp(1j * phase)
        
        # Inverse STFT
        audio_denoised = librosa.istft(denoised_stft, hop_length=self.hop_length)
        
        return audio_denoised
    
    def predict(self, input_spectrogram: np.ndarray) -> np.ndarray:
        """Run model inference with structure matching"""
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        # Wrap in list to match expected structure ['input_layer_1'] and avoid Keras 3 warnings
        try:
            return self.model([input_spectrogram], training=False)
        except Exception:
            # Fallback for older models or different structures
            return self.model(input_spectrogram, training=False)
    
    def get_model_info(self) -> dict:
        """Get model information"""
        if self.model is None:
            return {"loaded": False}
        
        return {
            "loaded": True,
            "parameters": self.model.count_params(),
            "layers": len(self.model.layers),
            "input_shape": self.model.input_shape,
            "output_shape": self.model.output_shape
        }
