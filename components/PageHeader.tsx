'use client'

interface PageHeaderProps {
  title: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
}

export default function PageHeader({ title, leftAction, rightAction }: PageHeaderProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1f4a2e 0%, #0d1f15 100%)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      {/* Left */}
      <div style={{ minWidth: '80px' }}>
        {leftAction}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37', boxShadow: '0 0 8px #d4af37', flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
            MAP MY SWING
          </span>
        </div>
        <h1 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          margin: '0.2rem 0 0',
          color: '#fff',
          letterSpacing: '-0.01em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%'
        }}>
          {title}
        </h1>
      </div>

      {/* Right */}
      <div style={{ minWidth: '80px', display: 'flex', justifyContent: 'flex-end' }}>
        {rightAction}
      </div>
    </div>
  )
}
