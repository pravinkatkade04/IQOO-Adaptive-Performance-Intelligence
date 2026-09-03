import React from 'react'

/**
 * ExplainableAI - Shows why AI intervened with explanations, confidence, and detected problems
 */
export default function ExplainableAI({ predictions, state }) {
  if (!predictions || !state) return null

  const explanations = predictions.explanations || []
  const confidence = predictions.confidence || 0
  const riskScore = predictions.ai_risk_score || 0

  // Determine active problems
  const activeProblems = []
  if (predictions.overheating_risk > 30) {
    activeProblems.push({
      name: 'Overheating Risk',
      severity: predictions.overheating_risk > 60 ? 'critical' : 'warning',
      value: predictions.overheating_risk,
      icon: '🔥'
    })
  }
  if (predictions.fps_drop_risk > 30) {
    activeProblems.push({
      name: 'Frame Drop Risk',
      severity: predictions.fps_drop_risk > 60 ? 'critical' : 'warning',
      value: predictions.fps_drop_risk,
      icon: '📉'
    })
  }
  if (predictions.battery_drain_risk > 30) {
    activeProblems.push({
      name: 'Battery Drain',
      severity: predictions.battery_drain_risk > 60 ? 'critical' : 'warning',
      value: predictions.battery_drain_risk,
      icon: '🔋'
    })
  }
  if (predictions.ram_pressure_risk > 30) {
    activeProblems.push({
      name: 'RAM Pressure',
      severity: predictions.ram_pressure_risk > 60 ? 'critical' : 'warning',
      value: predictions.ram_pressure_risk,
      icon: '💾'
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Explainable AI</span>
        <span className="card-badge badge-cyan">Why AI Intervened</span>
      </div>

      {/* AI Confidence */}
      <div className="ai-confidence-section">
        <div className="ai-confidence-label">AI Confidence</div>
        <div className="ai-confidence-bar">
          <div
            className="ai-confidence-fill"
            style={{
              width: `${confidence * 100}%`,
              background: confidence > 0.9 ? '#22c55e' : confidence > 0.7 ? '#eab308' : '#e4262c'
            }}
          />
        </div>
        <div className="ai-confidence-value">{(confidence * 100).toFixed(0)}%</div>
      </div>

      {/* Detected Problems */}
      {activeProblems.length > 0 && (
        <div className="detected-problems">
          <div className="detected-label">Detected Problems</div>
          {activeProblems.map((problem, i) => (
            <div key={i} className={`detected-item ${problem.severity}`}>
              <span className="detected-icon">{problem.icon}</span>
              <span className="detected-name">{problem.name}</span>
              <span className="detected-value">{problem.value.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Reasoning */}
      <div className="ai-reasoning">
        <div className="reasoning-label">AI Reasoning</div>
        {explanations.map((exp, i) => (
          <div key={i} className="reasoning-item">
            <span className="reasoning-bullet">*</span>
            {exp}
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="ai-status-row">
        <span className={`status-badge ${predictions.cpu_status}`}>
          CPU: {predictions.cpu_status?.toUpperCase()}
        </span>
        <span className={`status-badge ${predictions.thermal_status}`}>
          Temp: {predictions.thermal_status?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
