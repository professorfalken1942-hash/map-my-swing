'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('VideoPlayer mounted with videoUrl:', videoUrl)
  }, [videoUrl])

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
        {error && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#111', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', padding: '1rem', textAlign: 'center', zIndex: 10 }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Video Playback Error</p>
              <p style={{ fontSize: '0.9rem' }}>{error}</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ width: '100%', height: '100%', background: '#000', borderRadius: '4px' }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
          onError={(e) => {
            const target = e.currentTarget
            let errorMsg = 'Unknown error'
            if (target.error) {
              switch (target.error.code) {
                case 1:
                  errorMsg = 'Loading aborted'
                  break
                case 2:
                  errorMsg = 'Network error'
                  break
                case 3:
                  errorMsg = 'Decoding failed'
                  break
                case 4:
                  errorMsg = 'Format not supported'
                  break
              }
            }
            setError(errorMsg)
            console.error('Video error:', errorMsg, target.error)
          }}
          controls={false}
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
