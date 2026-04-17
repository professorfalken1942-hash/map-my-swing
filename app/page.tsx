'use client'

import { useState } from 'react'
import { Upload, Play, Pause, SkipBack, SkipForward } from 'lucide-react'

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setShowAnalysis(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f6f3 0%, #e8d5a5 100%)' }}>
      {/* Header */}
      <header style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--gold)' }}>⛳</span> Map My Swing
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
            Golf swing analyzer. Frame-by-frame breakdown, tempo analysis, and swing metrics.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
        {!videoFile ? (
          /* Upload Section */
          <div
            style={{
              border: '2px dashed var(--gold)',
              borderRadius: '8px',
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'rgba(212, 175, 55, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'
            }}
          >
            <Upload size={48} style={{ color: 'var(--gold)', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Upload Your Swing</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
              Drag and drop a video file here or click to browse
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ display: 'none' }}
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'var(--gold)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Choose Video
            </label>
          </div>
        ) : (
          /* Analysis Section */
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Video Player */}
            <div>
              <div
                style={{
                  background: '#000',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  color: '#fff',
                  fontSize: '1rem',
                }}
              >
                Video Player Placeholder
              </div>

              {/* Playback Controls */}
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1.5rem',
                  background: '#fff',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <button
                  onClick={() => setCurrentFrame(Math.max(0, currentFrame - 5))}
                  style={{ padding: '0.5rem', color: 'var(--gold)' }}
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ padding: '0.75rem 1.5rem', background: 'var(--gold)', color: '#fff' }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => setCurrentFrame(currentFrame + 5)}
                  style={{ padding: '0.5rem', color: 'var(--gold)' }}
                >
                  <SkipForward size={20} />
                </button>
                <div style={{ flex: 1, textAlign: 'right', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                  Frame: {currentFrame}
                </div>
              </div>
            </div>

            {/* Analysis Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--gold)' }}>📊 Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Tempo (rpm)</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>—</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Club Speed</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>—</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Plane</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>—</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Path</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>—</p>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--gold)' }}>💡 Insights</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>• Waiting for analysis...</li>
                </ul>
              </div>

              <button
                onClick={() => setVideoFile(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontWeight: 600,
                }}
              >
                Upload New Video
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
