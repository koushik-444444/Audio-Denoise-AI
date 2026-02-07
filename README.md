---
title: Audio Denoise AI Studio
emoji: 🎧
colorFrom: indigo
colorTo: cyan
sdk: docker
pinned: false
---

# AudioDenoise AI Studio 🎧

A professional, production-ready AI Audio Denoising Studio powered by a Deep Learning U-Net model. This application provides a complete browser-based environment for removing background noise from audio clips with studio-grade precision.

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=tensorflow)

## 🌟 Key Features

- **🧠 Deep Learning Denoising**: Advanced U-Net architecture for spectrogram-based noise suppression.
- **🌊 Interactive Waveforms**: Powered by `WaveSurfer.js` for real-time seeking, visual feedback, and playback control.
- **📊 Spectrogram Comparison**: Side-by-side frequency-domain analysis to visualize AI performance.
- **🎙️ Live Recording**: Capture audio directly from your microphone and denoise it instantly in the browser.
- **📂 Persistent History**: Local session storage to track and reload your previous denoising jobs.
- **🐳 Multi-Format Support**: Integrated `FFmpeg` handles MP3, WAV, FLAC, and more.
- **🚀 Ultra-Fast Inference**: Optimized signal processing tuned for 16kHz audio.

## 🏗 Technical Architecture

### Frontend (React + Vite + TypeScript)
- **Visualization**: `WaveSurfer.js` (Interactive Waveforms) & `Lucide React`.
- **Animations**: `Framer Motion` for smooth state transitions.
- **State Management**: `Zustand` & Custom Hooks (`useRecorder`).
- **UI System**: Tailwind CSS with Glassmorphism design patterns.

### Backend (FastAPI + TensorFlow)
- **ML Engine**: TensorFlow 2.x (U-Net model).
- **Audio Processing**: `Librosa` (STFT/ISTFT) & `SoundFile`.
- **Infrastructure**: FFmpeg for cross-platform audio decoding.
- **Concurrency**: Asynchronous background tasks for non-blocking processing.

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- [Optional] Docker Desktop

### 2. Manual Setup

**Backend:**
```bash
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 3. Docker Deployment (Recommended)
Deploy the entire production stack with one command:
```bash
docker-compose up --build -d
```

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/denoise` | POST | Upload audio file for processing |
| `/api/status/{id}` | GET | Poll real-time progress and results |
| `/api/download/{id}` | GET | Fetch the cleaned WAV file |
| `/api/jobs/{id}/spec/{type}` | GET | Retrieve input/output spectrogram images |
| `/api/health` | GET | Check AI model and system status |

## 🔐 Privacy & Security
- Audio files are processed in a secure temporary directory.
- Background cleanup task automatically deletes all user data and temporary files every 60 minutes.
- No audio data is permanently stored or logged.

## 📝 License
This project is licensed under the MIT License.
