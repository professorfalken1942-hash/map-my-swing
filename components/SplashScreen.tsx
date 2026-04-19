'use client'

interface SplashScreenProps {
  onStart: () => void
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 20%, #1f4a2e 0%, #0d1f15 45%, #050807 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '3rem 1.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Golfer silhouette */}
      <img
        src="/golfer.png"
        aria-hidden
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '80px',
          height: '70%',
          maxHeight: '520px',
          opacity: 0.18,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#d4af37',
            boxShadow: '0 0 12px #d4af37',
          }}
        />
        <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', opacity: 0.7 }}>
          MAP MY SWING
        </span>
      </div>

      <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '520px' }}>
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 8vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          See your swing.
          <br />
          <span style={{ color: '#d4af37' }}>Fix your swing.</span>
        </h1>
        <p
          style={{
            marginTop: '1.25rem',
            fontSize: '1.05rem',
            lineHeight: 1.5,
            opacity: 0.75,
          }}
        >
          Record a swing. Get tempo, rotation, and shoulder turn — with frame-by-frame
          feedback in seconds.
        </p>
      </div>

      <div style={{ zIndex: 1, width: '100%', maxWidth: '420px', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '1.1rem 1.5rem',
            background: '#d4af37',
            color: '#0d1f15',
            border: 'none',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: 'clamp(0.95rem, 4vw, 1.05rem)',
            letterSpacing: '0.01em',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.25)',
            minHeight: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Record My Swing →
        </button>
        <p
          style={{
            marginTop: '0.9rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            opacity: 0.5,
          }}
        >
          Works in your browser · No signup · Camera access required
        </p>
      </div>
    </div>
  )
}
