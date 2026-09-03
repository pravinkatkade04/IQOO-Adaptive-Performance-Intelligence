import React from 'react'

export default function ComparisonDiagram() {
  return (
    <div className="card span-4">
      <div className="card-header">
        <span className="card-title">System Architecture — The Innovation</span>
        <span className="card-badge badge-red">Core Differentiator</span>
      </div>

      <div className="comparison">
        {/* Traditional System */}
        <div className="comparison-col">
          <div className="comparison-label" style={{ color: 'var(--text-dim)' }}>❌ Traditional System</div>
          <div className="comparison-steps">
            <span style={{ color: 'var(--text-dim)' }}>Problem Occurs</span>
            <span>↓</span>
            <span style={{ color: 'var(--text-dim)' }}>System Detects Issue</span>
            <span>↓</span>
            <span style={{ color: 'var(--text-dim)' }}>User Experiences Lag/Drops</span>
            <span>↓</span>
            <span style={{ color: 'var(--text-dim)' }}>Reactive Optimization</span>
            <span>↓</span>
            <span style={{ color: 'var(--text-dim)' }}>Performance Recovers (Maybe)</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="comparison-arrow">→</div>

        {/* Our System */}
        <div className="comparison-col">
          <div className="comparison-label" style={{ color: 'var(--accent-red)' }}>✅ iQOO Adaptive Intelligence</div>
          <div className="comparison-steps">
            <span className="highlight">Monitor Device Metrics</span>
            <span>↓</span>
            <span className="highlight">AI Analyzes Patterns</span>
            <span>↓</span>
            <span className="highlight">Predict Future Issues</span>
            <span>↓</span>
            <span className="highlight">Preventive Optimization</span>
            <span>↓</span>
            <span className="highlight">Stable Performance ✓</span>
          </div>
        </div>
      </div>

      {/* Architecture Pipeline */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          AI Architecture Pipeline
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Device Metrics', icon: '📊' },
            { label: 'Data Collection', icon: '📥' },
            { label: 'Feature Extraction', icon: '🔬' },
            { label: 'AI Prediction', icon: '🧠' },
            { label: 'Risk Assessment', icon: '⚖️' },
            { label: 'Adaptive Decision', icon: '🎯' },
            { label: 'Optimization', icon: '⚡' },
            { label: 'Performance Monitor', icon: '📈' },
            { label: 'Feedback Loop', icon: '🔄' },
          ].map((step, i) => (
            <React.Fragment key={i}>
              <div style={{
                padding: '8px 12px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap'
              }}>
                <span>{step.icon}</span>
                {step.label}
              </div>
              {i < 8 && (
                <span style={{ color: 'var(--accent-red)', fontSize: 14, opacity: 0.5 }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
