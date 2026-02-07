"""
AudioDenoise AI - FastAPI Backend
TensorFlow U-Net Audio Denoising API
"""

import os
import uuid
import tempfile
import shutil
import logging
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import asyncio

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("audio_denoise")

load_dotenv()

import numpy as np
import librosa
import soundfile as sf
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, status
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class ProcessingStatus(BaseModel):
    job_id: str
    status: str  # pending, processing, completed, error
    progress: float
    message: str
    created_at: str
    completed_at: Optional[str] = None
    result: Optional[dict] = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    gpu_available: bool
    version: str

    model_config = {
        "protected_namespaces": ()
    }


class MetricsResponse(BaseModel):
    total_processed: int
    average_processing_time: float
    noise_reduction_avg: float
    snr_improvement_avg: float


# Import our services
from app.services.denoise_service import DenoiseService
from app.services.model_service import ModelService

# Global service instances
model_service: Optional[ModelService] = None
denoise_service: Optional[DenoiseService] = None

# Temporary storage for processed files
TEMP_DIR = os.getenv("TEMP_DIR", tempfile.mkdtemp(prefix="audio_denoise_"))
os.makedirs(TEMP_DIR, exist_ok=True)

# Job storage (in production, use Redis)
job_store = {}

async def cleanup_old_jobs():
    """Periodically remove jobs older than 1 hour"""
    while True:
        try:
            current_time = datetime.utcnow()
            to_delete = []
            
            for job_id, job in job_store.items():
                created_at = datetime.fromisoformat(job["created_at"])
                if (current_time - created_at).total_seconds() > 3600:
                    to_delete.append(job_id)
            
            for job_id in to_delete:
                logger.info(f"Cleaning up expired job: {job_id}")
                # Remove files
                for suffix in ["_input.wav", "_input.mp3", "_input.flac", "_input.m4a", "_input.ogg", "_output.wav"]:
                    file_path = os.path.join(TEMP_DIR, f"{job_id}{suffix}")
                    if os.path.exists(file_path):
                        os.remove(file_path)
                del job_store[job_id]
        except Exception as e:
            logger.error(f"Cleanup error: {e}")
            
        await asyncio.sleep(600) # Run every 10 mins


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global model_service, denoise_service
    
    # Startup
    logger.info("Starting AudioDenoise AI Backend...")
    
    # Initialize model service
    model_service = ModelService()
    model_loaded = model_service.load_model()
    logger.info(f"Model loaded: {model_loaded}")
    
    # Initialize denoise service
    denoise_service = DenoiseService(model_service)
    
    # Start cleanup task
    asyncio.create_task(cleanup_old_jobs())
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    shutil.rmtree(TEMP_DIR, ignore_errors=True)


app = FastAPI(
    title="AudioDenoise AI API",
    description="TensorFlow U-Net Audio Denoising API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "name": "AudioDenoise AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "operational"
    }


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    import tensorflow as tf
    import shutil
    
    ffmpeg_found = shutil.which("ffmpeg") is not None
    
    return HealthResponse(
        status="healthy",
        model_loaded=model_service.is_loaded if model_service else False,
        gpu_available=len(tf.config.list_physical_devices('GPU')) > 0,
        version="1.0.0"
    )


