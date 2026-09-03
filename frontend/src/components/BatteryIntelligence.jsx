import React from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

function getBatteryColor(level) {
  if (level > 60) return '#22c55e'
  if (level > 30) return '#eab308'
  if (level > 15) return '#f97316'
  return '#e4262c'
}

function getBatteryIcon(level) {
  if (level > 75) return '🔋'
  if (level > 50) return '🔋'
  if (level > 25) return '🪫'
  return '🪫'
}

export default function BatteryIntelligence({ history, battery }) {
  const color = getBatteryColor(battery)

  // Battery ring
  const size = 100
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (battery / 100) * circumference

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Battery Intelligence</span>
        <span className="card-badge" style={{ background: `${color}18`, color }}>
          {battery > 50 ? 'Healthy' : battery > 20 ? 'Draining' : 'Critical'}
        </span>
      </div>

      {/* Battery Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={color} strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
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
              fontSize: 24, fontWeight: 700,
              fontFamily: "'JetBrains Mono'", color
            }}>
              {battery.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Battery Stats */}
      <div className="metric-row">
        <span className="metric-name">Status</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {getBatteryIcon(battery)} {battery > 50 ? 'Charging Adequate' : battery > 20 ? 'Moderate Drain Rate' : 'Critical — Optimize Now'}
        </span>
      </div>
      <div className="metric-row">
        <span className="metric-name">Estimated Runtime</span>
        <span style={{
          fontSize: 13, fontFamily: "'JetBrains Mono'", color: 'var(--text-secondary)'
        }}>
          {battery > 50 ? '~4.5 hrs' : battery > 20 ? '~2.1 hrs' : '~0.8 hrs'}
        </span>
      </div>

      {/* Battery Chart */}
      <div style={{ marginTop: 10 }}>
        <BatteryChart history={history} />
      </div>
    </div>
  )
}

function BatteryChart({ history }) {

  const data = history.battery.map((b, i) => ({ battery: b }))

  if (data.length < 2) return null

  return (
    <div style={{ width: '100%', height: 60 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="battGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="battery" stroke="#22c55e" fill="url(#battGrad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
