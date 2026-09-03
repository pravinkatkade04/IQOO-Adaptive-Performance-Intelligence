import React from 'react'

/**
 * AIOnOffToggle - Toggle AI optimization on/off with visual feedback
 */
export default function AIOnOffToggle({ aiEnabled, onToggleAI }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">AI Control</span>
        <span className={`card-badge ${aiEnabled ? 'badge-green' : 'badge-red'}`}>
          {aiEnabled ? 'ACTIVE' : 'DISABLED'}
        </span>
      </div>

      <div className="ai-toggle-section">
        <div className="ai-toggle-visual">
          <div className={`ai-toggle-indicator ${aiEnabled ? 'enabled' : 'disabled'}`}>
            <div className="ai-toggle-glow" />
            <span className="ai-toggle-icon">{aiEnabled ? '🧠' : '⏸️'}</span>
          </div>
          <div className="ai-toggle-status">
            <div className="ai-toggle-title">
              {aiEnabled ? 'AI Optimization ON' : 'AI Optimization OFF'}
            </div>
            <div className="ai-toggle-desc">
              {aiEnabled
                ? 'System is actively predicting and preventing performance issues'
                : 'System is running without AI intervention - issues may not be prevented'
              }
            </div>
          </div>
        </div>

        <button
          className={`ai-toggle-btn ${aiEnabled ? 'enabled' : 'disabled'}`}
          onClick={onToggleAI}
        >
          {aiEnabled ? 'Disable AI' : 'Enable AI'}
        </button>

        <div className="ai-toggle-impact">
          <div className="impact-item">
            <span className="impact-label">With AI:</span>
            <span className="impact-value positive">Proactive optimization</span>
          </div>
          <div className="impact-item">
            <span className="impact-label">Without AI:</span>
            <span className="impact-value negative">Reactive only (or none)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
