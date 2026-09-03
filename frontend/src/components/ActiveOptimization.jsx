import React from 'react'

export default function ActiveOptimization({ state }) {
  return (
    <div className="optimization-banner">
      <div className="optimization-icon">⚡</div>
      <div className="optimization-text">
        <h3>AI Adaptive Optimization Active</h3>
        <p>
          {state.optimization_description || 
            'The AI prediction engine has detected a performance risk and is proactively optimizing system resources to prevent degradation.'}
        </p>
      </div>
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0
      }}>
        <div style={{
          width: 10, height: 10,
          borderRadius: '50%',
          background: '#e4262c',
          animation: 'pulse-dot 1s ease-in-out infinite'
        }} />
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: '#e4262c',
          letterSpacing: 1,
          textTransform: 'uppercase'
        }}>
          LIVE
        </span>
      </div>
    </div>
  )
}
