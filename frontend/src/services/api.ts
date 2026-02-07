import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface DenoiseResponse {
  job_id: string;
  status: string;
  message: string;
  check_status_url: string;
}

export interface JobStatus {
  job_id: string;
  status: 'idle' | 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  result?: {
    output_url: string;
    duration: number;
    noise_reduction_db: number;
    snr_improvement_db: number;
    confidence_score: number;
    processing_time: number;
    input_spec_url?: string;
    output_spec_url?: string;
  };
}

export const api = {
  async uploadAudio(file: File, startTime?: number, endTime?: number): Promise<DenoiseResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (startTime !== undefined) formData.append('start_time', startTime.toString());
    if (endTime !== undefined) formData.append('end_time', endTime.toString());
    
    const response = await axios.post(`${API_BASE_URL}/api/denoise`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async getStatus(jobId: string): Promise<JobStatus> {
    const response = await axios.get(`${API_BASE_URL}/api/status/${jobId}`);
    return response.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/jobs/${jobId}`);
  },

  getDownloadUrl(jobId: string): string {
    return `${API_BASE_URL}/api/download/${jobId}`;
  },
  
  getFullUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  }
};
