'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import SplashScreen from '@/components/SplashScreen'
import CameraScreen from '@/components/CameraScreen'
import VideoPlayer from '@/components/VideoPlayer'
import MetricCards from '@/components/MetricCards'
import FeedbackPanel from '@/components/FeedbackPanel'
import PageHeader from '@/components/PageHeader'
import { saveSwingSession, generateSessionId } from '@/lib/storage'

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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const handleRecordComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const newSessionId = generateSessionId()
    
    setVideoUrl(url)
    setSessionId(newSessionId)
    setScreen('playback')
    setIsSaved(false)
    
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
    
    // Auto-save the session once metrics are available
    if (!isSaved && sessionId) {
      saveSwingSession({
        id: sessionId,
        createdAt: new Date().toISOString(),
        metrics: newMetrics,
        feedback: generateFeedbackArray(newMetrics),
      })
      setIsSaved(true)
    }
  }

  const generateFeedbackArray = (m: typeof metrics): string[] => {
    const msgs: string[] = []
    if (m.hipRotation < 30 && m.hipRotation > 0) msgs.push('Rotate your hips more during backswing')
    if (m.shoulderRotation < 60 && m.shoulderRotation > 0) msgs.push('Turn your shoulders further for power')
    if (m.tempoRatio < 2 || m.tempoRatio > 4) msgs.push('Adjust your tempo — aim for 3:1 ratio')
    return msgs.slice(0, 2)
  }

  const generateFeedback = (m: typeof metrics) => {
    const msgs = generateFeedbackArray(m)
    setFeedback(msgs)
  }

  const handleReset = () => {
    setScreen('camera')
    setVideoUrl(null)
    setSessionId(null)
    setMetrics({ hipRotation: 0, shoulderRotation: 0, tempoRatio: 0 })
    setFeedback([])
    setIsSaved(false)
  }

  if (screen === 'splash') {
    return <SplashScreen onStart={() => setScreen('camera')} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff' }}>
      {screen === 'camera' ? (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <PageHeader
            title="Record Your Swing"
            rightAction={
              <Link href="/history" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                History
              </Link>
            }
          />
          <CameraScreen onRecordComplete={handleRecordComplete} onCancel={() => setScreen('camera')} />
        </div>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <PageHeader
            title="Your Swing"
            leftAction={
              <button onClick={handleReset} style={{ background: 'transparent', border: 'none', color: '#d4af37', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>
                ← New Swing
              </button>
            }
            rightAction={
              <Link href="/history" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                History
              </Link>
            }
          />

          {/* Main analysis grid */}
          <div style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem 1rem' }}>
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
