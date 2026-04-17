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
        background:
          'radial-gradient(ellipse at 50% 20%, #1f4a2e 0%, #0d1f15 45%, #050807 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '3rem 1.5rem',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 600 600"
        aria-hidden
        style={{
          position: 'absolute',
          right: '-140px',
          bottom: '-80px',
          width: '680px',
          height: '680px',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <path
          fill="#d4af37"
          d="M312 70c14 0 25 11 25 25s-11 25-25 25-25-11-25-25 11-25 25-25zm-38 90 46-18c6-2 13 0 17 5l38 56c5 7 3 17-4 22-7 5-17 3-22-4l-22-32v60l42 140c3 10-3 21-13 24-10 3-21-3-24-13l-36-120-16 52 22 92c3 11-4 22-15 24-11 3-22-4-24-15l-24-102c-1-5 0-10 2-14l30-96v-56l-30 44c-5 7-14 9-21 4s-9-14-4-21l54-76c2-3 5-5 8-6z"
        />
        <circle cx="120" cy="480" r="14" fill="#d4af37" opacity="0.6" />
        <path
          stroke="#d4af37"
          strokeWidth="3"
          fill="none"
          opacity="0.5"
          d="M120 480 Q 220 340 340 240"
        />
      </svg>

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

      <div style={{ zIndex: 1, width: '100%', maxWidth: '420px' }}>
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
            fontSize: '1.05rem',
            letterSpacing: '0.01em',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.25)',
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
