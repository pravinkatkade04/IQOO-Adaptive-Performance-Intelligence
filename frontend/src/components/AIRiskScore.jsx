import React from 'react'

function getRiskColor(value) {
  if (value > 60) return '#e4262c'
  if (value > 35) return '#f97316'
  if (value > 15) return '#eab308'
  return '#22c55e'
}

function RiskItem({ label, value, icon }) {
  const color = getRiskColor(value)
  return (
    <div className="risk-item">
      <div className="risk-label">{icon} {label}</div>
      <div className="risk-value" style={{ color }}>{value.toFixed(0)}%</div>
      <div className="risk-bar">
        <div className="risk-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

export default function AIRiskScore({ state, predictions }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">AI Risk Score</span>
        <span className="confidence-badge">
          AI Confidence: {(state.ai_confidence * 100).toFixed(0)}%
        </span>
      </div>

      {/* Overall Risk */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{
          fontSize: 48, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
          color: getRiskColor(state.ai_risk_score),
          lineHeight: 1,
          textShadow: `0 0 30px ${getRiskColor(state.ai_risk_score)}40`
        }}>
          {state.ai_risk_score.toFixed(0)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
          AI Performance Risk
        </div>
      </div>

      {/* Individual Risks */}
      <div className="risk-grid">
        <RiskItem label="Overheating" value={state.overheating_risk} icon="🔥" />
        <RiskItem label="FPS Drop" value={state.fps_drop_risk} icon="📉" />
        <RiskItem label="Battery Drain" value={state.battery_drain_risk} icon="🔋" />
        <RiskItem label="RAM Pressure" value={state.ram_pressure_risk} icon="💾" />
      </div>
    </div>
  )
}
