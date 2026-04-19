'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getSwingSessions, clearSessions, SwingSession } from '@/lib/storage'

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SwingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load sessions from localStorage
    const loadedSessions = getSwingSessions()
    setSessions(loadedSessions)
    setIsLoading(false)
  }, [])

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all swing history? This cannot be undone.')) {
      clearSessions()
      setSessions([])
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getMetricStatus = (metricName: 'hipRotation' | 'shoulderRotation' | 'tempoRatio', value: number) => {
    if (metricName === 'hipRotation') {
      if (value >= 35) return { color: '#4ade80', label: 'Good' }
      if (value >= 25) return { color: '#eab308', label: 'OK' }
      return { color: '#ef4444', label: 'Needs Work' }
    }
    if (metricName === 'shoulderRotation') {
      if (value >= 70) return { color: '#4ade80', label: 'Good' }
      if (value >= 55) return { color: '#eab308', label: 'OK' }
      return { color: '#ef4444', label: 'Needs Work' }
    }
    if (metricName === 'tempoRatio') {
      if (value >= 2.8 && value <= 3.2) return { color: '#4ade80', label: 'Good' }
      if (value >= 2.5 && value <= 3.5) return { color: '#eab308', label: 'OK' }
      return { color: '#ef4444', label: 'Needs Work' }
    }
    return { color: '#888', label: 'Unknown' }
  }

  const calculateTrend = (metric: 'hipRotation' | 'shoulderRotation' | 'tempoRatio') => {
    if (sessions.length < 2) return '→ New'

    const last3 = sessions.slice(0, 3)
    const values = last3.map((s) => s.metrics[metric])
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const firstVal = values[0]
    const lastVal = values[values.length - 1]

    const change = ((firstVal - lastVal) / lastVal) * 100
    if (change > 5) return '↑ Improving'
    if (change < -5) return '↓ Declining'
    return '→ Consistent'
  }

  const chartData = sessions.slice(0, 10).reverse()

  const customTooltip = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #d4af37',
          padding: '0.5rem',
          color: '#fff',
          borderRadius: '4px',
        }}>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem' }}>
            {payload[0].name}: {(payload[0].value as number).toFixed(1)}
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading history...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', color: '#fff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, margin: 0 }}>Swing History</h1>
          <Link href="/" style={{
            background: 'transparent',
            border: '1px solid #d4af37',
            color: '#d4af37',
            padding: '0.5rem 1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            ← Back
          </Link>
        </div>

        {sessions.length === 0 ? (
          // Empty state
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#888',
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No swings yet. Record your first swing.</p>
            <Link href="/" style={{
              display: 'inline-block',
              background: '#d4af37',
              color: '#1a1a1a',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
              textDecoration: 'none',
              borderRadius: '4px',
            }}>
              Record Your First Swing
            </Link>
          </div>
        ) : (
          <>
            {/* Session List */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#d4af37' }}>Recent Swings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sessions.map((session) => {
                  const hipStatus = getMetricStatus('hipRotation', session.metrics.hipRotation)
                  const shoulderStatus = getMetricStatus('shoulderRotation', session.metrics.shoulderRotation)
                  const tempoStatus = getMetricStatus('tempoRatio', session.metrics.tempoRatio)

                  return (
                    <div
                      key={session.id}
                      style={{
                        background: '#222',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 3fr',
                        gap: '1.5rem',
                        alignItems: 'start',
                      }}
                    >
                      {/* Date */}
                      <div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#888' }}>Date</p>
                        <p style={{ margin: 0, fontWeight: 600 }}>{formatDate(session.createdAt)}</p>
                      </div>

                      {/* Metrics Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {/* Hip Rotation */}
                        <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '6px', borderLeft: `4px solid ${hipStatus.color}` }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#888' }}>Hip Rotation</p>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.3rem', fontWeight: 600 }}>
                            {session.metrics.hipRotation.toFixed(1)}°
                          </p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: hipStatus.color }}>
                            {hipStatus.label}
                          </p>
                        </div>

                        {/* Shoulder Rotation */}
                        <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '6px', borderLeft: `4px solid ${shoulderStatus.color}` }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#888' }}>Shoulder Turn</p>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.3rem', fontWeight: 600 }}>
                            {session.metrics.shoulderRotation.toFixed(1)}°
                          </p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: shoulderStatus.color }}>
                            {shoulderStatus.label}
                          </p>
                        </div>

                        {/* Tempo Ratio */}
                        <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '6px', borderLeft: `4px solid ${tempoStatus.color}` }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#888' }}>Swing Tempo</p>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.3rem', fontWeight: 600 }}>
                            {session.metrics.tempoRatio.toFixed(2)}x
                          </p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: tempoStatus.color }}>
                            {tempoStatus.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Charts - Only show if 2+ sessions */}
            {sessions.length >= 2 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#d4af37' }}>Progress Over Time</h2>

                {/* Hip Rotation Chart */}
                <div style={{ marginBottom: '2rem', background: '#222', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Hip Rotation</h3>
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>{calculateTrend('hipRotation')}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis stroke="#666" tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#666' }} />
                      <Tooltip content={customTooltip} />
                      <Line
                        type="monotone"
                        dataKey={(d) => d.metrics.hipRotation}
                        stroke="#d4af37"
                        dot={{ fill: '#d4af37', r: 4 }}
                        name="Hip Rotation"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Shoulder Rotation Chart */}
                <div style={{ marginBottom: '2rem', background: '#222', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Shoulder Turn</h3>
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>{calculateTrend('shoulderRotation')}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis stroke="#666" tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#666' }} />
                      <Tooltip content={customTooltip} />
                      <Line
                        type="monotone"
                        dataKey={(d) => d.metrics.shoulderRotation}
                        stroke="#d4af37"
                        dot={{ fill: '#d4af37', r: 4 }}
                        name="Shoulder Rotation"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Tempo Ratio Chart */}
                <div style={{ background: '#222', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Swing Tempo</h3>
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>{calculateTrend('tempoRatio')}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis stroke="#666" tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#666' }} />
                      <Tooltip content={customTooltip} />
                      <Line
                        type="monotone"
                        dataKey={(d) => d.metrics.tempoRatio}
                        stroke="#d4af37"
                        dot={{ fill: '#d4af37', r: 4 }}
                        name="Tempo Ratio"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Clear History Button */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #333', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleClearHistory}
                style={{
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  borderRadius: '4px',
                }}
              >
                🗑️ Clear All History
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
