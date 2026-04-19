'use client'

import { useState, useRef } from 'react'
import PageHeader from '@/components/PageHeader'

interface CameraScreenProps {
  onRecordComplete: (blob: Blob) => void
  onCancel?: () => void
}

export default function CameraScreen({ onRecordComplete, onCancel }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      console.log('Camera stream acquired:', stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraReady(true)
        console.log('Camera ready')
      }
    } catch (error) {
      console.error('Camera access error:', error)
      alert(`Camera error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return

    const stream = videoRef.current.srcObject as MediaStream
    const mediaRecorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      onRecordComplete(blob)
    }

    mediaRecorder.start()
    mediaRecorderRef.current = mediaRecorder
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Record Your Swing"
        leftAction={onCancel && (
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#d4af37', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>
            ← Back
          </button>
        )}
      />

      {/* Main content */}
      <div style={{ flex: 1, maxWidth: '100%', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Video always in DOM so ref is available before isCameraReady */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: 'calc(100vh - 220px)',
            objectFit: 'cover',
            background: '#000',
            marginBottom: '1.5rem',
            display: isCameraReady ? 'block' : 'none',
          }}
        />

        {!isCameraReady ? (
          <button
            onClick={startCamera}
            style={{
              padding: '1.5rem 2rem',
              background: '#d4af37',
              color: '#000',
              border: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
            }}
          >
            📷 Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                padding: '1rem',
                background: isRecording ? '#ef4444' : '#d4af37',
                color: isRecording ? '#fff' : '#000',
                border: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              {isRecording ? '⏹ Stop Recording' : '🔴 Start Recording'}
            </button>

            {isRecording && (
              <p style={{ marginTop: '1rem', color: '#ef4444', fontWeight: 600, textAlign: 'center' }}>
                ● Recording...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
