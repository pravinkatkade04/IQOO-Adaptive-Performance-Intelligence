import { useState, useEffect, useRef, useCallback } from 'react'

const MAX_HISTORY = 80

/**
 * Custom hook for real-time telemetry via WebSocket with REST fallback.
 * Returns current state, history arrays, predictions, future predictions,
 * comparison data, and control functions.
 */
export function useTelemetry() {
  const [state, setState] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [futurePredictions, setFuturePredictions] = useState([])
  const [adaptiveScore, setAdaptiveScore] = useState(null)
  const [comparison, setComparison] = useState({ ai_on: null, ai_off: null })
  const [aiEnabled, setAiEnabled] = useState(true)
  const [predictionAccuracy, setPredictionAccuracy] = useState(null)
  const [history, setHistory] = useState({
    cpu: [], gpu: [], ram: [], temp: [], fps: [],
    battery: [], network: [], risk: [], score: [],
    ai_off_cpu: [], ai_off_temp: [], ai_off_fps: [],
  })
  const [connected, setConnected] = useState(false)
  const [mode, setMode] = useState('smart_ai')
  const wsRef = useRef(null)
  const pollRef = useRef(null)

  const processTick = useCallback((data) => {
    setState(data.state)
    setPredictions(data.predictions)
    setTimeline(data.timeline || [])
    setFuturePredictions(data.future_predictions || [])
    setAdaptiveScore(data.adaptive_score || null)
    setAiEnabled(data.ai_enabled !== false)
    setPredictionAccuracy(data.prediction_accuracy || null)

    if (data.ai_comparison) {
      setComparison(data.ai_comparison)
    }

    // Append to history for charts
    setHistory(prev => {
      const keys = {
        cpu: 'cpu_usage', gpu: 'gpu_usage', ram: 'ram_usage',
        temp: 'temperature', fps: 'fps', battery: 'battery_level',
        network: 'network_usage', risk: 'ai_risk_score', score: 'ai_risk_score'
      }
      const next = { ...prev }
      for (const [key, field] of Object.entries(keys)) {
        const val = key === 'score' ? (data.adaptive_score?.score || 0) : data.state[field]
        const arr = [...(prev[key] || []), val]
        next[key] = arr.length > MAX_HISTORY ? arr.slice(arr.length - MAX_HISTORY) : arr
      }

      // Track AI OFF state for comparison chart
      if (data.ai_comparison?.ai_off) {
        const off = data.ai_comparison.ai_off
        next.ai_off_cpu = [...(prev.ai_off_cpu || []), off.cpu_usage].slice(-MAX_HISTORY)
        next.ai_off_temp = [...(prev.ai_off_temp || []), off.temperature].slice(-MAX_HISTORY)
        next.ai_off_fps = [...(prev.ai_off_fps || []), off.fps].slice(-MAX_HISTORY)
      }

      return next
    })
  }, [])

  useEffect(() => {
    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const ws = new WebSocket(`${protocol}//${window.location.host}/ws/telemetry`)
        wsRef.current = ws

        ws.onopen = () => {
          setConnected(true)
          stopPolling()
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            processTick(data)
          } catch (e) {
            console.error('Failed to parse WS message:', e)
          }
        }

        ws.onclose = () => {
          setConnected(false)
          startPolling()
        }

        ws.onerror = () => {
          ws.close()
        }
      } catch (e) {
        startPolling()
      }
    }

    const startPolling = () => {
      if (pollRef.current) return
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch('/api/current-state')
          if (res.ok) {
            const data = await res.json()
            processTick(data)
            setConnected(true)
          }
        } catch (e) {
          setConnected(false)
        }
      }, 500)
    }

    connectWebSocket()

    return () => {
      wsRef.current?.close()
      stopPolling()
    }
  }, [processTick])

  const resetSimulator = useCallback(async () => {
    await fetch('/api/reset', { method: 'POST' })
    setHistory({
      cpu: [], gpu: [], ram: [], temp: [], fps: [],
      battery: [], network: [], risk: [], score: [],
      ai_off_cpu: [], ai_off_temp: [], ai_off_fps: [],
    })
  }, [])

  const setPerformanceMode = useCallback(async (newMode) => {
    setMode(newMode)
    await fetch(`/api/set-mode?mode=${newMode}`, { method: 'POST' })
  }, [])

  const skipScenario = useCallback(async () => {
    await fetch('/api/skip-scenario', { method: 'POST' })
  }, [])

  const toggleDemo = useCallback(async () => {
    await fetch('/api/toggle-demo', { method: 'POST' })
  }, [])

  const toggleAI = useCallback(async () => {
    const res = await fetch('/api/toggle-ai', { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setAiEnabled(data.ai_enabled)
    }
  }, [])

  const setScenario = useCallback(async (scenario) => {
    await fetch(`/api/set-scenario?scenario=${scenario}`, { method: 'POST' })
  }, [])

  return {
    state, predictions, timeline, futurePredictions, adaptiveScore,
    comparison, aiEnabled, predictionAccuracy,
    history, connected, mode,
    resetSimulator, setPerformanceMode, skipScenario, toggleDemo,
    toggleAI, setScenario
  }
}
