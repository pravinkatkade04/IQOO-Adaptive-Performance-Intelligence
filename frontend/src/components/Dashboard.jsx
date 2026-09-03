import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Existing components
import DeviceHealth from './DeviceHealth'
import AIRiskScore from './AIRiskScore'
import PredictionCenter from './PredictionCenter'
import PerformanceTimeline from './PerformanceTimeline'
import TemperatureMonitor from './TemperatureMonitor'
import CPU_gpUMonitor from './CPUGPUMonitor'
import BatteryIntelligence from './BatteryIntelligence'
import ActiveOptimization from './ActiveOptimization'
import PerformanceModes from './PerformanceModes'
import ComparisonDiagram from './ComparisonDiagram'

// New v2 components
import FuturePredictionPanel from './FuturePredictionPanel'
import ExplainableAI from './ExplainableAI'
import BeforeAfterComparison from './BeforeAfterComparison'
import AdaptivePerformanceScore from './AdaptivePerformanceScore'
import ScenarioSelector from './ScenarioSelector'
import AIOnOffToggle from './AIOnOffToggle'
import PredictionVsActualGraph from './PredictionVsActualGraph'
import AISafetyGuardDisplay from './AISafetyGuardDisplay'

export default function Dashboard({ telemetry }) {
  const {
    state, predictions, timeline, futurePredictions, adaptiveScore,
    comparison, aiEnabled, predictionAccuracy,
    history, toggleAI, setScenario, toggleDemo, setPerformanceMode
  } = telemetry

  if (!state) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '80vh', color: 'var(--text-dim)', fontSize: '14px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⚡</div>
          <div>Connecting to iQOO Intelligence Backend...</div>
          <div style={{ marginTop: 8, fontSize: 12 }}>Make sure the backend is running on port 8000</div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Active Optimization Banner */}
      {state.optimization_active && (
        <ActiveOptimization state={state} />
      )}

      {/* Row 1: Core Metrics */}
      <DeviceHealth state={state} />
      <AdaptivePerformanceScore adaptiveScore={adaptiveScore} />
      <AIRiskScore state={state} predictions={predictions} />
      <PerformanceModes mode={state.performance_mode} onSetMode={setPerformanceMode} />

      {/* Row 2: AI Intelligence */}
      <ExplainableAI predictions={predictions} state={state} />
      <FuturePredictionPanel futurePredictions={futurePredictions} />
      <AIOnOffToggle aiEnabled={aiEnabled} onToggleAI={toggleAI} />
      <ScenarioSelector
        currentScenario={telemetry.state?.performance_mode === 'smart_ai' ? '' : ''}
        onSetScenario={setScenario}
        onToggleDemo={toggleDemo}
        demoMode={telemetry.state?.demo_mode !== false}
      />

      {/* Row 3: Monitors */}
      <CPU_gpUMonitor history={history} cpu={state.cpu_usage} gpu={state.gpu_usage} />
      <TemperatureMonitor history={history} temp={state.temperature} batteryTemp={state.battery_temp} />
      <BatteryIntelligence history={history} battery={state.battery_level} />
      <AISafetyGuardDisplay safetyCheck={telemetry.state?.safety_check || predictions?.safety_check} />

      {/* Row 4: Comparison & Prediction Accuracy */}
      <BeforeAfterComparison comparison={comparison} history={history} />
      <PredictionVsActualGraph history={history} predictionAccuracy={predictionAccuracy} />

      {/* Row 5: Timeline & Architecture */}
      <PerformanceTimeline timeline={timeline} />
      <ComparisonDiagram />

      {/* Live Metric History Chart */}
      <div className="card span-4">
        <div className="card-header">
          <span className="card-title">Live Performance History</span>
          <span className="confidence-badge">
            {history.cpu.length} samples
          </span>
        </div>
        <LiveMetricsChart history={history} />
      </div>
    </div>
  )
}


function LiveMetricsChart({ history }) {
  const data = history.cpu.map((cpu, i) => ({
    i,
    cpu: history.cpu[i],
    gpu: history.gpu[i],
    temp: history.temp[i],
    risk: history.risk[i]
  }))

  return (
    <div style={{ width: '100%', height: 200 }}>
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
          <Line type="monotone" dataKey="cpu" stroke="#e4262c" strokeWidth={1.5} dot={false} name="CPU" />
          <Line type="monotone" dataKey="gpu" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="GPU" />
          <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={1.5} dot={false} name="Temp" />
          <Line type="monotone" dataKey="risk" stroke="#a855f7" strokeWidth={2} dot={false} name="AI Risk" strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
