import React from 'react'

const modes = [
  {
    id: 'performance',
    name: 'Performance',
    icon: '🚀',
    color: '#e4262c',
    description: 'Maximum CPU/GPU allocation. Best for competitive gaming.',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    icon: '⚖️',
    color: '#3b82f6',
    description: 'Even power distribution. General-purpose optimization.',
  },
  {
    id: 'smart_ai',
    name: 'Smart AI',
    icon: '🧠',
    color: '#a855f7',
    description: 'AI-driven adaptive mode. Predicts and prevents issues.',
  },
]

export default function PerformanceModes({ mode, onSetMode }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Performance Mode</span>
        <span className="card-badge" style={{
          background: `${modes.find(m => m.id === mode)?.color || '#6b7280'}18`,
          color: modes.find(m => m.id === mode)?.color || '#6b7280'
        }}>
          Active
        </span>
      </div>

      <div className="mode-selector">
        {modes.map(m => (
          <button
            key={m.id}
            className={`mode-btn ${mode === m.id ? 'active' : ''}`}
            style={mode === m.id ? { background: m.color, boxShadow: `0 0 15px ${m.color}40` } : {}}
            onClick={() => onSetMode && onSetMode(m.id)}
          >
            {m.icon} {m.name}
          </button>
        ))}
      </div>

      {/* Active mode description */}
      <div style={{
        marginTop: 14, padding: '12px 14px',
        background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 16 }}>{modes.find(m => m.id === mode)?.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {modes.find(m => m.id === mode)?.name} Mode
          </span>
          {mode === 'smart_ai' && (
            <span style={{
              fontSize: 9, padding: '2px 6px', borderRadius: 6,
              background: '#a855f720', color: '#a855f7',
              fontWeight: 700, letterSpacing: 0.5
            }}>DEFAULT</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.5 }}>
          {modes.find(m => m.id === mode)?.description}
        </div>
      </div>

      {/* Mode comparison */}
      <div style={{ marginTop: 14 }}>
        {modes.map(m => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0',
            borderBottom: m.id !== 'smart_ai' ? '1px solid var(--border-subtle)' : 'none',
            opacity: mode === m.id ? 1 : 0.4,
            transition: 'opacity 0.3s'
          }}>
            <span style={{ fontSize: 14 }}>{m.icon}</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{m.name}</span>
            <span style={{
              fontSize: 10, fontFamily: "'JetBrains Mono'",
              color: mode === m.id ? m.color : 'var(--text-dim)'
            }}>
              {mode === m.id ? '● ACTIVE' : '○ OFF'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
