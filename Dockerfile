# AudioDenoise AI Backend Dockerfile - Optimized for Hugging Face Spaces
# Multi-stage build for optimized production image

# Stage 1: Builder
FROM python:3.10-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsndfile1 \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Production
FROM python:3.10-slim

# Set up a new user named "user" with user id 1000
RUN useradd -m -u 1000 user

# Set home directory
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    libgomp1 \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=builder /root/.local $HOME/.local

# Copy application code
COPY --chown=user . .

# Create model and temp directories with correct permissions
RUN mkdir -p $HOME/app/model $HOME/app/temp_audio && \
    chown -R user:user $HOME/app

# Switch to the non-root user
USER user

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    MODEL_PATH=$HOME/app/model/unet_denoiser.h5 \
    TEMP_DIR=$HOME/app/temp_audio \
    PORT=7860

# Health check (HF Spaces uses port 7860)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7860/api/health || exit 1

# Expose port 7860 for Hugging Face Spaces
EXPOSE 7860

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]
