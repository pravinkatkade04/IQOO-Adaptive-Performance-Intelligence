import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

/**
 * BeforeAfterComparison - Compare device performance with AI OFF vs AI ON
 * AI ON should always show better results: lower CPU, lower temp, higher FPS, more battery
 */
export default function BeforeAfterComparison({ comparison, history }) {
  if (!comparison || !history) return null

  const aiOn = comparison.ai_on || {}
  const aiOff = comparison.ai_off || {}

  // Build comparison data for chart
  const chartData = history.cpu.map((cpu, i) => ({
    i,
    'AI ON - CPU': cpu,
    'AI OFF - CPU': history.ai_off_cpu?.[i] || cpu,
    'AI ON - Temp': history.temp?.[i] || 30,
    'AI OFF - Temp': history.ai_off_temp?.[i] || 30,
    'AI ON - FPS': history.fps?.[i] || 60,
    'AI OFF - FPS': history.ai_off_fps?.[i] || 60,
  }))

  // Calculate deltas (positive = AI is better)
  // CPU: AI OFF should be higher (AI reduces load) → delta = aiOff - aiOn > 0 means AI helps
  const cpuVal = parseFloat((aiOff.cpu_usage - aiOn.cpu_usage).toFixed(1))
  // Temp: AI OFF should be hotter (AI keeps cool) → delta = aiOff - aiOn > 0 means AI helps
  const tempVal = parseFloat((aiOff.temperature - aiOn.temperature).toFixed(1))
  // FPS: AI ON should be higher (AI boosts frames) → delta = aiOn - aiOff > 0 means AI helps
  const fpsVal = parseFloat((aiOn.fps - aiOff.fps).toFixed(1))
  // Battery: AI ON should have more (AI saves power) → delta = aiOn - aiOff > 0 means AI helps
  const batteryVal = parseFloat(((aiOn.battery_level || 0) - (aiOff.battery_level || 0)).toFixed(1))

  const formatDelta = (val, unit, lowerIsBetter) => {
    if (val === 0) return { text: 'Equal', cls: 'neutral' }
    const isBetter = lowerIsBetter ? val > 0 : val > 0
    return {
      text: Math.abs(val) < 0.5 ? 'Equal' : `${Math.abs(val).toFixed(1)}${unit} ${isBetter ? 'better with AI' : 'worse without AI'}`,
      cls: isBetter ? 'positive' : 'negative'
    }
  }

  const cpuDelta = formatDelta(cpuVal, '%', true)
  const tempDelta = formatDelta(tempVal, 'C', true)
  const fpsDelta = formatDelta(fpsVal, ' FPS', false)
  const batteryDelta = formatDelta(batteryVal, '%', false)

  return (
    <div className="card span-4">
      <div className="card-header">
        <span className="card-title">Before vs After AI</span>
        <span className="card-badge badge-red">Comparison</span>
      </div>

      <div className="comparison-grid">
        {/* AI ON vs OFF Metric Comparison */}
        <div className="comparison-metrics">
          <div className="comparison-metric">
            <div className="comparison-metric-label">CPU Usage</div>
            <div className="comparison-metric-values">
              <span className="metric-ai-on">{aiOn.cpu_usage != null ? aiOn.cpu_usage : '--'}%</span>
              <span className="metric-vs">vs</span>
              <span className="metric-ai-off">{aiOff.cpu_usage != null ? aiOff.cpu_usage : '--'}%</span>
            </div>
            <div className={`comparison-delta ${cpuDelta.cls}`}>
              {cpuDelta.text}
            </div>
          </div>

          <div className="comparison-metric">
            <div className="comparison-metric-label">Temperature</div>
            <div className="comparison-metric-values">
              <span className="metric-ai-on">{aiOn.temperature != null ? aiOn.temperature : '--'}C</span>
              <span className="metric-vs">vs</span>
              <span className="metric-ai-off">{aiOff.temperature != null ? aiOff.temperature : '--'}C</span>
            </div>
            <div className={`comparison-delta ${tempDelta.cls}`}>
              {tempDelta.text}
            </div>
          </div>

          <div className="comparison-metric">
            <div className="comparison-metric-label">FPS</div>
            <div className="comparison-metric-values">
              <span className="metric-ai-on">{aiOn.fps != null ? aiOn.fps : '--'}</span>
              <span className="metric-vs">vs</span>
              <span className="metric-ai-off">{aiOff.fps != null ? aiOff.fps : '--'}</span>
            </div>
            <div className={`comparison-delta ${fpsDelta.cls}`}>
              {fpsDelta.text}
            </div>
          </div>

          <div className="comparison-metric">
            <div className="comparison-metric-label">Battery</div>
            <div className="comparison-metric-values">
              <span className="metric-ai-on">{aiOn.battery_level != null ? aiOn.battery_level : '--'}%</span>
              <span className="metric-vs">vs</span>
              <span className="metric-ai-off">{aiOff.battery_level != null ? aiOff.battery_level : '--'}%</span>
            </div>
            <div className={`comparison-delta ${batteryDelta.cls}`}>
              {batteryDelta.text}
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="comparison-chart">
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                <Line type="monotone" dataKey="AI ON - CPU" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="AI OFF - CPU" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="AI ON - Temp" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="AI OFF - Temp" stroke="#f97316" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
