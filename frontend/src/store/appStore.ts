import { create } from 'zustand';

export interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration: number;
  size: number;
}

export interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
}

export interface DenoiseResult {
  id: string;
  originalAudio: AudioFile;
  cleanedAudio: AudioFile;
  noiseReduction: number;
  snrImprovement: number;
  confidenceScore: number;
  processingTime: number;
}

interface AppState {
  // Audio state
  currentAudio: AudioFile | null;
  denoiseResult: DenoiseResult | null;
  processingStatus: ProcessingStatus;
  
  // UI state
  isPlaying: boolean;
  currentTime: number;
  activeTab: 'upload' | 'processing' | 'results';
  
  // Actions
  setCurrentAudio: (audio: AudioFile | null) => void;
  setDenoiseResult: (result: DenoiseResult | null) => void;
  setProcessingStatus: (status: ProcessingStatus) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setActiveTab: (tab: 'upload' | 'processing' | 'results') => void;
  reset: () => void;
}

const initialState = {
  currentAudio: null,
  denoiseResult: null,
  processingStatus: {
    status: 'idle' as const,
    progress: 0,
    message: '',
  },
  isPlaying: false,
  currentTime: 0,
  activeTab: 'upload' as const,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  
  setCurrentAudio: (audio) => set({ currentAudio: audio }),
  setDenoiseResult: (result) => set({ denoiseResult: result }),
  setProcessingStatus: (status) => set({ processingStatus: status }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () => set(initialState),
}));
