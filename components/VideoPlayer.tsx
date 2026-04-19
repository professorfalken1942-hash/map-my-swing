'use client'

import { useState, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import PoseOverlay from './PoseOverlay'

interface VideoPlayerProps {
  videoUrl: string
  onMetricsUpdate?: (hipRotation: number, shoulderRotation: number) => void
}

export default function VideoPlayer({ videoUrl, onMetricsUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [slowMotion, setSlowMotion] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const skipFrame = (direction: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += direction * 0.033 // ~1 frame at 30fps
    }
  }

  const handleSlowMotion = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = slowMotion ? 1 : 0.5
      setSlowMotion(!slowMotion)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '1rem' }}>
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ width: '100%', height: '100%', background: '#000', borderRadius: '4px' }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
        />
        <PoseOverlay videoRef={videoRef} onMetricsUpdate={onMetricsUpdate} />
      </div>

      {/* Scrubber */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => {
          if (videoRef.current) videoRef.current.currentTime = parseFloat(e.target.value)
          setCurrentTime(parseFloat(e.target.value))
        }}
        style={{ width: '100%', marginBottom: '1rem', cursor: 'pointer' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.75rem', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
        <span>
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </span>
        <button
          onClick={handleSlowMotion}
          style={{
            padding: '0.5rem 0.75rem',
            background: slowMotion ? '#d4af37' : 'transparent',
            color: slowMotion ? '#000' : '#d4af37',
            border: '1px solid #d4af37',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {slowMotion ? '1x' : '0.5x'} Speed
        </button>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => skipFrame(-1)}
          style={{ flex: 1, padding: '0.75rem', background: '#333', color: '#d4af37', border: 'none', cursor: 'pointer', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <SkipBack size={20} style={{ margin: 0 }} />
        </button>
        <button
          onClick={togglePlay}
          style={{ flex: 2, padding: '0.75rem', background: '#d4af37', color: '#000', border: 'none', fontWeight: 600, cursor: 'pointer', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isPlaying ? <Pause size={20} style={{ margin: 0 }} /> : <Play size={20} style={{ margin: 0 }} />}
        </button>
        <button
          onClick={() => skipFrame(1)}
          style={{ flex: 1, padding: '0.75rem', background: '#333', color: '#d4af37', border: 'none', cursor: 'pointer', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <SkipForward size={20} style={{ margin: 0 }} />
        </button>
      </div>
    </div>
  )
}
