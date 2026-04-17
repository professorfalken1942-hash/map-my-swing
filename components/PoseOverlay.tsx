'use client'

export default function PoseOverlay() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #d4af37 0%, #e8d5a5 100%)',
        padding: '2rem',
        borderRadius: '4px',
        textAlign: 'center',
        color: '#000',
        marginBottom: '1rem',
      }}
    >
      <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>
        🎯 Pose Detection
      </p>
      <p style={{ fontSize: '1rem' }}>
        MediaPipe skeleton overlay will render here
      </p>
      <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
        Highlights: Hips • Shoulders • Joints
      </p>
    </div>
  )
}
