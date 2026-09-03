import React from 'react'

/**
 * AISafetyGuardDisplay - Shows safety guard status and last check result
 */
export default function AISafetyGuardDisplay({ safetyCheck }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">AI Safety Guard</span>
        <span className="card-badge badge-green">Active</span>
      </div>

      <div className="safety-section">
        {/* Safety Status */}
        <div className="safety-status">
          <div className="safety-icon">🛡️</div>
          <div className="safety-info">
            <div className="safety-title">Protection Active</div>
            <div className="safety-desc">All optimizations verified before application</div>
          </div>
        </div>

        {/* Last Safety Check */}
        {safetyCheck ? (
          <div className={`safety-check-result ${safetyCheck.safe ? 'safe' : 'blocked'}`}>
            <div className="safety-check-header">
              <span className="safety-check-icon">{safetyCheck.safe ? '✅' : '🚫'}</span>
              <span className="safety-check-action">{safetyCheck.action}</span>
            </div>
            <div className="safety-check-reason">{safetyCheck.reason}</div>
            <div className="safety-check-risk">
              Risk Level: <strong>{safetyCheck.risk_level?.toUpperCase()}</strong>
            </div>
            {safetyCheck.side_effects && safetyCheck.side_effects.length > 0 && (
              <div className="safety-side-effects">
                <div className="side-effects-label">Side Effects:</div>
                {safetyCheck.side_effects.map((effect, i) => (
                  <div key={i} className="side-effect-item">* {effect}</div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="safety-check-pending">
            Waiting for optimization attempt...
          </div>
        )}

        {/* Safety Rules */}
        <div className="safety-rules">
          <div className="safety-rules-label">Safety Rules</div>
          <div className="safety-rule">CPU minimum threshold: 15%</div>
          <div className="safety-rule">RAM critical low: 20%</div>
          <div className="safety-rule">Thermal throttling limits enforced</div>
          <div className="safety-rule">Background kill count capped</div>
          <div className="safety-rule">FPS impact assessed</div>
        </div>
      </div>
    </div>
  )
}
