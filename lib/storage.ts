/**
 * localStorage-based persistence for swing sessions
 */

export interface SwingSession {
  id: string
  createdAt: string // ISO date string
  metrics: {
    hipRotation: number
    shoulderRotation: number
    tempoRatio: number
  }
  feedback: string[]
}

const STORAGE_KEY = 'swing_sessions'

/**
 * Save a swing session to localStorage
 */
export function saveSwingSession(session: SwingSession): void {
  try {
    const sessions = getSwingSessions()
    sessions.unshift(session) // Add to front (newest first)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch (e) {
    console.error('Failed to save swing session:', e)
  }
}

/**
 * Retrieve all saved swing sessions (newest first)
 */
export function getSwingSessions(): SwingSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Failed to retrieve swing sessions:', e)
    return []
  }
}

/**
 * Clear all swing history
 */
export function clearSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear sessions:', e)
  }
}

/**
 * Generate a unique ID for a session
 */
export function generateSessionId(): string {
  return `session_${Date.now()}`
}
