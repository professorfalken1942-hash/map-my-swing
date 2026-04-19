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

  const cardStyle = {
    background: '#222',
    padding: '1rem',
    borderRadius: '4px',
    flex: 1,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  }

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .metric-cards {
            display: flex;
            flex-direction: row;
            gap: 0.75rem;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 0.5rem;
          }
          .metric-card {
            flex: 0 0 calc(33.333% - 0.5rem);
            scroll-snap-align: start;
          }
        }
        @media (min-width: 768px) {
          .metric-cards {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .metric-card {
            width: 100%;
          }
        }
      `}</style>
      <div className="metric-cards">
        <div className="metric-card" style={{ ...cardStyle, border: `2px solid ${hipStatus.color}` }}>
          <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem', margin: 0 }}>Hip Rotation</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: hipStatus.color, margin: '0.25rem 0' }}>
            {metrics.hipRotation.toFixed(1)}°
          </p>
          <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.5rem', margin: '0.25rem 0 0 0' }}>
            {hipStatus.status}
          </p>
        </div>

        <div className="metric-card" style={{ ...cardStyle, border: `2px solid ${shoulderStatus.color}` }}>
          <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem', margin: 0 }}>Shoulder Turn</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: shoulderStatus.color, margin: '0.25rem 0' }}>
            {metrics.shoulderRotation.toFixed(1)}°
          </p>
          <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.5rem', margin: '0.25rem 0 0 0' }}>
            {shoulderStatus.status}
          </p>
        </div>

        <div className="metric-card" style={{ ...cardStyle, border: `2px solid ${tempoStatus.color}` }}>
          <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem', margin: 0 }}>Tempo Ratio</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: tempoStatus.color, margin: '0.25rem 0' }}>
            {metrics.tempoRatio.toFixed(2)}:1
          </p>
          <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.5rem', margin: '0.25rem 0 0 0' }}>
            {tempoStatus.status}
          </p>
        </div>
      </div>
    </>
  )
}
