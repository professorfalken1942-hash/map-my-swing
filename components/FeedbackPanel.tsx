'use client'

interface FeedbackPanelProps {
  feedback: string[]
}

export default function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <div style={{ background: '#222', padding: '1rem', borderRadius: '4px', border: '1px solid #333' }}>
      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#d4af37', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
        💡 Insights
      </p>
      {feedback.length === 0 ? (
        <p style={{ fontSize: '0.9rem', color: '#999', margin: 0, lineHeight: 1.5 }}>
          Record a swing to see personalized feedback
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {feedback.map((msg, i) => (
            <li key={i} style={{ fontSize: '0.85rem', color: '#e8d5a5', marginBottom: '0.75rem', paddingLeft: '1.25rem', position: 'relative', lineHeight: 1.4 }}>
              <span style={{ position: 'absolute', left: 0 }}>•</span>
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
