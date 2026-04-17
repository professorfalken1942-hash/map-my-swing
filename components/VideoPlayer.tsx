'use client'

import { useState, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
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
      <video
        ref={videoRef}
        src={videoUrl}
        style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '4px', marginBottom: '1rem' }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />

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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem' }}>
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </span>
        <button
          onClick={handleSlowMotion}
          style={{
            padding: '0.5rem 1rem',
            background: slowMotion ? '#d4af37' : 'transparent',
            color: slowMotion ? '#000' : '#d4af37',
            border: '1px solid #d4af37',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {slowMotion ? '1x' : '0.5x'} Speed
        </button>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => skipFrame(-1)}
          style={{ flex: 1, padding: '0.75rem', background: '#333', color: '#d4af37', border: 'none', cursor: 'pointer' }}
        >
          <SkipBack size={20} style={{ margin: '0 auto' }} />
        </button>
        <button
          onClick={togglePlay}
          style={{ flex: 2, padding: '0.75rem', background: '#d4af37', color: '#000', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          {isPlaying ? <Pause size={20} style={{ margin: '0 auto' }} /> : <Play size={20} style={{ margin: '0 auto' }} />}
        </button>
        <button
          onClick={() => skipFrame(1)}
          style={{ flex: 1, padding: '0.75rem', background: '#333', color: '#d4af37', border: 'none', cursor: 'pointer' }}
        >
          <SkipForward size={20} style={{ margin: '0 auto' }} />
        </button>
      </div>
    </div>
  )
}
