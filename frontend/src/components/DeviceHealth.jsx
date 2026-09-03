import React from 'react'

function GaugeCircle({ value, max = 100, size = 140, strokeWidth = 8, color, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference
  const dashOffset = circumference - progress

  return (
    <div className="gauge-container">
      <svg width={size} height={size} className="gauge-svg">
        <circle
          className="gauge-bg"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="gauge-fill"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div style={{ 
        position: 'absolute', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        width: size, height: size 
      }}>
        <span className="gauge-value" style={{ color }}>{Math.round(value)}</span>
        <span className="gauge-unit" style={{ fontSize: 10 }}>/ {max}</span>
      </div>
      {label && <span className="gauge-label">{label}</span>}
    </div>
  )
}

function getHealthColor(score) {
  if (score > 75) return '#22c55e'
  if (score > 50) return '#eab308'
  if (score > 30) return '#f97316'
  return '#e4262c'
}

function getHealthLabel(score) {
  if (score > 75) return 'Excellent'
  if (score > 50) return 'Good'
  if (score > 30) return 'Fair'
  return 'Critical'
}

export default function DeviceHealth({ state }) {
  const healthScore = Math.round(100 - state.ai_risk_score)
  const color = getHealthColor(healthScore)
  const label = getHealthLabel(healthScore)

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Device Health</span>
        <span className="card-badge" style={{
          background: `${color}18`, color: color
        }}>{label}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <GaugeCircle value={healthScore} color={color} label="Performance Health" />
      </div>
      <div style={{ marginTop: 12 }}>
        <div className="metric-row">
          <span className="metric-name">Active App</span>
          <span className="metric-value" style={{ fontSize: 14, color: 'var(--accent-cyan)' }}>
            {state.active_app}
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-name">Background Processes</span>
          <span className="metric-value" style={{ fontSize: 14 }}>{state.background_processes}</span>
        </div>
        <div className="scenario-bar">
          <div className="scenario-label">Scenario Progress</div>
          <div className="scenario-track">
            <div className="scenario-fill" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
