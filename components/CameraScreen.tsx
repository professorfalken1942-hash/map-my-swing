'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

interface CameraScreenProps {
  onRecordComplete: (blob: Blob) => void
  onCancel?: () => void
}

type Mode = 'choose' | 'camera' | 'upload'

export default function CameraScreen({ onRecordComplete, onCancel }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<Mode>('choose')
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const startCamera = async () => {
    setMode('camera')
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
      console.error('Camera access error:', error)
      alert(`Camera error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setMode('choose')
    }
  }

  const stopCameraStream = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      if (videoRef.current) videoRef.current.srcObject = null
    }
    setIsCameraReady(false)
  }

  useEffect(() => {
    return () => stopCameraStream()
  }, [])

  const handleBack = () => {
    if (mode === 'choose') {
      onCancel?.()
    } else {
      stopCameraStream()
      setMode('choose')
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const blob = new Blob([file], { type: file.type })
    onRecordComplete(blob)
  }

  const btnStyle = {
    padding: '1.25rem 2rem',
    border: '1px solid #d4af37',
    fontWeight: 600,
    fontSize: 'clamp(0.95rem, 4vw, 1rem)',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '340px',
    letterSpacing: '0.02em',
    minHeight: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={mode === 'choose' ? 'Analyze Your Swing' : mode === 'camera' ? 'Record Your Swing' : 'Upload a Swing'}
        leftAction={
          <button
            onClick={handleBack}
            style={{ background: 'transparent', border: 'none', color: '#d4af37', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', padding: 0, minHeight: '44px', display: 'flex', alignItems: 'center' }}
          >
            ← {mode === 'choose' ? 'Back' : 'Change'}
          </button>
        }
        rightAction={
          <Link href="/history" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, minHeight: '44px', display: 'flex', alignItems: 'center' }}>
            History
          </Link>
        }
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '100%' }}>

        {/* Choose mode */}
        {mode === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Choose how to add your swing
            </p>
            <button
              onClick={startCamera}
              style={{ ...btnStyle, background: '#d4af37', color: '#000', border: 'none' }}
            >
              🎥 Record Live
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ ...btnStyle, background: 'transparent', color: '#d4af37' }}
            >
              📁 Upload from Device
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* Video — always in DOM so ref is available before camera starts */}
        <div style={{ width: '100%', display: mode === 'camera' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              flex: 1,
              objectFit: 'cover',
              background: '#000',
              marginBottom: '1rem',
              display: isCameraReady ? 'block' : 'none',
              minHeight: '300px',
            }}
          />
          {mode === 'camera' && !isCameraReady && (
            <p style={{ color: '#888', textAlign: 'center' }}>Starting camera...</p>
          )}
          {mode === 'camera' && isCameraReady && (
            <>
              <div style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingBottom: '1rem' }}>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    background: isRecording ? '#ef4444' : '#d4af37',
                    color: isRecording ? '#fff' : '#000',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 'clamp(0.95rem, 4vw, 1.1rem)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    minHeight: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isRecording ? '⏹ Stop Recording' : '🔴 Start Recording'}
                </button>
              </div>
              {isRecording && (
                <p style={{ marginTop: 0, marginBottom: '1rem', color: '#ef4444', fontWeight: 600, textAlign: 'center', fontSize: '1rem' }}>
                  ● Recording...
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
