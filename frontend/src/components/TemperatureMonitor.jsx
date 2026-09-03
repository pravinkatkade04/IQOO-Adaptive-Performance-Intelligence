import React from 'react'
import { AreaChart, Area, ResponsiveContainer, ReferenceLine } from 'recharts'

function getTempColor(temp) {
  if (temp > 44) return '#e4262c'
  if (temp > 40) return '#f97316'
  if (temp > 36) return '#eab308'
  return '#22c55e'
}

function getTempStatus(temp) {
  if (temp > 44) return 'CRITICAL — Throttling Imminent'
  if (temp > 40) return 'WARNING — Approaching Limit'
  if (temp > 36) return 'WARM — Monitoring'
  return 'OPTIMAL — Normal'
}

export default function TemperatureMonitor({ history, temp, batteryTemp }) {
  const color = getTempColor(temp)
  const status = getTempStatus(temp)

  // Thermal gauge
  const gaugeSize = 120
  const strokeWidth = 10
  const radius = (gaugeSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const tempProgress = Math.min(1, Math.max(0, (temp - 22) / 30))
  const dashOffset = circumference - tempProgress * circumference

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Temperature Monitor</span>
        <span className="card-badge" style={{ background: `${color}18`, color }}>
          {temp > 40 ? 'HOT' : temp > 36 ? 'WARM' : 'COOL'}
        </span>
      </div>

      {/* Temperature Gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', width: gaugeSize, height: gaugeSize }}>
          <svg width={gaugeSize} height={gaugeSize} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={gaugeSize / 2} cy={gaugeSize / 2} r={radius}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
            />
            <circle
              cx={gaugeSize / 2} cy={gaugeSize / 2} r={radius}
              fill="none" stroke={color} strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease',
                filter: `drop-shadow(0 0 6px ${color}40)`
              }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{
              fontSize: 28, fontWeight: 700,
              fontFamily: "'JetBrains Mono'", color
            }}>
              {temp.toFixed(1)}°
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>CELSIUS</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{
        textAlign: 'center', padding: '8px 12px',
        background: `${color}10`, borderRadius: 'var(--radius-sm)',
        border: `1px solid ${color}25`, marginBottom: 12
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: 0.5 }}>
          {status}
        </div>
      </div>

      {/* Battery Temperature */}
      <div className="metric-row">
        <span className="metric-name">Battery Temperature</span>
        <span className="metric-value" style={{ fontSize: 14, color: getTempColor(batteryTemp) }}>
          {batteryTemp.toFixed(1)}°C
        </span>
      </div>

      {/* Mini Temperature Chart */}
      <div style={{ marginTop: 10 }}>
        <TempChart history={history} />
      </div>
    </div>
  )
}

function TempChart({ history }) {

  const data = history.temp.map((t, i) => ({ temp: t }))

  if (data.length < 2) return null

  return (
    <div style={{ width: '100%', height: 70 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ReferenceLine y={42} stroke="#e4262c" strokeDasharray="3 3" strokeOpacity={0.5} />
          <Area type="monotone" dataKey="temp" stroke="#f97316" fill="url(#tempGrad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
