'use client'

import { useEffect, useRef, useState } from 'react'
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision'

interface PoseOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  onMetricsUpdate?: (hipRotation: number, shoulderRotation: number) => void
}

// Key landmarks for golf
const LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
}

// Skeleton connections to draw
const SKELETON_CONNECTIONS = [
  // Shoulders
  [LANDMARKS.LEFT_SHOULDER, LANDMARKS.RIGHT_SHOULDER],
  // Left arm
  [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_ELBOW],
  [LANDMARKS.LEFT_ELBOW, LANDMARKS.LEFT_WRIST],
  // Right arm
  [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_ELBOW],
  [LANDMARKS.RIGHT_ELBOW, LANDMARKS.RIGHT_WRIST],
  // Torso
  [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP],
  [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_HIP],
  [LANDMARKS.LEFT_HIP, LANDMARKS.RIGHT_HIP],
  // Left leg
  [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
  // Right leg
  [LANDMARKS.RIGHT_HIP, LANDMARKS.RIGHT_KNEE],
]

// Key joints to highlight (most important for golf)
const KEY_JOINTS = [
  LANDMARKS.LEFT_HIP,
  LANDMARKS.RIGHT_HIP,
  LANDMARKS.LEFT_SHOULDER,
  LANDMARKS.RIGHT_SHOULDER,
]

export default function PoseOverlay({
  videoRef,
  onMetricsUpdate,
}: PoseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const frameCountRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize MediaPipe
  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/pose_landmarker_lite.task',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })
        poseLandmarkerRef.current = landmarker
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load MediaPipe')
        setIsLoading(false)
      }
    }

    initMediaPipe()

    return () => {
      poseLandmarkerRef.current?.close()
    }
  }, [])

  // Calculate angle between three points
  const calculateAngle = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
  ): number => {
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x)
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x)
    let angle = Math.abs(angle1 - angle2) * (180 / Math.PI)
    if (angle > 180) angle = 360 - angle
    return angle
  }

  // Calculate rotation angle (angle between left and right landmarks)
  const calculateRotation = (
    leftLandmark: { x: number; y: number },
    rightLandmark: { x: number; y: number }
  ): number => {
    const dx = rightLandmark.x - leftLandmark.x
    const dy = rightLandmark.y - leftLandmark.y
    return Math.atan2(dy, dx) * (180 / Math.PI)
  }

  // Draw the pose overlay
  const drawPose = (landmarks: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Scale factors to match video dimensions
    const scaleX = canvas.width
    const scaleY = canvas.height

    // Draw skeleton connections (lines)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'

    for (const [start, end] of SKELETON_CONNECTIONS) {
      const startLandmark = landmarks[start]
      const endLandmark = landmarks[end]

      if (startLandmark?.visibility > 0.5 && endLandmark?.visibility > 0.5) {
        ctx.beginPath()
        ctx.moveTo(startLandmark.x * scaleX, startLandmark.y * scaleY)
        ctx.lineTo(endLandmark.x * scaleX, endLandmark.y * scaleY)
        ctx.stroke()
      }
    }

    // Draw joints
    landmarks.forEach((landmark: any, index: number) => {
      if (landmark.visibility < 0.5) return

      const x = landmark.x * scaleX
      const y = landmark.y * scaleY

      // Key joints: bright gold, larger
      if (KEY_JOINTS.includes(index)) {
        ctx.fillStyle = '#d4af37'
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Other joints: slightly faded, smaller
        ctx.fillStyle = 'rgba(212, 175, 55, 0.7)'
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Calculate and report metrics
    if (onMetricsUpdate) {
      const leftHip = landmarks[LANDMARKS.LEFT_HIP]
      const rightHip = landmarks[LANDMARKS.RIGHT_HIP]
      const leftShoulder = landmarks[LANDMARKS.LEFT_SHOULDER]
      const rightShoulder = landmarks[LANDMARKS.RIGHT_SHOULDER]

      if (
        leftHip?.visibility > 0.5 &&
        rightHip?.visibility > 0.5
      ) {
        const hipRotation = calculateRotation(leftHip, rightHip)
        const shoulderRotation =
          leftShoulder?.visibility > 0.5 && rightShoulder?.visibility > 0.5
            ? calculateRotation(leftShoulder, rightShoulder)
            : 0

        onMetricsUpdate(hipRotation, shoulderRotation)
      }
    }
  }

  // Animation loop
  useEffect(() => {
    if (!videoRef.current || !poseLandmarkerRef.current || !canvasRef.current) return

    const processFrame = () => {
      const video = videoRef.current
      const canvas = canvasRef.current

      if (!video || !canvas || video.paused || video.ended) {
        animationIdRef.current = requestAnimationFrame(processFrame)
        return
      }

      // Sample every 3rd frame to maintain 60fps UI
      frameCountRef.current++
      if (frameCountRef.current % 3 === 0) {
        try {
          const results = poseLandmarkerRef.current!.detectForVideo(
            video,
            performance.now()
          )

          if (results.landmarks && results.landmarks.length > 0) {
            drawPose(results.landmarks[0])
          } else {
            // No pose detected, clear canvas
            const ctx = canvas.getContext('2d')
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
          }
        } catch (err) {
          console.error('Pose detection error:', err)
        }
      }

      animationIdRef.current = requestAnimationFrame(processFrame)
    }

    animationIdRef.current = requestAnimationFrame(processFrame)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [videoRef, onMetricsUpdate])

  // Sync canvas size with video
  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
      }
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [videoRef])

  if (isLoading) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: '#1a1a1a',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d4af37',
        }}
      >
        Loading MediaPipe...
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: '#1a1a1a',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6b6b',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <div>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            Pose Detection Unavailable
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '4px',
      }}
    />
  )
}
