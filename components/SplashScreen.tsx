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
        viewBox="0 0 400 500"
        aria-hidden
        style={{
          position: 'absolute',
          right: '-80px',
          bottom: '-60px',
          width: '500px',
          height: '600px',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      >
        {/* Golfer silhouette in mid-swing */}
        {/* Head */}
        <circle cx="200" cy="80" r="20" fill="#d4af37" />
        
        {/* Neck */}
        <line x1="200" y1="100" x2="200" y2="120" stroke="#d4af37" strokeWidth="8" strokeLinecap="round" />
        
        {/* Torso (angled for swing) */}
        <line x1="200" y1="120" x2="180" y2="240" stroke="#d4af37" strokeWidth="14" strokeLinecap="round" />
        
        {/* Upper left arm (back swing) */}
        <line x1="180" y1="130" x2="80" y2="100" stroke="#d4af37" strokeWidth="10" strokeLinecap="round" />
        
        {/* Lower left arm (club grip) */}
        <line x1="80" y1="100" x2="40" y2="60" stroke="#d4af37" strokeWidth="8" strokeLinecap="round" />
        
        {/* Right arm (at side during backswing) */}
        <line x1="180" y1="140" x2="200" y2="200" stroke="#d4af37" strokeWidth="10" strokeLinecap="round" />
        
        {/* Left hip/thigh */}
        <line x1="180" y1="240" x2="160" y2="380" stroke="#d4af37" strokeWidth="12" strokeLinecap="round" />
        
        {/* Left lower leg */}
        <line x1="160" y1="380" x2="155" y2="460" stroke="#d4af37" strokeWidth="10" strokeLinecap="round" />
        
        {/* Right hip/thigh */}
        <line x1="180" y1="240" x2="220" y2="370" stroke="#d4af37" strokeWidth="12" strokeLinecap="round" />
        
        {/* Right lower leg */}
        <line x1="220" y1="370" x2="225" y2="460" stroke="#d4af37" strokeWidth="10" strokeLinecap="round" />
        
        {/* Golf club shaft (extended back) */}
        <line x1="40" y1="60" x2="20" y2="20" stroke="#d4af37" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        
        {/* Club head */}
        <rect x="15" y="10" width="12" height="28" fill="#d4af37" opacity="0.8" rx="2" />
        
        {/* Ground line */}
        <line x1="100" y1="470" x2="280" y2="470" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
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
