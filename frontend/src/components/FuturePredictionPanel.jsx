import React from 'react'

/**
 * FuturePredictionPanel - Shows AI predictions for 10s, 20s, 30s into the future
 */
export default function FuturePredictionPanel({ futurePredictions }) {
  if (!futurePredictions || futurePredictions.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">Future Prediction</span>
          <span className="card-badge badge-blue">10-30s</span>
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-dim)', fontSize: 12 }}>
          Waiting for prediction data...
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Future Prediction</span>
        <span className="card-badge badge-blue">AI Forecast</span>
      </div>

      <div className="future-predictions">
        {futurePredictions.map((pred) => {
          const riskLevel = pred.predicted_risk > 60 ? 'critical' :
                           pred.predicted_risk > 30 ? 'warning' : 'safe'
          return (
            <div key={pred.horizon_seconds} className={`prediction-card ${riskLevel}`}>
              <div className="prediction-header">
                <span className="prediction-horizon">{pred.horizon_seconds}s</span>
                <span className={`prediction-risk-badge badge-${riskLevel}`}>
                  {riskLevel === 'critical' ? 'HIGH RISK' :
                   riskLevel === 'warning' ? 'ELEVATED' : 'SAFE'}
                </span>
              </div>
              <div className="prediction-metrics">
                <span>CPU: {pred.predicted_cpu}%</span>
                <span>GPU: {pred.predicted_gpu}%</span>
                <span>Temp: {pred.predicted_temp}C</span>
                <span>FPS: {pred.predicted_fps}</span>
              </div>
              <div className="prediction-risk-bar">
                <div
                  className="prediction-risk-fill"
                  style={{
                    width: `${pred.predicted_risk}%`,
                    background: riskLevel === 'critical' ? '#e4262c' :
                               riskLevel === 'warning' ? '#eab308' : '#22c55e'
                  }}
                />
              </div>
              <div className="prediction-explanation">
                {pred.explanation}
              </div>
              <div className="prediction-confidence">
                Confidence: {(pred.confidence * 100).toFixed(0)}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
