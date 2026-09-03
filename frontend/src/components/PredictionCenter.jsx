import React from 'react'

function getPredictionSeverity(risk) {
  if (risk > 60) return 'critical'
  if (risk > 35) return 'warning'
  return 'success'
}

function getPredictionIcon(risk) {
  if (risk > 60) return '🔴'
  if (risk > 35) return '⚠️'
  return '✅'
}

function PredictionCard({ title, risk, explanation, confidence }) {
  const severity = getPredictionSeverity(risk)
  const icon = getPredictionIcon(risk)

  return (
    <div className={`prediction-card ${severity}`}>
      <div className="prediction-title">
        <span>{icon}</span>
        <span>{title}</span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: severity === 'critical' ? 'var(--accent-red)' :
                 severity === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-green)'
        }}>
          {risk.toFixed(0)}%
        </span>
      </div>
      {explanation && (
        <div className="prediction-explanation">{explanation}</div>
      )}
      {confidence && (
        <div className="prediction-confidence">Confidence: {(confidence * 100).toFixed(0)}%</div>
      )}
    </div>
  )
}

export default function PredictionCenter({ predictions }) {
  if (!predictions) return null

  // Backend simulator returns predictions flat: { overheating_risk, fps_drop_risk, explanations, confidence, ... }
  // ML API returns nested: { predictions: { overheating_risk: { risk, label } }, explanations, confidence }
  // Normalize: extract the flat risk values and metadata
  const explanations = predictions.explanations || []
  const confidence = predictions.confidence

  const getRisk = (key) => {
    // Handle ML API format: { risk: 30, label: "medium" }
    if (predictions[key]?.risk !== undefined) return predictions[key].risk
    // Handle flat format: 30
    if (typeof predictions[key] === 'number') return predictions[key]
    // Handle nested format: { predictions: { overheating_risk: { risk: 30 } } }
    if (predictions.predictions?.[key]?.risk !== undefined) return predictions.predictions[key].risk
    if (typeof predictions.predictions?.[key] === 'number') return predictions.predictions[key]
    return 0
  }

  // Determine explanation for each risk
  const getExplanation = (targetName) => {
    if (!explanations || explanations.length === 0) return ""
    if (targetName === 'overheating_risk' || targetName === 'thermal') {
      return explanations.find(e => e.toLowerCase().includes('cpu') || e.toLowerCase().includes('temperature')) || explanations[0]
    }
    if (targetName === 'fps_drop_risk' || targetName === 'fps') {
      return explanations.find(e => e.toLowerCase().includes('gpu') || e.toLowerCase().includes('frame')) || explanations[0]
    }
    if (targetName === 'battery_drain_risk' || targetName === 'battery') {
      return explanations.find(e => e.toLowerCase().includes('cpu') || e.toLowerCase().includes('battery')) || explanations[0]
    }
    return explanations[0]
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Prediction Center</span>
        <span className="card-badge badge-blue">AI Engine</span>
      </div>

      <PredictionCard
        title="Thermal Throttling"
        risk={getRisk('overheating_risk')}
        explanation={getExplanation('overheating_risk')}
        confidence={confidence}
      />
      <PredictionCard
        title="Frame Rate Drop"
        risk={getRisk('fps_drop_risk')}
        explanation={getExplanation('fps_drop_risk')}
        confidence={confidence}
      />
      <PredictionCard
        title="Battery Drain"
        risk={getRisk('battery_drain_risk')}
        explanation={getExplanation('battery_drain_risk')}
        confidence={confidence}
      />

      {/* AI Explanation Block */}
      {explanations.length > 0 && (
        <div className="ai-explanation">
          <div className="ai-explanation-header">
            🧠 AI Analysis
          </div>
          <div className="ai-explanation-text">
            {explanations.map((exp, i) => (
              <div key={i} style={{ marginBottom: i < explanations.length - 1 ? 6 : 0 }}>
                {exp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
