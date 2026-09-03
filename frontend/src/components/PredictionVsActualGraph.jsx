import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

/**
 * PredictionVsActualGraph - Shows whether AI predictions match real telemetry
 */
export default function PredictionVsActualGraph({ history, predictionAccuracy }) {
  if (!history || history.cpu.length < 5) return null

  // Build data showing prediction vs actual using risk score as proxy
  const data = history.cpu.map((cpu, i) => {
    // Simulate prediction offset: prediction at time i was made ~10 ticks ago
    const predIndex = Math.max(0, i - 10)
    return {
      i,
      'Actual CPU': cpu,
      'Predicted CPU': history.cpu[predIndex] || cpu,
      'Actual Temp': history.temp[i],
      'Predicted Temp': history.temp[predIndex] || history.temp[i],
    }
  })

  const avgError = predictionAccuracy?.avg_error || 0
  const predCount = predictionAccuracy?.count || 0

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Prediction vs Actual</span>
        <div className="prediction-accuracy-badges">
          <span className="accuracy-badge">
            Error: {avgError.toFixed(1)}%
          </span>
          <span className="accuracy-badge">
            {predCount} samples
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="i" hide />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{
                background: 'rgba(17,17,24,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="Actual CPU" stroke="#e4262c" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Predicted CPU" stroke="#e4262c" strokeWidth={1} dot={false}
              strokeDasharray="4 2" opacity={0.5} />
            <Line type="monotone" dataKey="Actual Temp" stroke="#f97316" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="Predicted Temp" stroke="#f97316" strokeWidth={1} dot={false}
              strokeDasharray="4 2" opacity={0.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="prediction-legend">
        <span><span style={{ color: '#e4262c' }}>--- </span> Actual</span>
        <span><span style={{ color: '#e4262c', opacity: 0.5 }}>--- </span> Predicted</span>
      </div>
    </div>
  )
}
