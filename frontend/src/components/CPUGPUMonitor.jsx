import React from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

function MiniBar({ value, max = 100, color, height = 4 }) {
  return (
    <div className="metric-bar" style={{ height }}>
      <div
        className="metric-bar-fill"
        style={{
          width: `${(value / max) * 100}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`
        }}
      />
    </div>
  )
}

function getStatusColor(value) {
  if (value > 85) return '#e4262c'
  if (value > 70) return '#f97316'
  if (value > 50) return '#eab308'
  return '#22c55e'
}

function getStatusLabel(value) {
  if (value > 85) return 'Overloaded'
  if (value > 70) return 'High'
  if (value > 50) return 'Moderate'
  return 'Normal'
}

export default function CPUGPUMonitor({ history, cpu, gpu }) {
  const cpuColor = getStatusColor(cpu)
  const gpuColor = getStatusColor(gpu)

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">CPU / GPU Monitor</span>
        <span className="card-badge" style={{
          background: `${cpuColor}18`, color: cpuColor
        }}>{getStatusLabel(Math.max(cpu, gpu))}</span>
      </div>

      {/* CPU */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="metric-info">
            <span className="metric-name">CPU Usage</span>
            <span className="metric-value" style={{ color: cpuColor }}>
              {cpu.toFixed(1)}<span className="gauge-unit">%</span>
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: "'JetBrains Mono'" }}>
            {cpu > 85 ? '🔴 CRITICAL' : cpu > 70 ? '🟡 ELEVATED' : '🟢 NORMAL'}
          </span>
        </div>
        <MiniBar value={cpu} color={cpuColor} />
      </div>

      {/* GPU */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="metric-info">
            <span className="metric-name">GPU Usage</span>
            <span className="metric-value" style={{ color: gpuColor }}>
              {gpu.toFixed(1)}<span className="gauge-unit">%</span>
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: "'JetBrains Mono'" }}>
            {gpu > 85 ? '🔴 CRITICAL' : gpu > 70 ? '🟡 ELEVATED' : '🟢 NORMAL'}
          </span>
        </div>
        <MiniBar value={gpu} color={gpuColor} />
      </div>

      {/* CPU/GPU Comparison */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.8 }}>CPU</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: cpuColor }}>
            {cpu.toFixed(0)}
          </div>
        </div>
        <div style={{ fontSize: 20, color: 'var(--text-dim)' }}>⚡</div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.8 }}>GPU</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono'", color: gpuColor }}>
            {gpu.toFixed(0)}
          </div>
        </div>
        <div style={{
          fontSize: 10, color: 'var(--text-dim)', textAlign: 'center',
          fontFamily: "'JetBrains Mono'"
        }}>
          Load: {((cpu + gpu) / 2).toFixed(0)}%
        </div>
      </div>

      {/* CPU/GPU Chart */}
      <div style={{ marginTop: 14 }}>
        <CPUGPUChart history={history} />
      </div>
    </div>
  )
}

function CPUGPUChart({ history }) {

  const data = history.cpu.map((cpu, i) => ({
    cpu: history.cpu[i],
    gpu: history.gpu[i],
  }))

  if (data.length < 2) return null

  return (
    <div style={{ width: '100%', height: 80 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e4262c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e4262c" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="cpu" stroke="#e4262c" fill="url(#cpuGrad)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="gpu" stroke="#3b82f6" fill="url(#gpuGrad)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