@app.post("/api/denoise", tags=["Denoising"])
async def denoise_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload and denoise an audio file.
    Returns a job ID for tracking the processing status.
    """
    # Validate file type
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided"
        )
        
    allowed_extensions = {'.wav', '.mp3', '.flac', '.m4a', '.ogg'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Generate job ID
    job_id = str(uuid.uuid4())
    
    # Create job entry
    job_store[job_id] = {
        "job_id": job_id,
        "status": "processing",
        "progress": 0.0,
        "message": "Starting audio processing...",
        "created_at": datetime.utcnow().isoformat(),
        "completed_at": None,
        "result": None,
        "original_filename": file.filename
    }
    
    # Save uploaded file
    input_path = os.path.join(TEMP_DIR, f"{job_id}_input{file_ext}")
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Start background processing
    background_tasks.add_task(process_audio_task, job_id, input_path)
    
    return JSONResponse(
        status_code=status.HTTP_202_ACCEPTED,
        content={
            "job_id": job_id,
            "status": "processing",
            "message": "Audio processing started",
            "check_status_url": f"/api/status/{job_id}"
        }
    )


async def process_audio_task(job_id: str, input_path: str):
    """Background task for audio processing"""
    try:
        logger.info(f"Starting processing for job {job_id}")
        # Update progress
        job_store[job_id]["progress"] = 10.0
        job_store[job_id]["message"] = "Initializing engine..."
        
        # Perform denoising
        if denoise_service is None:
            raise RuntimeError("Denoise service not initialized")
            
        # Denoise service now handles loading and metrics
        result = await denoise_service.denoise(
            input_path=input_path,
            output_path=os.path.join(TEMP_DIR, f"{job_id}_output.wav"),
            job_id=job_id,
            progress_callback=lambda p, m: update_progress(job_id, p, m)
        )
        
        logger.info(f"Job {job_id} completed successfully")
        # Update job with results
        job_store[job_id].update({
            "status": "completed",
            "progress": 100.0,
            "message": "Processing complete",
            "completed_at": datetime.utcnow().isoformat(),
            "result": {
                "output_url": f"/api/download/{job_id}",
                **result
            }
        })
        
    except Exception as e:
        logger.error(f"Error processing job {job_id}: {e}")
        import traceback
        traceback.print_exc()
        job_store[job_id].update({
            "status": "error",
            "message": f"Error: {str(e)}",
            "completed_at": datetime.utcnow().isoformat()
        })


def update_progress(job_id: str, progress: float, message: str):
    """Update job progress"""
    if job_id in job_store:
        job_store[job_id]["progress"] = progress
        job_store[job_id]["message"] = message


@app.get("/api/status/{job_id}", response_model=ProcessingStatus, tags=["Denoising"])
async def get_status(job_id: str):
    """Get processing status for a job"""
    if job_id not in job_store:
        logger.warning(f"Status requested for unknown job: {job_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    job = job_store[job_id]
    logger.info(f"Job {job_id} status check: {job['status']} ({job['progress']}%)")
    
    return ProcessingStatus(
        job_id=job_id,
        status=job["status"],
        progress=job["progress"],
        message=job["message"],
        created_at=job["created_at"],
        completed_at=job.get("completed_at"),
        result=job.get("result")
    )


@app.get("/api/download/{job_id}", tags=["Denoising"])
async def download_result(job_id: str):
    """Download the processed audio file"""
    if job_id not in job_store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    job = job_store[job_id]
    if job["status"] != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Processing not complete"
        )
    
    output_path = os.path.join(TEMP_DIR, f"{job_id}_output.wav")
    if not os.path.exists(output_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Output file not found"
        )
    
    return FileResponse(
        output_path,
        media_type="audio/wav",
        filename=f"denoised_{job['original_filename']}.wav"
    )


@app.get("/api/metrics", response_model=MetricsResponse, tags=["Metrics"])
async def get_metrics():
    """Get processing metrics"""
    completed_jobs = [
        job for job in job_store.values()
        if job["status"] == "completed" and job.get("result")
    ]
    
    if not completed_jobs:
        return MetricsResponse(
            total_processed=0,
            average_processing_time=0.0,
            noise_reduction_avg=0.0,
            snr_improvement_avg=0.0
        )
    
    total = len(completed_jobs)
    avg_time = sum(j["result"].get("processing_time", 0) for j in completed_jobs) / total
    avg_noise = sum(j["result"].get("noise_reduction_db", 0) for j in completed_jobs) / total
    avg_snr = sum(j["result"].get("snr_improvement_db", 0) for j in completed_jobs) / total
    
    return MetricsResponse(
        total_processed=total,
        average_processing_time=avg_time,
        noise_reduction_avg=avg_noise,
        snr_improvement_avg=avg_snr
    )


@app.get("/api/jobs/{job_id}/spec/{type}", tags=["Denoising"])
async def get_spectrogram(job_id: str, type: str):
    """Get a spectrogram image for a job"""
    if job_id not in job_store:
        raise HTTPException(status_code=404, detail="Job not found")
        
    filename = f"{job_id}_{'input' if type == 'input' else 'output'}_spec.png"
    file_path = os.path.join(TEMP_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Spectrogram not found")
        
    return FileResponse(file_path, media_type="image/png")


@app.delete("/api/jobs/{job_id}", tags=["Denoising"])
async def delete_job(job_id: str):
    """Delete a job and its associated files"""
    if job_id not in job_store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Remove files
    for suffix in ["_input.wav", "_input.mp3", "_input.flac", "_output.wav", "_input_spec.png", "_output_spec.png"]:
        file_path = os.path.join(TEMP_DIR, f"{job_id}{suffix}")
        if os.path.exists(file_path):
            os.remove(file_path)
    
    # Remove job from store
    del job_store[job_id]
    
    return {"message": "Job deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    # Hugging Face Spaces uses port 7860 by default
    port = int(os.getenv("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
