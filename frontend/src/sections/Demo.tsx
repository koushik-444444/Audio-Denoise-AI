import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Download, RotateCcw, 
  FileAudio, Wand2, BarChart3, Brain,
  AlertCircle, Mic, Square, History,
  Maximize2, X, ChevronRight
} from 'lucide-react';
import { api, type JobStatus } from '../services/api';
import { toast } from 'sonner';
import AudioWaveform from '../components/AudioWaveform';
import { useRecorder } from '../hooks/useRecorder';

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  results: JobStatus['result'];
  originalUrl: string;
}

export default function Demo() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus['status']>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [results, setResults] = useState<JobStatus['result'] | null>(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  
  const { isRecording, recordingBlob, recordingDuration, startRecording, stopRecording, clearRecording } = useRecorder();

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('denoise_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const newHistory = [item, ...prev].slice(0, 10); // Keep last 10
      localStorage.setItem('denoise_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const cleanup = useCallback(() => {
    if (pollingIntervalRef.current) {
      window.clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startPolling = useCallback((id: string, fileName: string, origUrl: string) => {
    cleanup();
    
    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const jobStatus = await api.getStatus(id);
        setProgress(jobStatus.progress);
        setStatusMessage(jobStatus.message);
        
        if (jobStatus.status === 'completed') {
          setResults(jobStatus.result || null);
          setStatus('completed');
          cleanup();
          toast.success('Audio denoised successfully!');
          
          if (jobStatus.result) {
            addToHistory({
              id,
              name: fileName,
              date: new Date().toLocaleTimeString(),
              results: jobStatus.result,
              originalUrl: origUrl
            });
          }
        } else if (jobStatus.status === 'error') {
          setStatus('error');
          setStatusMessage(jobStatus.message);
          cleanup();
          toast.error(`Processing failed: ${jobStatus.message}`);
        } else {
          setStatus(jobStatus.status);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setStatus('error');
          setStatusMessage('Job lost. Please try again.');
          cleanup();
        }
      }
    }, 1500);
  }, [cleanup, addToHistory]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelectManual(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelectManual(files[0]);
    }
  }, []);

  const handleFileSelectManual = (file: File | Blob, name?: string) => {
    const fileName = name || (file as File).name || `recording_${Date.now()}.wav`;
    const actualFile = file instanceof File ? file : new File([file], fileName, { type: 'audio/wav' });
    
    if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
    
    const url = URL.createObjectURL(actualFile);
    setFileName(fileName);
    setOriginalAudioUrl(url);
    handleUpload(actualFile, fileName, url);
  };

  const handleUpload = async (file: File, fileName: string, origUrl: string) => {
    try {
      setStatus('processing');
      setProgress(0);
      setStatusMessage('Uploading to AI server...');
      
      const response = await api.uploadAudio(file);
      setJobId(response.job_id);
      startPolling(response.job_id, fileName, origUrl);
    } catch (error: any) {
      setStatus('error');
      const msg = error.response?.data?.detail || 'Upload failed. Check server connection.';
      setStatusMessage(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (recordingBlob) {
      handleFileSelectManual(recordingBlob, `live_record_${new Date().toLocaleTimeString()}.wav`);
      clearRecording();
    }
  }, [recordingBlob, clearRecording]);

  const handleDownload = () => {
    if (!jobId) return;
    window.open(api.getDownloadUrl(jobId), '_blank');
  };

  const handleReset = useCallback(() => {
    cleanup();
    if (originalAudioUrl) URL.revokeObjectURL(originalAudioUrl);
    
    setFileName('');
    setJobId(null);
    setStatus('idle');
    setResults(null);
    setProgress(0);
    setStatusMessage('');
    setOriginalAudioUrl(null);
    setShowSpectrogram(false);
  }, [cleanup, originalAudioUrl]);

  const loadFromHistory = (item: HistoryItem) => {
    setJobId(item.id);
    setFileName(item.name);
    setOriginalAudioUrl(item.originalUrl);
    setResults(item.results);
    setStatus('completed');
    setShowHistory(false);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-ai-violet/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-ai-accent/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai-accent/10 border border-ai-accent/30 mb-6">
              <Wand2 className="w-4 h-4 text-ai-cyan" />
              <span className="text-sm text-ai-cyan">Pro Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium">
              Experience the
              <span className="text-gradient block mt-2">Magic</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-3 rounded-xl border transition-all ${showHistory ? 'bg-ai-cyan/20 border-ai-cyan text-ai-cyan' : 'bg-ai-black/40 border-white/10 text-white/60 hover:text-white'}`}
            >
              <History className="w-6 h-6" />
            </button>
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-ai-black/40 border-white/10 text-white/60 hover:text-white'}`}
            >
              {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
              <span className="font-medium">{isRecording ? `Stop (${recordingDuration}s)` : 'Live Record'}</span>
            </button>
          </motion.div>
        </div>

        <div className="relative">
          {/* History Sidebar */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="absolute right-0 top-0 bottom-0 w-80 z-20 glass-card border-l border-white/10 p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-ai-cyan" /> History
                  </h3>
                  <button onClick={() => setShowHistory(false)}><X className="w-5 h-5 text-white/40" /></button>
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-12 text-white/20">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    <p>No recent jobs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-ai-cyan/30 hover:bg-ai-cyan/5 transition-all group"
                      >
                        <div className="text-sm font-medium text-white truncate mb-1">{item.name}</div>
                        <div className="flex items-center justify-between text-[10px] text-white/40 uppercase font-mono">
                          <span>{item.date}</span>
                          <span className="text-ai-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Load <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Interface */}
          <motion.div
            layout
            className="glass-card p-6 lg:p-10 min-h-[400px]"
          >
            <AnimatePresence mode="wait">
              {/* Upload State */}
              {status === 'idle' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12 lg:p-16
                      flex flex-col items-center justify-center cursor-pointer
                      transition-all duration-300
                      ${isDragging 
                        ? 'border-ai-cyan bg-ai-cyan/5' 
                        : 'border-ai-accent/30 hover:border-ai-accent/50 bg-ai-black/30'
                      }
                    `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <motion.div
                      animate={{ y: isDragging ? -10 : 0 }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ai-accent/20 to-ai-violet/20 flex items-center justify-center mb-6 border border-ai-accent/30"
                    >
                      <Upload className="w-10 h-10 text-ai-cyan" />
                    </motion.div>
                    
                    <h3 className="text-xl font-medium text-white mb-2">
                      Drop your audio file here
                    </h3>
                    <p className="text-white/50 text-center">
                      Supports WAV, MP3, FLAC (max 100MB)
                    </p>
                    
                    <div className="mt-6 flex items-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-2">
                        <FileAudio className="w-4 h-4" /> MP3 / WAV
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Processing State */}
              {status === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0"
                      >
                        <div className="w-full h-full rounded-full border-4 border-ai-accent/20 border-t-ai-cyan" />
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-10 h-10 text-ai-cyan" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-medium text-white mb-2">AI Processing</h3>
                    <p className="text-white/50 mb-8">{statusMessage}</p>

                    <div className="w-full max-w-md">
                      <div className="h-2 bg-ai-accent/20 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${Math.max(5, progress)}%` }}
                          className="h-full bg-gradient-to-r from-ai-cyan to-ai-accent rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Completed State */}
              {status === 'completed' && results && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Audio Players */}
                    <div className="space-y-4">
                      {originalAudioUrl && (
                        <AudioWaveform url={originalAudioUrl} label="Original Audio" color="#4b5563" />
                      )}
                      <AudioWaveform 
                        url={api.getFullUrl(results.output_url)} 
                        label="Denoised Audio" 
                        color="#22d3ee" 
                      />
                    </div>

                    {/* Results & Stats */}
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-medium text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-ai-cyan" /> Quality Metrics
                        </h4>
                        <button 
                          onClick={() => setShowSpectrogram(!showSpectrogram)}
                          className={`p-2 rounded-lg border transition-all ${showSpectrogram ? 'bg-ai-cyan/20 border-ai-cyan text-ai-cyan' : 'bg-white/5 border-white/10 text-white/40'}`}
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/60">Noise Reduction ({fileName})</span>
                            <span className="text-ai-cyan font-bold">{results.noise_reduction_db.toFixed(1)} dB</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (results.noise_reduction_db / 30) * 100)}%` }}
                              className="h-full bg-ai-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Processing Time</div>
                            <div className="text-lg font-medium text-white">{results.processing_time.toFixed(2)}s</div>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">AI Confidence</div>
                            <div className="text-lg font-medium text-green-400">{results.confidence_score.toFixed(0)}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex gap-3">
                        <button onClick={handleDownload} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" /> Download
                        </button>
                        <button onClick={handleReset} className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white transition-all">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Spectrogram View */}
                  {showSpectrogram && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-white/40 uppercase tracking-widest ml-1">Input Spectrogram</div>
                        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[2.5/1]">
                          <img src={api.getFullUrl((results as any).input_spec_url || '')} className="w-full h-full object-cover" alt="Input Spectrogram" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-ai-cyan uppercase tracking-widest ml-1">Denoised Spectrogram</div>
                        <div className="rounded-2xl overflow-hidden border border-ai-cyan/20 bg-black/40 aspect-[2.5/1]">
                          <img src={api.getFullUrl((results as any).output_spec_url || '')} className="w-full h-full object-cover" alt="Output Spectrogram" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Error State */}
              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/30">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-2">Processing Failed</h3>
                  <p className="text-white/50 mb-8 max-w-md text-center">{statusMessage}</p>
                  <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

