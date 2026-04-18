'use client'

import { useState, useRef } from 'react'

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
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      {/* Header with back button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, margin: 0 }}>Record Your Swing</h1>
        {onCancel && (
          <button
            onClick={onCancel}
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
            ← Back
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Video always in DOM so ref is available before isCameraReady */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            aspectRatio: '16/9',
            background: '#000',
            marginBottom: '2rem',
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
