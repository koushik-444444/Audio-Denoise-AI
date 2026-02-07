import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Play, Pause } from 'lucide-react'

interface AudioWaveformProps {
  url: string
  label: string
  color?: string
}

export default function AudioWaveform({ url, label, color = '#22d3ee' }: AudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4b5563',
      progressColor: color,
      cursorColor: color,
      barWidth: 2,
      barRadius: 3,
      height: 64,
      normalize: true,
      hideScrollbar: true,
    })

    ws.load(url)

    ws.on('ready', () => {
      setDuration(ws.getDuration())
    })

    ws.on('audioprocess', () => {
      setCurrentTime(ws.getCurrentTime())
    })

    ws.on('play', () => setIsPlaying(true))
    ws.on('pause', () => setIsPlaying(false))
    ws.on('finish', () => setIsPlaying(false))

    wavesurferRef.current = ws

    return () => {
      ws.destroy()
    }
  }, [url, color])

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-white">{label}</div>
        </div>
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-ai-accent/30 flex items-center justify-center hover:bg-ai-accent/50 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>
      </div>
      
      <div ref={containerRef} className="w-full mb-2" />
      
      <div className="flex justify-between text-[10px] text-white/40 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
