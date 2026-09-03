import React from 'react'
import { useTelemetry } from './hooks/useWebSocket'
import Dashboard from './components/Dashboard'

export default function App() {
  const telemetry = useTelemetry()

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo">iQ</div>
          <div>
            <div className="brand-title">iQOO Adaptive Performance Intelligence</div>
            <div className="brand-subtitle">Predictive Performance System v2.0</div>
          </div>
        </div>

        <div className="header-status">
          <div className="status-indicator">
            <span className="status-dot" style={{ background: telemetry.connected ? '#22c55e' : '#e4262c' }} />
            {telemetry.connected ? 'Connected' : 'Disconnected'}
          </div>
          {telemetry.state && (
            <div className="status-indicator" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Risk: <strong style={{ color: telemetry.state.ai_risk_score > 60 ? '#e4262c' : '#22c55e' }}>
                {telemetry.state.ai_risk_score}
              </strong>/100
            </div>
          )}
          {telemetry.state && (
            <div className="status-indicator">
              Mode: <strong style={{ color: '#e4262c', marginLeft: 4 }}>{telemetry.state.performance_mode}</strong>
            </div>
          )}
          <div className="status-indicator">
            AI: <strong style={{ color: telemetry.aiEnabled ? '#22c55e' : '#e4262c', marginLeft: 4 }}>
              {telemetry.aiEnabled ? 'ON' : 'OFF'}
            </strong>
          </div>
        </div>

        <div className="header-controls">
          <button className="btn btn-sm" onClick={telemetry.skipScenario}>⏭ Skip</button>
          <button className="btn btn-sm" onClick={telemetry.toggleDemo}>🔄 Toggle Demo</button>
          <button className="btn btn-sm" onClick={telemetry.toggleAI}>
            {telemetry.aiEnabled ? '🧠 AI ON' : '⏸️ AI OFF'}
          </button>
          <button className="btn btn-sm btn-primary" onClick={telemetry.resetSimulator}>↻ Reset</button>
        </div>
      </header>

      {/* Dashboard */}
      <Dashboard telemetry={telemetry} />
    </div>
  )
}
