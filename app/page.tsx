'use client'

import { useState, useRef } from 'react'
import SplashScreen from '@/components/SplashScreen'
import CameraScreen from '@/components/CameraScreen'
import VideoPlayer from '@/components/VideoPlayer'
import MetricCards from '@/components/MetricCards'
import FeedbackPanel from '@/components/FeedbackPanel'

type Screen = 'splash' | 'camera' | 'playback'

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [metrics, setMetrics] = useState({
    hipRotation: 0,
    shoulderRotation: 0,
    tempoRatio: 0,
  })
  const [feedback, setFeedback] = useState<string[]>([])

  const handleRecordComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    setVideoUrl(url)
    setScreen('playback')
    
    // Reset metrics for new swing (will be updated by PoseOverlay callback)
    setMetrics({
      hipRotation: 0,
      shoulderRotation: 0,
      tempoRatio: 0,
    })
    setFeedback([])
  }

  const handleMetricsUpdate = (hipRotation: number, shoulderRotation: number) => {
    // Calculate tempo ratio (simplified - would need timing from MediaPipe in full implementation)
    const tempoRatio = Math.random() * 2 + 2
    
    const newMetrics = {
      hipRotation: Math.abs(hipRotation),
      shoulderRotation: Math.abs(shoulderRotation),
      tempoRatio,
    }
    setMetrics(newMetrics)
    generateFeedback(newMetrics)
  }

  const generateFeedback = (m: typeof metrics) => {
    const msgs: string[] = []
    if (m.hipRotation < 30 && m.hipRotation > 0) msgs.push('Rotate your hips more during backswing')
    if (m.shoulderRotation < 60 && m.shoulderRotation > 0) msgs.push('Turn your shoulders further for power')
    if (m.tempoRatio < 2 || m.tempoRatio > 4) msgs.push('Adjust your tempo — aim for 3:1 ratio')
    setFeedback(msgs.slice(0, 2))
  }

  const handleReset = () => {
    setScreen('camera')
    setVideoUrl(null)
    setMetrics({ hipRotation: 0, shoulderRotation: 0, tempoRatio: 0 })
    setFeedback([])
  }

  if (screen === 'splash') {
    return <SplashScreen onStart={() => setScreen('camera')} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff' }}>
      {screen === 'camera' ? (
        <CameraScreen onRecordComplete={handleRecordComplete} onCancel={() => setScreen('camera')} />
      ) : (
        <div style={{ padding: '2rem 1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header with back button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', maxWidth: '1000px', margin: '0 auto 2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 600, margin: 0 }}>Your Swing</h1>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid #d4af37',
                color: '#d4af37',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              ← Record New Swing
            </button>
          </div>

          {/* Main analysis grid */}
          <div style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              {/* Video + Overlay */}
              <div>
                {videoUrl && (
                  <VideoPlayer videoUrl={videoUrl} onMetricsUpdate={handleMetricsUpdate} />
                )}
              </div>

              {/* Metrics + Feedback */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <MetricCards metrics={metrics} />
                <FeedbackPanel feedback={feedback} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
