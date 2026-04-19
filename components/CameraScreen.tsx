'use client'

import { useState, useRef } from 'react'
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
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '340px',
    letterSpacing: '0.02em',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={mode === 'choose' ? 'Analyze Your Swing' : mode === 'camera' ? 'Record Your Swing' : 'Upload a Swing'}
        leftAction={
          <button
            onClick={() => mode === 'choose' ? onCancel?.() : setMode('choose')}
            style={{ background: 'transparent', border: 'none', color: '#d4af37', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
          >
            ← {mode === 'choose' ? 'Back' : 'Change'}
          </button>
        }
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

        {/* Choose mode */}
        {mode === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
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

        {/* Camera mode */}
        {mode === 'camera' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
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
              <p style={{ color: '#888', textAlign: 'center' }}>Starting camera...</p>
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
        )}
      </div>
    </div>
  )
}
