import React from 'react'

const SCENARIOS = [
  { id: 'idle', label: 'Idle', icon: '💤', color: '#6b7280' },
  { id: 'gaming', label: 'Gaming', icon: '🎮', color: '#e4262c' },
  { id: 'thermal_stress', label: 'Thermal', icon: '🔥', color: '#f97316' },
  { id: 'battery_drain', label: 'Battery', icon: '🔋', color: '#eab308' },
  { id: 'ram_pressure', label: 'RAM', icon: '💾', color: '#a855f7' },
  { id: 'heavy_load', label: 'Heavy Load', icon: '⚡', color: '#3b82f6' },
  { id: 'normal', label: 'Normal', icon: '📱', color: '#22c55e' },
]

/**
 * ScenarioSelector - Manual scenario selection buttons
 */
export default function ScenarioSelector({ currentScenario, onSetScenario, onToggleDemo, demoMode }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Scenario Simulator</span>
        <button
          className={`btn btn-sm ${demoMode ? 'btn-primary' : ''}`}
          onClick={onToggleDemo}
        >
          {demoMode ? 'Demo ON' : 'Demo OFF'}
        </button>
      </div>

      <div className="scenario-grid">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            className={`scenario-btn ${currentScenario === s.id ? 'active' : ''}`}
            onClick={() => onSetScenario(s.id)}
            style={{
              '--scenario-color': s.color,
              borderColor: currentScenario === s.id ? s.color : 'transparent',
            }}
          >
            <span className="scenario-icon">{s.icon}</span>
            <span className="scenario-name">{s.label}</span>
          </button>
        ))}
      </div>

      {currentScenario && (
        <div className="current-scenario">
          Current: <strong style={{ color: SCENARIOS.find(s => s.id === currentScenario)?.color || '#fff' }}>
            {SCENARIOS.find(s => s.id === currentScenario)?.label || currentScenario}
          </strong>
        </div>
      )}
    </div>
  )
}
