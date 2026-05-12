'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Target,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { clearSessions, getSwingSessions, SwingSession } from '@/lib/storage'

type MetricKey = 'hipRotation' | 'shoulderRotation' | 'tempoRatio'

type MetricStatus = {
  color: string
  label: string
  tone: 'good' | 'ok' | 'work'
}

const metricLabels: Record<MetricKey, string> = {
  hipRotation: 'Hip rotation',
  shoulderRotation: 'Shoulder turn',
  tempoRatio: 'Tempo',
}

const metricUnits: Record<MetricKey, string> = {
  hipRotation: 'deg',
  shoulderRotation: 'deg',
  tempoRatio: ':1',
}

const metricOrder: MetricKey[] = ['hipRotation', 'shoulderRotation', 'tempoRatio']

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SwingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setSessions(getSwingSessions())
    setIsLoading(false)
  }, [])

  const latestSession = sessions[0]

  const historySummary = useMemo(() => {
    if (!latestSession) return null

    const weakestMetric = getWeakestMetric(latestSession)
    const strongestMetric = getStrongestMetric(latestSession)
    const trendItems = metricOrder.map((metric) => getTrendSummary(sessions, metric))
    const nextFocus = latestSession.feedback[0] || getFocusMessage(weakestMetric.metric)

    return {
      strongestMetric,
      weakestMetric,
      trendItems,
      nextFocus,
    }
  }, [latestSession, sessions])

  const handleClearHistory = () => {
    if (window.confirm('Delete all swing history? This cannot be undone.')) {
      clearSessions()
      setSessions([])
    }
  }

  if (isLoading) {
    return (
      <div style={styles.loadingPage}>
        <p style={{ color: '#d8cfba' }}>Loading history...</p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <PageHeader
        title="Swing History"
        leftAction={
          <Link href="/" style={styles.headerLink}>
            <ArrowLeft size={17} aria-hidden="true" />
            <span>Back</span>
          </Link>
        }
      />

      <main style={styles.main}>
        <style>{responsiveStyles}</style>

        {sessions.length === 0 ? (
          <EmptyState />
        ) : latestSession && historySummary ? (
          <>
            <section className="history-hero" style={styles.hero}>
              <div style={styles.heroTopline}>
                <CalendarDays size={17} aria-hidden="true" />
                <span>{formatDate(latestSession.createdAt)}</span>
              </div>

              <div className="history-hero-grid" style={styles.heroGrid}>
                <div>
                  <p style={styles.eyebrow}>Latest swing</p>
                  <h2 style={styles.heroTitle}>{getSessionHeadline(latestSession)}</h2>
                  <p style={styles.heroCopy}>{historySummary.nextFocus}</p>
                </div>

                <div className="history-hero-metrics" style={styles.heroMetrics}>
                  <MetricSpotlight
                    title="Best"
                    metric={historySummary.strongestMetric.metric}
                    value={historySummary.strongestMetric.value}
                    status={historySummary.strongestMetric.status}
                  />
                  <MetricSpotlight
                    title="Focus"
                    metric={historySummary.weakestMetric.metric}
                    value={historySummary.weakestMetric.value}
                    status={historySummary.weakestMetric.status}
                  />
                </div>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeadingRow}>
                <div>
                  <p style={styles.eyebrow}>Progress</p>
                  <h2 style={styles.sectionTitle}>Last {Math.min(sessions.length, 3)} swings</h2>
                </div>
                <span style={styles.countPill}>{sessions.length} saved</span>
              </div>

              <div className="trend-grid" style={styles.trendGrid}>
                {historySummary.trendItems.map((item) => (
                  <TrendCard key={item.metric} item={item} />
                ))}
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeadingRow}>
                <div>
                  <p style={styles.eyebrow}>Log</p>
                  <h2 style={styles.sectionTitle}>Recent swings</h2>
                </div>
                <Link href="/" style={styles.primarySmallLink}>
                  Record swing
                </Link>
              </div>

              <div style={styles.sessionList}>
                {sessions.map((session, index) => (
                  <SessionListItem
                    key={session.id}
                    index={index}
                    session={session}
                  />
                ))}
              </div>
            </section>

            <section style={styles.manageSection}>
              <details style={styles.manageDetails}>
                <summary style={styles.manageSummary}>
                  <span>Manage history</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <div style={styles.manageBody}>
                  <p style={styles.manageCopy}>
                    This only clears swing data saved in this browser.
                  </p>
                  <button onClick={handleClearHistory} style={styles.dangerButton}>
                    <Trash2 size={17} aria-hidden="true" />
                    <span>Clear all history</span>
                  </button>
                </div>
              </details>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}

function EmptyState() {
  return (
    <section style={styles.emptyState}>
      <div style={styles.emptyIcon}>
        <Activity size={26} aria-hidden="true" />
      </div>
      <p style={styles.eyebrow}>No swings saved</p>
      <h2 style={styles.emptyTitle}>Record your first swing.</h2>
      <p style={styles.emptyCopy}>
        Keep your full body in frame so Map My Swing can track your turn and tempo.
      </p>
      <Link href="/" style={styles.primaryLink}>
        Record swing
      </Link>
    </section>
  )
}

function MetricSpotlight({
  title,
  metric,
  value,
  status,
}: {
  title: string
  metric: MetricKey
  value: number
  status: MetricStatus
}) {
  return (
    <div style={styles.spotlightCard}>
      <p style={styles.spotlightTitle}>{title}</p>
      <div style={styles.metricValueRow}>
        <span style={{ ...styles.metricValue, color: status.color }}>
          {formatMetricValue(metric, value)}
        </span>
        <span style={{ ...styles.statusDot, background: status.color }} />
      </div>
      <p style={styles.metricName}>{metricLabels[metric]}</p>
      <p style={{ ...styles.statusLabel, color: status.color }}>{status.label}</p>
    </div>
  )
}

function TrendCard({
  item,
}: {
  item: ReturnType<typeof getTrendSummary>
}) {
  return (
    <article style={styles.trendCard}>
      <div style={styles.trendIcon}>
        <TrendingUp size={17} aria-hidden="true" />
      </div>
      <div>
        <p style={styles.trendLabel}>{metricLabels[item.metric]}</p>
        <p style={styles.trendValue}>{item.label}</p>
        <p style={styles.trendCopy}>{item.copy}</p>
      </div>
    </article>
  )
}

function SessionListItem({
  session,
  index,
}: {
  session: SwingSession
  index: number
}) {
  const weakestMetric = getWeakestMetric(session)
  const strongestMetric = getStrongestMetric(session)
  const primaryFeedback = session.feedback[0] || getFocusMessage(weakestMetric.metric)

  return (
    <details style={styles.sessionCard} open={index === 0}>
      <summary style={styles.sessionSummary}>
        <div style={styles.sessionMain}>
          <div style={styles.sessionIcon}>
            <Target size={18} aria-hidden="true" />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={styles.sessionDate}>{formatDate(session.createdAt)}</p>
            <p style={styles.sessionFeedback}>{primaryFeedback}</p>
          </div>
        </div>
        <div style={styles.sessionScoreWrap}>
          <span style={{ ...styles.sessionStatus, color: strongestMetric.status.color }}>
            {getSessionStatus(session)}
          </span>
          <ChevronDown size={18} aria-hidden="true" />
        </div>
      </summary>

      <div className="session-detail-grid" style={styles.sessionDetailGrid}>
        {metricOrder.map((metric) => {
          const value = session.metrics[metric]
          const status = getMetricStatus(metric, value)

          return (
            <div key={metric} style={styles.detailMetric}>
              <p style={styles.detailLabel}>{metricLabels[metric]}</p>
              <p style={{ ...styles.detailValue, color: status.color }}>
                {formatMetricValue(metric, value)}
              </p>
              <p style={styles.detailStatus}>{status.label}</p>
            </div>
          )
        })}
      </div>
    </details>
  )
}

function formatDate(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getMetricStatus(metricName: MetricKey, value: number): MetricStatus {
  if (metricName === 'hipRotation') {
    if (value >= 35) return { color: '#4ade80', label: 'Good', tone: 'good' }
    if (value >= 25) return { color: '#eab308', label: 'Close', tone: 'ok' }
    return { color: '#ef4444', label: 'Needs work', tone: 'work' }
  }

  if (metricName === 'shoulderRotation') {
    if (value >= 70) return { color: '#4ade80', label: 'Good', tone: 'good' }
    if (value >= 55) return { color: '#eab308', label: 'Close', tone: 'ok' }
    return { color: '#ef4444', label: 'Needs work', tone: 'work' }
  }

  if (value >= 2.8 && value <= 3.2) return { color: '#4ade80', label: 'Good', tone: 'good' }
  if (value >= 2.5 && value <= 3.5) return { color: '#eab308', label: 'Close', tone: 'ok' }
  return { color: '#ef4444', label: 'Needs work', tone: 'work' }
}

function getMetricScore(metric: MetricKey, value: number) {
  const status = getMetricStatus(metric, value)
  if (status.tone === 'good') return 3
  if (status.tone === 'ok') return 2
  return 1
}

function getStrongestMetric(session: SwingSession) {
  const metric = [...metricOrder].sort((a, b) => (
    getMetricScore(b, session.metrics[b]) - getMetricScore(a, session.metrics[a])
  ))[0]

  return {
    metric,
    value: session.metrics[metric],
    status: getMetricStatus(metric, session.metrics[metric]),
  }
}

function getWeakestMetric(session: SwingSession) {
  const metric = [...metricOrder].sort((a, b) => (
    getMetricScore(a, session.metrics[a]) - getMetricScore(b, session.metrics[b])
  ))[0]

  return {
    metric,
    value: session.metrics[metric],
    status: getMetricStatus(metric, session.metrics[metric]),
  }
}

function getTrendSummary(sessions: SwingSession[], metric: MetricKey) {
  if (sessions.length < 2) {
    return {
      metric,
      label: 'New',
      copy: 'Record another swing to see progress.',
    }
  }

  const latest = sessions[0].metrics[metric]
  const previous = sessions[Math.min(sessions.length - 1, 2)].metrics[metric]
  const delta = latest - previous
  const absDelta = Math.abs(delta)
  const unit = metricUnits[metric]

  if (absDelta < (metric === 'tempoRatio' ? 0.15 : 3)) {
    return {
      metric,
      label: 'Steady',
      copy: `Holding near ${formatMetricValue(metric, latest)}.`,
    }
  }

  const direction = delta > 0 ? 'Up' : 'Down'
  return {
    metric,
    label: `${direction} ${formatDelta(metric, absDelta, unit)}`,
    copy: getTrendCopy(metric, delta),
  }
}

function formatMetricValue(metric: MetricKey, value: number) {
  if (metric === 'tempoRatio') return `${value.toFixed(2)}${metricUnits[metric]}`
  return `${value.toFixed(1)} ${metricUnits[metric]}`
}

function formatDelta(metric: MetricKey, value: number, unit: string) {
  if (metric === 'tempoRatio') return `${value.toFixed(2)}${unit}`
  return `${value.toFixed(1)} ${unit}`
}

function getTrendCopy(metric: MetricKey, delta: number) {
  if (metric === 'tempoRatio') {
    return delta > 0 ? 'Tempo is moving slower.' : 'Tempo is getting quicker.'
  }

  return delta > 0 ? 'Turn is increasing.' : 'Turn is tighter than before.'
}

function getFocusMessage(metric: MetricKey) {
  if (metric === 'hipRotation') return 'Let your hips turn more during the backswing.'
  if (metric === 'shoulderRotation') return 'Turn your shoulders further before starting down.'
  return 'Aim for a smooth 3:1 backswing-to-downswing tempo.'
}

function getSessionStatus(session: SwingSession) {
  const goodCount = metricOrder.filter((metric) => (
    getMetricStatus(metric, session.metrics[metric]).tone === 'good'
  )).length

  if (goodCount >= 2) return 'Good'
  if (goodCount === 1) return 'Close'
  return 'Needs work'
}

function getSessionHeadline(session: SwingSession) {
  const status = getSessionStatus(session)
  if (status === 'Good') return 'A strong swing to build on.'
  if (status === 'Close') return 'Close, with one clear focus.'
  return 'A useful swing for your next adjustment.'
}

const responsiveStyles = `
  @media (max-width: 767px) {
    .history-hero {
      padding: 1.1rem !important;
    }

    .history-hero-grid {
      grid-template-columns: 1fr !important;
      gap: 1.1rem !important;
    }

    .history-hero-metrics {
      grid-template-columns: 1fr 1fr !important;
    }

    .trend-grid {
      grid-template-columns: 1fr !important;
    }

    .session-detail-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (min-width: 768px) {
    .history-hero-grid {
      grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr) !important;
    }

    .trend-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .session-detail-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
  }

  details > summary {
    list-style: none;
  }

  details > summary::-webkit-details-marker {
    display: none;
  }

  details[open] summary svg:last-child {
    transform: rotate(180deg);
  }
`

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#1a1a1a',
    color: '#fff',
  },
  loadingPage: {
    minHeight: '100vh',
    background: '#1a1a1a',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '1rem',
    paddingBottom: '2.5rem',
  },
  headerLink: {
    color: '#d4af37',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  hero: {
    background: 'linear-gradient(135deg, rgba(31,74,46,0.95) 0%, rgba(18,30,23,0.96) 100%)',
    border: '1px solid rgba(212,175,55,0.22)',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1.35rem',
    boxShadow: '0 16px 36px rgba(0,0,0,0.22)',
  },
  heroTopline: {
    color: '#d8cfba',
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  heroGrid: {
    display: 'grid',
    gap: '1.5rem',
    alignItems: 'stretch',
  },
  heroMetrics: {
    display: 'grid',
    gap: '0.75rem',
  },
  eyebrow: {
    color: '#d4af37',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    lineHeight: 1.2,
    margin: '0 0 0.45rem',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 'clamp(1.55rem, 4vw, 2.35rem)',
    lineHeight: 1.05,
    letterSpacing: 0,
    margin: '0 0 0.85rem',
  },
  heroCopy: {
    color: '#f0e5c8',
    fontSize: '1rem',
    lineHeight: 1.45,
    margin: 0,
    maxWidth: '40rem',
  },
  spotlightCard: {
    background: 'rgba(10,15,12,0.55)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '8px',
    padding: '1rem',
    minHeight: '132px',
  },
  spotlightTitle: {
    color: '#a7a7a7',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    margin: '0 0 0.5rem',
    textTransform: 'uppercase',
  },
  metricValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.35rem',
  },
  metricValue: {
    fontSize: '1.45rem',
    fontWeight: 750,
    lineHeight: 1,
  },
  metricName: {
    color: '#fff',
    fontSize: '0.88rem',
    fontWeight: 650,
    margin: '0 0 0.25rem',
  },
  statusDot: {
    width: '0.55rem',
    height: '0.55rem',
    borderRadius: '999px',
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: '0.8rem',
    fontWeight: 650,
    margin: 0,
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionHeadingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '0.85rem',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '1.08rem',
    fontWeight: 700,
    margin: 0,
  },
  countPill: {
    color: '#d8cfba',
    border: '1px solid #333',
    borderRadius: '999px',
    padding: '0.4rem 0.7rem',
    fontSize: '0.78rem',
    whiteSpace: 'nowrap',
  },
  trendGrid: {
    display: 'grid',
    gap: '0.75rem',
  },
  trendCard: {
    background: '#222',
    border: '1px solid #333',
    borderRadius: '8px',
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    minHeight: '112px',
  },
  trendIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '999px',
    background: 'rgba(212,175,55,0.12)',
    color: '#d4af37',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trendLabel: {
    color: '#a7a7a7',
    fontSize: '0.8rem',
    margin: '0 0 0.25rem',
  },
  trendValue: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 700,
    margin: '0 0 0.25rem',
  },
  trendCopy: {
    color: '#c9c0ad',
    fontSize: '0.85rem',
    lineHeight: 1.35,
    margin: 0,
  },
  primarySmallLink: {
    background: '#d4af37',
    color: '#1a1a1a',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '0 0.9rem',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 750,
    whiteSpace: 'nowrap',
  },
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  sessionCard: {
    background: '#222',
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  sessionSummary: {
    minHeight: '76px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    cursor: 'pointer',
    padding: '0.9rem',
  },
  sessionMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    minWidth: 0,
  },
  sessionIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '8px',
    background: '#181818',
    color: '#d4af37',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sessionDate: {
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 700,
    margin: '0 0 0.25rem',
  },
  sessionFeedback: {
    color: '#bcb3a1',
    fontSize: '0.84rem',
    lineHeight: 1.35,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  sessionScoreWrap: {
    color: '#a7a7a7',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexShrink: 0,
  },
  sessionStatus: {
    fontSize: '0.78rem',
    fontWeight: 750,
    whiteSpace: 'nowrap',
  },
  sessionDetailGrid: {
    borderTop: '1px solid #333',
    display: 'grid',
    gap: '0.65rem',
    padding: '0.9rem',
  },
  detailMetric: {
    background: '#1a1a1a',
    borderRadius: '6px',
    padding: '0.85rem',
  },
  detailLabel: {
    color: '#a7a7a7',
    fontSize: '0.76rem',
    margin: '0 0 0.35rem',
  },
  detailValue: {
    fontSize: '1.2rem',
    fontWeight: 750,
    margin: '0 0 0.2rem',
  },
  detailStatus: {
    color: '#c9c0ad',
    fontSize: '0.78rem',
    margin: 0,
  },
  manageSection: {
    borderTop: '1px solid #333',
    paddingTop: '1rem',
  },
  manageDetails: {
    color: '#bcb3a1',
  },
  manageSummary: {
    minHeight: '48px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    fontSize: '0.86rem',
    fontWeight: 650,
  },
  manageBody: {
    maxWidth: '420px',
    margin: '0.5rem auto 0',
    textAlign: 'center',
  },
  manageCopy: {
    color: '#8f8f8f',
    fontSize: '0.82rem',
    lineHeight: 1.4,
    margin: '0 0 0.75rem',
  },
  dangerButton: {
    background: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    minHeight: '48px',
    padding: '0 1rem',
    fontSize: '0.88rem',
    fontWeight: 700,
  },
  emptyState: {
    minHeight: 'calc(100vh - 180px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#d8cfba',
    padding: '2rem 1rem',
  },
  emptyIcon: {
    width: '58px',
    height: '58px',
    borderRadius: '999px',
    background: 'rgba(212,175,55,0.12)',
    color: '#d4af37',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: '1.65rem',
    lineHeight: 1.1,
    margin: '0 0 0.75rem',
  },
  emptyCopy: {
    color: '#bcb3a1',
    maxWidth: '24rem',
    fontSize: '0.95rem',
    lineHeight: 1.45,
    margin: '0 0 1.25rem',
  },
  primaryLink: {
    background: '#d4af37',
    color: '#1a1a1a',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '52px',
    padding: '0 1.25rem',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 750,
  },
}
