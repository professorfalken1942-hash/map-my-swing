'use client'

interface MetricsProps {
  metrics: {
    hipRotation: number
    shoulderRotation: number
    tempoRatio: number
  }
}

export default function MetricCards({ metrics }: MetricsProps) {
  const getStatus = (value: number, min: number, max: number) => {
    if (value < min) return { status: 'needs work', color: '#ef4444' }
    if (value > max) return { status: 'too much', color: '#eab308' }
    return { status: 'good', color: '#22c55e' }
  }

  const hipStatus = getStatus(metrics.hipRotation, 30, 45)
  const shoulderStatus = getStatus(metrics.shoulderRotation, 60, 90)
  const tempoStatus = getStatus(metrics.tempoRatio, 2, 4)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '4px', border: `2px solid ${hipStatus.color}` }}>
        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem' }}>Hip Rotation</p>
        <p style={{ fontSize: '2rem', fontWeight: 600, color: hipStatus.color }}>
          {metrics.hipRotation.toFixed(1)}°
        </p>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
          {hipStatus.status}
        </p>
      </div>

      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '4px', border: `2px solid ${shoulderStatus.color}` }}>
        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem' }}>Shoulder Rotation</p>
        <p style={{ fontSize: '2rem', fontWeight: 600, color: shoulderStatus.color }}>
          {metrics.shoulderRotation.toFixed(1)}°
        </p>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
          {shoulderStatus.status}
        </p>
      </div>

      <div style={{ background: '#222', padding: '1.5rem', borderRadius: '4px', border: `2px solid ${tempoStatus.color}` }}>
        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem' }}>Tempo Ratio</p>
        <p style={{ fontSize: '2rem', fontWeight: 600, color: tempoStatus.color }}>
          {metrics.tempoRatio.toFixed(2)}:1
        </p>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
          {tempoStatus.status}
        </p>
      </div>
    </div>
  )
}
