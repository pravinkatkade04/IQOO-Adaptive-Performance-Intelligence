import React from 'react'

/**
 * AdaptivePerformanceScore - Calculates and displays composite score from all metrics
 */
export default function AdaptivePerformanceScore({ adaptiveScore }) {
  if (!adaptiveScore) return null

  const { score, rating, cpu_score, gpu_score, ram_score, temp_score, fps_score, battery_score } = adaptiveScore

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (s) => {
    if (s >= 85) return '#22c55e'
    if (s >= 70) return '#3b82f6'
    if (s >= 50) return '#eab308'
    if (s >= 30) return '#f97316'
    return '#e4262c'
  }

  const scoreColor = getScoreColor(score)

  const breakdownItems = [
    { label: 'CPU', score: cpu_score, color: '#e4262c' },
    { label: 'GPU', score: gpu_score, color: '#3b82f6' },
    { label: 'RAM', score: ram_score, color: '#a855f7' },
    { label: 'Temp', score: temp_score, color: '#f97316' },
    { label: 'FPS', score: fps_score, color: '#22c55e' },
    { label: 'Battery', score: battery_score, color: '#06b6d4' },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Adaptive Score</span>
        <span className="card-badge" style={{ background: `${scoreColor}20`, color: scoreColor }}>
          {rating}
        </span>
      </div>

      <div className="score-gauge">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={scoreColor} strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
          />
          <text x="50" y="48" textAnchor="middle" fill={scoreColor}
            fontSize="22" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
            {score.toFixed(0)}
          </text>
          <text x="50" y="62" textAnchor="middle" fill="#6b7280"
            fontSize="8" fontWeight="500">
            /100
          </text>
        </svg>
      </div>

      <div className="score-breakdown">
        {breakdownItems.map((item) => (
          <div key={item.label} className="score-breakdown-item">
            <div className="score-breakdown-label">{item.label}</div>
            <div className="score-breakdown-bar">
              <div
                className="score-breakdown-fill"
                style={{ width: `${item.score}%`, background: item.color }}
              />
            </div>
            <div className="score-breakdown-value" style={{ color: item.color }}>
              {item.score.toFixed(0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
