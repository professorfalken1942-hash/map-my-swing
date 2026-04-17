'use client'

import { useState, useRef } from 'react'

interface CameraScreenProps {
  onRecordComplete: (blob: Blob) => void
}

export default function CameraScreen({ onRecordComplete }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraReady(true)
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      alert('Please allow camera access to record your swing')
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
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>Record Your Swing</h1>

      {!isCameraReady ? (
        <button
          onClick={startCamera}
          style={{
            padding: '1rem 2rem',
            background: '#d4af37',
            color: '#000',
            border: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          📷 Start Camera
        </button>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: '#000',
              marginBottom: '2rem',
              borderRadius: '4px',
            }}
          />

          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              padding: '1rem 2rem',
              background: isRecording ? '#ef4444' : '#d4af37',
              color: isRecording ? '#fff' : '#000',
              border: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              borderRadius: '4px',
              width: '100%',
            }}
          >
            {isRecording ? '⏹ Stop Recording' : '🔴 Start Recording'}
          </button>

          {isRecording && (
            <p style={{ marginTop: '1rem', color: '#ef4444', fontWeight: 600 }}>
              ● Recording...
            </p>
          )}
        </>
      )}
    </div>
  )
}
