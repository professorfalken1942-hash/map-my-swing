'use client'

import { useState, useRef } from 'react'
import SplashScreen from '@/components/SplashScreen'
import CameraScreen from '@/components/CameraScreen'
import VideoPlayer from '@/components/VideoPlayer'
import PoseOverlay from '@/components/PoseOverlay'
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
    
    // Simulate metrics (will be replaced with real MediaPipe)
    setMetrics({
      hipRotation: Math.random() * 60,
      shoulderRotation: Math.random() * 100,
      tempoRatio: 2 + Math.random() * 2,
    })

    // Generate feedback based on metrics
    generateFeedback(metrics)
  }

  const generateFeedback = (m: typeof metrics) => {
    const msgs: string[] = []
    if (m.hipRotation < 30) msgs.push('Rotate your hips more during backswing')
    if (m.shoulderRotation < 60) msgs.push('Turn your shoulders further for power')
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
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', padding: '1rem' }}>
      {screen === 'camera' ? (
        <CameraScreen onRecordComplete={handleRecordComplete} />
      ) : (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>Your Swing</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Video + Overlay */}
            <div>
              {videoUrl && (
                <>
                  <VideoPlayer videoUrl={videoUrl} />
                  <PoseOverlay />
                </>
              )}
            </div>

            {/* Metrics + Feedback */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <MetricCards metrics={metrics} />
              <FeedbackPanel feedback={feedback} />
            </div>
          </div>

          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#d4af37',
              color: '#000',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Record New Swing
          </button>
        </div>
      )}
    </div>
  )
}
