import React from 'react'

const eventColors = {
  prediction: { bg: '#e4262c', label: 'PREDICTION' },
  optimization: { bg: '#a855f7', label: 'OPTIMIZATION' },
  action: { bg: '#22c55e', label: 'ACTION' },
  scenario: { bg: '#3b82f6', label: 'SCENARIO' },
  info: { bg: '#6b7280', label: 'INFO' },
  warning: { bg: '#f97316', label: 'WARNING' },
  success: { bg: '#22c55e', label: 'SUCCESS' },
  critical: { bg: '#e4262c', label: 'CRITICAL' },
}

function getEventStyle(type) {
  return eventColors[type] || eventColors.info
}

export default function PerformanceTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">Performance Timeline</span>
          <span className="card-badge badge-blue">Live</span>
        </div>
        <div style={{
          textAlign: 'center', padding: '24px 0',
          color: 'var(--text-dim)', fontSize: 12
        }}>
          Waiting for events...
          <div style={{ marginTop: 8, fontSize: 20, opacity: 0.3 }}>⏳</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Performance Timeline</span>
        <span className="card-badge badge-blue">Live</span>
      </div>

      <div className="timeline" style={{ maxHeight: 350, overflowY: 'auto', paddingRight: 8 }}>
        {[...timeline].reverse().map((event) => {
          const style = getEventStyle(event.type)
          return (
            <div className="timeline-item" key={event.id}>
              <div className="timeline-dot" style={{ background: style.bg }} />
              <div className="timeline-type" style={{ color: style.bg }}>
                {style.label}
              </div>
              <div className="timeline-desc">{event.description}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
