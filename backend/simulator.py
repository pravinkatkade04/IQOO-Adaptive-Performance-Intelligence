"""
iQOO Adaptive Performance Intelligence - Real-Time Simulator v2
Generates realistic, time-correlated smartphone performance telemetry.
Simulates idle, gaming, thermal stress, and optimization scenarios.
Supports AI ON/OFF comparison, future prediction, safety guard, and scenario control.
"""

import time
import math
import random
import copy
import numpy as np
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field, asdict
from enum import Enum


class DeviceScenario(Enum):
    IDLE = "idle"
    NORMAL = "normal"
    GAMING = "gaming"
    HEAVY_LOAD = "heavy_load"
    THERMAL_STRESS = "thermal_stress"
    BATTERY_DRAIN = "battery_drain"
    RAM_PRESSURE = "ram_pressure"
    OPTIMIZING = "optimizing"
    STABLE = "stable"


class PerformanceMode(Enum):
    PERFORMANCE = "performance"
    BALANCED = "balanced"
    SMART_AI = "smart_ai"


@dataclass
class DeviceState:
    """Complete device state at a point in time."""
    timestamp: float = 0.0
    cpu_usage: float = 35.0
    gpu_usage: float = 20.0
    ram_usage: float = 45.0
    temperature: float = 32.0
    battery_level: float = 85.0
    battery_temp: float = 30.0
    fps: float = 60.0
    network_usage: float = 10.0
    background_processes: int = 15
    active_app: str = "System"
    performance_mode: str = "smart_ai"

    # AI state
    ai_risk_score: float = 15.0
    overheating_risk: float = 5.0
    fps_drop_risk: float = 8.0
    battery_drain_risk: float = 12.0
    ram_pressure_risk: float = 10.0
    optimization_active: bool = False
    optimization_description: str = ""
    ai_confidence: float = 0.92

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class FuturePrediction:
    """A prediction about a future state."""
    horizon_seconds: int = 10
    predicted_cpu: float = 0.0
    predicted_gpu: float = 0.0
    predicted_temp: float = 0.0
    predicted_fps: float = 60.0
    predicted_battery: float = 85.0
    predicted_risk: float = 0.0
    risk_type: str = "none"
    confidence: float = 0.0
    explanation: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class SafetyCheck:
    """Result of an AI safety guard check."""
    action: str = ""
    safe: bool = True
    risk_level: str = "low"
    reason: str = ""
    side_effects: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class PredictionRecord:
    """A recorded prediction for accuracy comparison."""
    id: int = 0
    timestamp: float = 0.0
    predicted_value: float = 0.0
    actual_value: float = 0.0
    metric: str = ""
    horizon: int = 0

    def to_dict(self) -> dict:
        return asdict(self)


# ─── Scenario configurations ──────────────────────────────────────────────

SCENARIO_CONFIGS = {
    "gaming": {
        "duration": 60,
        "targets": lambda t: {
            'cpu': min(92, 55 + t * 0.6),
            'gpu': min(95, 60 + t * 0.65),
            'ram': min(80, 55 + t * 0.2),
            'temp': min(48, 33 + t * 0.22),
            'fps': max(30, 60 - max(0, (t - 30) * 0.5)),
            'network': 30,
            'bg': 20,
            'app': 'Genshin Impact'
        },
        "description": "Heavy gaming session pushing CPU/GPU to limits"
    },
    "thermal_stress": {
        "duration": 40,
        "targets": lambda t: {
            'cpu': 88 + random.gauss(0, 3),
            'gpu': 92 + random.gauss(0, 2),
            'ram': 75,
            'temp': min(52, 42 + t * 0.2),
            'fps': max(25, 60 - max(0, (t - 10) * 0.8)),
            'network': 20,
            'bg': 25,
            'app': 'Genshin Impact'
        },
        "description": "Thermal throttling risk - device overheating"
    },
    "battery_drain": {
        "duration": 40,
        "targets": lambda t: {
            'cpu': 70 + random.gauss(0, 3),
            'gpu': 65 + random.gauss(0, 2),
            'ram': 60,
            'temp': 38 + t * 0.08,
            'fps': 55,
            'network': 60 + t * 0.5,
            'bg': 35 + int(t * 0.2),
            'app': 'YouTube + Chrome'
        },
        "description": "Rapid battery drain from background processes and network"
    },
    "ram_pressure": {
        "duration": 40,
        "targets": lambda t: {
            'cpu': 65 + random.gauss(0, 2),
            'gpu': 50,
            'ram': min(95, 60 + t * 0.8),
            'temp': 36 + t * 0.1,
            'fps': max(30, 58 - max(0, (t - 20) * 1.0)),
            'network': 25,
            'bg': 45 + int(t * 0.3),
            'app': 'Chrome (20 tabs)'
        },
        "description": "RAM exhaustion from too many background apps"
    },
    "heavy_load": {
        "duration": 40,
        "targets": lambda t: {
            'cpu': min(95, 75 + t * 0.5),
            'gpu': min(98, 78 + t * 0.5),
            'ram': min(90, 65 + t * 0.4),
            'temp': min(50, 38 + t * 0.28),
            'fps': max(25, 58 - max(0, (t - 15) * 0.7)),
            'network': 45,
            'bg': 35,
            'app': 'Adobe Premiere Rush'
        },
        "description": "Combined CPU/GPU/RAM heavy load"
    },
    "idle": {
        "duration": 20,
        "targets": lambda t: {
            'cpu': 25 + random.gauss(0, 1),
            'gpu': 15 + random.gauss(0, 0.5),
            'ram': 40,
            'temp': 30,
            'fps': 60,
            'network': 5,
            'bg': 12,
            'app': 'System'
        },
        "description": "Idle state - minimal system activity"
    },
    "normal": {
        "duration": 30,
        "targets": lambda t: {
            'cpu': 40 + random.gauss(0, 2),
            'gpu': 30 + random.gauss(0, 1),
            'ram': 50,
            'temp': 33,
            'fps': 60,
            'network': 15,
            'bg': 18,
            'app': 'Chrome Browser'
        },
        "description": "Normal daily usage"
    },
}


class RealTimeSimulator:
    """
    Simulates realistic device telemetry with temporal dynamics.
    Supports AI ON/OFF comparison, future prediction, safety guard, and scenario control.
    """

    def __init__(self):
        self.tick_count = 0
        self.phase_tick = 0
        self.performance_mode = PerformanceMode.SMART_AI

        # Device state (AI ON)
        self._cpu = 25.0
        self._gpu = 15.0
        self._ram = 40.0
        self._temp = 30.0
        self._battery = 85.0
        self._battery_temp = 28.0
        self._fps = 60.0
        self._network = 5.0
        self._bg_procs = 12

        # Cumulative optimization impact tracking.
        # AI OFF = current state + reversed optimizations (what would happen without AI).
        self._cumulative_opt = {
            'cpu': 0.0, 'gpu': 0.0, 'temp': 0.0,
            'ram': 0.0, 'fps': 0.0, 'bg_procs': 0
        }

        # AI prediction state
        self._ai_predictions = []
        self._optimization_active = False
        self._optimization_cooldown = 0
        self._risk_history = []
        self._ai_enabled = True

        # Timeline events for frontend
        self.timeline_events: List[dict] = []
        self._event_id_counter = 0

        # Performance score history
        self._score_history: List[dict] = []

        # Prediction vs actual tracking
        self._prediction_records: List[PredictionRecord] = []
        self._pending_predictions: Dict[int, dict] = {}  # tick -> predictions made
        self._prediction_id_counter = 0

        # Current scenario
        self.current_scenario = "idle"
        self._scenario_tick = 0
        self.demo_mode = True
        self.demo_sequence = [
            ("idle", 15),
            ("gaming", 60),
            ("thermal_stress", 40),
            ("idle", 15),
            ("battery_drain", 30),
            ("idle", 10),
            ("ram_pressure", 30),
            ("idle", 10),
            ("heavy_load", 40),
            ("idle", 20),
        ]
        self.demo_index = 0

    def _add_timeline_event(self, event_type: str, description: str, severity: str = "info"):
        self._event_id_counter += 1
        self.timeline_events.append({
            "id": self._event_id_counter,
            "timestamp": time.time(),
            "tick": self.tick_count,
            "type": event_type,
            "description": description,
            "severity": severity
        })
        if len(self.timeline_events) > 30:
            self.timeline_events = self.timeline_events[-30:]

    def _clamp(self, val: float, lo: float, hi: float) -> float:
        return max(lo, min(hi, val))

    def _smooth(self, current: float, target: float, rate: float = 0.1) -> float:
        return current + (target - current) * rate + random.gauss(0, 0.3)

    def set_scenario(self, scenario: str):
        """Manually set a scenario. Disables demo mode so it persists."""
        if scenario in SCENARIO_CONFIGS:
            self.current_scenario = scenario
            self._scenario_tick = 0
            self.demo_mode = False  # Manual scenario overrides demo
            self._add_timeline_event('scenario', f'Scenario set to {scenario}', 'info')

    def set_ai_enabled(self, enabled: bool):
        """Toggle AI optimization on/off."""
        self._ai_enabled = enabled
        self._add_timeline_event(
            'action',
            f'AI Optimization {"ENABLED" if enabled else "DISABLED"}',
            'success' if enabled else 'warning'
        )

    def set_performance_mode(self, mode: str):
        """Set performance mode and adjust behavior."""
        if mode in ['performance', 'balanced', 'smart_ai']:
            self.performance_mode = PerformanceMode(mode)
            if mode == 'performance':
                self._add_timeline_event('action', 'Performance Mode activated - maximizing CPU/GPU output', 'success')
            elif mode == 'balanced':
                self._add_timeline_event('action', 'Balanced Mode activated - optimizing for efficiency', 'info')
            else:
                self._add_timeline_event('action', 'Smart AI Mode activated - adaptive optimization enabled', 'success')

    def _get_scenario_targets(self) -> Dict:
        """Get target values based on current scenario and tick."""
        config = SCENARIO_CONFIGS.get(self.current_scenario, SCENARIO_CONFIGS["idle"])
        t = self._scenario_tick
        return config["targets"](t)

    def _calculate_ai_predictions(self) -> Dict:
        """AI prediction engine - analyzes trends and predicts risks."""
        cpu, gpu, temp = self._cpu, self._gpu, self._temp
        ram, battery, fps = self._ram, self._battery, self._fps

        temp_rising = temp > 38 and cpu > 70
        cpu_overloaded = cpu > 80
        gpu_overloaded = gpu > 85

        # Overheating prediction
        overheating_risk = 0.0
        if temp > 42:
            overheating_risk = min(100, 60 + (temp - 42) * 10)
        elif temp > 38 and cpu_overloaded:
            overheating_risk = min(85, 30 + (temp - 38) * 8 + (cpu - 80) * 1.5)
        elif temp > 35 and cpu > 60:
            overheating_risk = min(50, 10 + (temp - 35) * 5)
        if temp_rising:
            overheating_risk = min(100, overheating_risk + 15)

        # FPS drop prediction
        fps_drop_risk = 0.0
        if cpu > 85 and gpu > 85:
            fps_drop_risk = min(95, 50 + (cpu + gpu - 170) * 2)
        elif temp > 41:
            fps_drop_risk = min(85, 40 + (temp - 41) * 12)
        elif cpu > 80 or gpu > 85:
            fps_drop_risk = min(60, 20 + max(cpu - 80, gpu - 85) * 2)
        if temp_rising:
            fps_drop_risk = min(100, fps_drop_risk + 10)

        # Battery drain prediction
        battery_drain_risk = 0.0
        if cpu > 75 and temp > 38:
            battery_drain_risk = min(80, 25 + (cpu - 75) + (temp - 38) * 2)
        if self._bg_procs > 25:
            battery_drain_risk += self._bg_procs * 1.5
        if self._network > 30:
            battery_drain_risk += (self._network - 30) * 0.5
        battery_drain_risk = min(100, battery_drain_risk)

        # RAM pressure
        ram_pressure_risk = 0.0
        if ram > 80:
            ram_pressure_risk = min(100, 40 + (ram - 80) * 5)
        elif ram > 70:
            ram_pressure_risk = min(60, (ram - 70) * 4)

        # Overall risk score
        ai_risk = (
            overheating_risk * 0.30 +
            fps_drop_risk * 0.25 +
            battery_drain_risk * 0.20 +
            ram_pressure_risk * 0.15 +
            max(0, cpu - 80) * 0.5 +
            max(0, gpu - 85) * 0.3
        )
        ai_risk = self._clamp(ai_risk, 0, 100)

        # Generate AI explanations
        explanations = []
        if overheating_risk > 30:
            explanations.append(
                f"CPU utilization has been {'above 80%' if cpu > 80 else 'elevated'} "
                f"while device temperature is {temp:.1f}C and {'rising' if temp_rising else 'stable'}."
            )
        if fps_drop_risk > 30:
            explanations.append(
                f"GPU load at {gpu:.0f}% combined with {'thermal pressure' if temp > 40 else 'high CPU load'} "
                f"increases frame drop probability."
            )
        if battery_drain_risk > 30:
            explanations.append(
                f"{'High' if cpu > 80 else 'Elevated'} CPU/GPU utilization "
                f"with {self._bg_procs} background processes accelerating battery drain."
            )
        if ram_pressure_risk > 30:
            explanations.append(
                f"RAM usage at {ram:.0f}% with {self._bg_procs} background processes "
                f"causing memory pressure."
            )
        if not explanations:
            explanations.append("System metrics are within normal operating parameters.")

        confidence = 0.85 + random.uniform(0, 0.10)
        if len(self._risk_history) > 5:
            confidence = min(0.97, confidence + 0.03)

        return {
            'ai_risk_score': round(self._clamp(ai_risk, 0, 100), 1),
            'overheating_risk': round(self._clamp(overheating_risk, 0, 100), 1),
            'fps_drop_risk': round(self._clamp(fps_drop_risk, 0, 100), 1),
            'battery_drain_risk': round(self._clamp(battery_drain_risk, 0, 100), 1),
            'ram_pressure_risk': round(self._clamp(ram_pressure_risk, 0, 100), 1),
            'explanations': explanations,
            'confidence': round(confidence, 2),
            'cpu_status': 'overloaded' if cpu > 85 else ('high' if cpu > 70 else 'normal'),
            'thermal_status': 'critical' if temp > 44 else ('warning' if temp > 40 else 'normal'),
        }

    def _generate_future_predictions(self) -> List[dict]:
        """Generate predictions for 10s, 20s, 30s into the future."""
        predictions = []
        cpu, gpu, temp = self._cpu, self._gpu, self._temp
        battery, fps = self._battery, self._fps
        config = SCENARIO_CONFIGS.get(self.current_scenario, SCENARIO_CONFIGS["idle"])

        for horizon in [10, 20, 30]:
            # Project where metrics will be if no intervention
            future_t = self._scenario_tick + horizon * 2  # 2 ticks per second
            targets = config["targets"](future_t)

            # Predict with some noise
            pred_cpu = self._clamp(targets.get('cpu', cpu) + random.gauss(0, 2), 2, 100)
            pred_gpu = self._clamp(targets.get('gpu', gpu) + random.gauss(0, 2), 1, 100)
            pred_temp = self._clamp(targets.get('temp', temp) + random.gauss(0, 0.5), 22, 55)
            pred_fps = self._clamp(targets.get('fps', fps) + random.gauss(0, 1), 15, 62)
            pred_battery = max(0, battery - (horizon * 0.03 * (1 + cpu / 200)))

            # Calculate future risk
            future_risk = 0.0
            if pred_temp > 42:
                future_risk += 40
            elif pred_temp > 38:
                future_risk += 20
            if pred_cpu > 85:
                future_risk += 25
            if pred_gpu > 85:
                future_risk += 20
            if pred_fps < 50:
                future_risk += 15
            future_risk = self._clamp(future_risk, 0, 100)

            # Determine risk type
            risk_type = "none"
            if future_risk > 60:
                if pred_temp > 42:
                    risk_type = "thermal_throttling"
                elif pred_cpu > 90 and pred_gpu > 90:
                    risk_type = "performance_degradation"
                else:
                    risk_type = "moderate_risk"
            elif future_risk > 30:
                risk_type = "elevated_risk"

            # Generate explanation
            explanation_parts = []
            if pred_temp > 40:
                explanation_parts.append(f"Temperature projected to reach {pred_temp:.0f}C")
            if pred_cpu > 80:
                explanation_parts.append(f"CPU load trending toward {pred_cpu:.0f}%")
            if pred_gpu > 85:
                explanation_parts.append(f"GPU load projected at {pred_gpu:.0f}%")
            if pred_fps < 50:
                explanation_parts.append(f"FPS expected to drop to {pred_fps:.0f}")
            if not explanation_parts:
                explanation_parts.append("Metrics trending within normal range")

            confidence = min(0.95, 0.70 + horizon * 0.01 + random.uniform(0, 0.05))

            predictions.append({
                'horizon_seconds': horizon,
                'predicted_cpu': round(pred_cpu, 1),
                'predicted_gpu': round(pred_gpu, 1),
                'predicted_temp': round(pred_temp, 1),
                'predicted_fps': round(pred_fps, 1),
                'predicted_battery': round(pred_battery, 1),
                'predicted_risk': round(future_risk, 1),
                'risk_type': risk_type,
                'confidence': round(confidence, 2),
                'explanation': '. '.join(explanation_parts) + '.'
            })

        return predictions

    def _calculate_adaptive_score(self) -> Dict:
        """Calculate a 0-100 adaptive performance score from multiple metrics."""
        cpu_score = max(0, 100 - self._cpu)  # Lower CPU = better
        gpu_score = max(0, 100 - self._gpu)
        ram_score = max(0, 100 - abs(self._ram - 50) * 2)  # 50% is ideal
        temp_score = max(0, 100 - max(0, (self._temp - 35) * 5))
        fps_score = min(100, self._fps * 100 / 60)
        battery_score = self._battery
        risk_penalty = max(0, self._cpu * 0.3)  # Derived from current state

        # Weighted composite score
        score = (
            cpu_score * 0.15 +
            gpu_score * 0.12 +
            ram_score * 0.13 +
            temp_score * 0.20 +
            fps_score * 0.20 +
            battery_score * 0.10 +
            (100 - risk_penalty) * 0.10
        )
        score = self._clamp(score, 0, 100)

        # Determine rating
        if score >= 85:
            rating = "Excellent"
        elif score >= 70:
            rating = "Good"
        elif score >= 50:
            rating = "Fair"
        elif score >= 30:
            rating = "Poor"
        else:
            rating = "Critical"

        return {
            'score': round(score, 1),
            'rating': rating,
            'cpu_score': round(cpu_score, 1),
            'gpu_score': round(gpu_score, 1),
            'ram_score': round(ram_score, 1),
            'temp_score': round(temp_score, 1),
            'fps_score': round(fps_score, 1),
            'battery_score': round(battery_score, 1),
        }

    def _safety_check(self, optimization: Dict) -> SafetyCheck:
        """Safety guard - check if an optimization is safe to apply."""
        action = optimization.get('action', 'unknown')
        impact = optimization.get('impact', {})
        side_effects = []

        # Check CPU reduction safety
        if 'cpu' in impact and impact['cpu'] < 0:
            new_cpu = self._cpu + impact['cpu']
            if new_cpu < 15:
                return SafetyCheck(
                    action=action, safe=False, risk_level="high",
                    reason=f"CPU would drop to {new_cpu:.0f}% - below safe minimum (15%). Active app may crash.",
                    side_effects=["Active application may freeze", "Background tasks may fail"]
                )
            if new_cpu < 25:
                side_effects.append("Active app may experience brief slowdown")

        # Check temperature safety
        if 'temp' in impact and impact['temp'] < -5:
            side_effects.append("Aggressive thermal throttling - may cause frame drops")

        # Check RAM safety
        if 'ram' in impact and impact['ram'] < 0:
            new_ram = self._ram + impact['ram']
            if new_ram < 20:
                return SafetyCheck(
                    action=action, safe=False, risk_level="high",
                    reason=f"RAM would drop to {new_ram:.0f}% - critical low. System instability likely.",
                    side_effects=["System may become unstable", "Apps may be force-closed"]
                )

        # Check FPS impact
        if 'fps' in impact and impact['fps'] < -5:
            side_effects.append("Noticeable frame rate reduction")

        # Check background process kill count
        if 'bg_procs' in impact and impact['bg_procs'] < -10:
            side_effects.append("Many background apps will be closed - user notifications may be lost")

        # Determine overall risk
        risk_level = "low"
        if len(side_effects) > 2:
            risk_level = "medium"
        if len(side_effects) > 4:
            risk_level = "high"

        return SafetyCheck(
            action=action, safe=True, risk_level=risk_level,
            reason=f"Optimization '{action}' is safe to apply" + (f" with {risk_level} risk" if risk_level != "low" else ""),
            side_effects=side_effects
        )

    def _decide_optimization(self, predictions: Dict) -> Optional[Dict]:
        """Adaptive Decision Engine - decides what optimization to apply."""
        if self._optimization_cooldown > 0:
            self._optimization_cooldown -= 1
            return None

        # Respect performance mode
        if self.performance_mode == PerformanceMode.BALANCED:
            risk = predictions['ai_risk_score']
            if risk < 50:
                return None
        elif self.performance_mode == PerformanceMode.PERFORMANCE:
            # In performance mode, only intervene for critical issues
            risk = predictions['ai_risk_score']
            if risk < 70:
                return None

        risk = predictions['ai_risk_score']
        if risk < 40:
            return None

        optimizations = []

        if predictions['overheating_risk'] > 50:
            optimizations.append({
                'action': 'thermal_throttle',
                'description': 'Thermal throttling initiated - reducing CPU/GPU frequency',
                'impact': {'cpu': -12, 'gpu': -8, 'temp': -3}
            })

        if predictions['fps_drop_risk'] > 45:
            optimizations.append({
                'action': 'gpu_priority',
                'description': 'GPU priority allocation - boosting frames for active application',
                'impact': {'fps': 5, 'gpu': 3, 'bg_procs': -5}
            })

        if predictions['battery_drain_risk'] > 40:
            optimizations.append({
                'action': 'background_kill',
                'description': 'Killing unnecessary background processes to reduce power draw',
                'impact': {'bg_procs': -8, 'cpu': -5}
            })

        if predictions['ram_pressure_risk'] > 45:
            optimizations.append({
                'action': 'memory_optimize',
                'description': 'Memory optimization - clearing cache and reclaiming RAM',
                'impact': {'ram': -10, 'bg_procs': -3}
            })

        if risk > 60 and not optimizations:
            optimizations.append({
                'action': 'mode_switch',
                'description': 'Switching to efficiency mode to prevent performance degradation',
                'impact': {'cpu': -10, 'gpu': -10, 'temp': -4, 'fps': 2}
            })

        if optimizations:
            chosen = optimizations[0]

            # Safety guard check
            safety = self._safety_check(chosen)
            if not safety.safe:
                self._add_timeline_event(
                    'safety',
                    f"BLOCKED: {safety.reason}",
                    'critical'
                )
                return None

            self._optimization_active = True
            self._optimization_cooldown = 10

            self._add_timeline_event(
                'optimization',
                chosen['description'],
                'warning' if risk > 60 else 'info'
            )
            return chosen

        return None

    def _apply_optimization_impact(self, optimization: Dict):
        """Apply optimization effects to device state AND track cumulative impact."""
        impact = optimization['impact']

        # Accumulate the impact for AI OFF comparison
        for key in self._cumulative_opt:
            if key in impact:
                self._cumulative_opt[key] += impact[key]

        if 'cpu' in impact:
            self._cpu = self._clamp(self._cpu + impact['cpu'], 10, 100)
        if 'gpu' in impact:
            self._gpu = self._clamp(self._gpu + impact['gpu'], 5, 100)
        if 'temp' in impact:
            self._temp = self._clamp(self._temp + impact['temp'], 22, 55)
        if 'ram' in impact:
            self._ram = self._clamp(self._ram + impact['ram'], 15, 95)
        if 'fps' in impact:
            self._fps = self._clamp(self._fps + impact['fps'], 20, 62)
        if 'bg_procs' in impact:
            self._bg_procs = max(5, self._bg_procs + impact['bg_procs'])

    def _compute_ai_off_state(self) -> Dict:
        """Compute AI OFF state: what would happen WITHOUT any AI optimizations.
        
        Uses cumulative optimization tracking: AI OFF = current state + reversed
        optimizations. This guarantees AI OFF is always worse when AI has helped,
        and equal when AI hasn't done anything.
        """
        # Reverse the cumulative optimizations to get the unoptimized state
        # CPU: AI reduced it by X, so without AI it would be higher
        ai_off_cpu = self._clamp(self._cpu - self._cumulative_opt['cpu'], 2, 100)
        # GPU: AI reduced it by X, so without AI it would be higher
        ai_off_gpu = self._clamp(self._gpu - self._cumulative_opt['gpu'], 1, 100)
        # Temperature: AI reduced it by X, so without AI it would be hotter
        ai_off_temp = self._clamp(self._temp - self._cumulative_opt['temp'], 22, 55)
        # RAM: AI freed it, so without AI it would be more used
        ai_off_ram = self._clamp(self._ram - self._cumulative_opt['ram'], 15, 95)
        # FPS: AI boosted it, so without AI it would be lower
        ai_off_fps = self._clamp(self._fps - self._cumulative_opt['fps'], 15, 62)
        # Battery: AI saved power, so without AI it would be lower
        # (battery drain from optimizations is tracked as percentage saved)
        ai_off_battery = max(0, self._battery - self._cumulative_opt.get('battery_drain', 0))
        # Background processes: AI killed them, so without AI there would be more
        ai_off_bg = max(3, self._bg_procs - self._cumulative_opt['bg_procs'])

        return {
            'cpu_usage': round(ai_off_cpu, 1),
            'gpu_usage': round(ai_off_gpu, 1),
            'ram_usage': round(ai_off_ram, 1),
            'temperature': round(ai_off_temp, 1),
            'battery_level': round(ai_off_battery, 1),
            'fps': round(ai_off_fps, 1),
            'background_processes': ai_off_bg,
        }

    def tick_once(self) -> Dict:
        """Advance simulation by one tick and return full device state."""
        self.tick_count += 1
        self.phase_tick += 1
        self._scenario_tick += 1

        # Demo mode: advance through scenarios
        if self.demo_mode and self.demo_index < len(self.demo_sequence):
            scenario_name, duration = self.demo_sequence[self.demo_index]
            if self.phase_tick >= duration:
                self.demo_index += 1
                self.phase_tick = 0
                if self.demo_index < len(self.demo_sequence):
                    new_scenario, _ = self.demo_sequence[self.demo_index]
                    self.current_scenario = new_scenario
                    self._scenario_tick = 0
                    self._add_timeline_event(
                        'scenario',
                        f'Scenario changed to {new_scenario}',
                        'info'
                    )

        # Get target values for current phase
        targets = self._get_scenario_targets()

        # Smooth transition toward targets
        self._cpu = self._clamp(self._smooth(self._cpu, targets['cpu']), 2, 100)
        self._gpu = self._clamp(self._smooth(self._gpu, targets['gpu']), 1, 100)
        self._ram = self._clamp(self._smooth(self._ram, targets['ram']), 15, 95)
        self._fps = self._clamp(self._smooth(self._fps, targets['fps']), 15, 62)
        self._network = self._clamp(self._smooth(self._network, targets['network']), 0, 100)
        self._bg_procs = max(3, int(self._smooth(self._bg_procs, targets['bg'])))

        # Temperature dynamics: blend physics-based heat with scenario target
        heat_generation = (self._cpu * 0.4 + self._gpu * 0.4) / 100
        cooling = max(0, (self._temp - 28) * 0.015)
        physics_temp = self._temp + heat_generation * 0.3 - cooling
        # Also pull toward the scenario's temperature target (realistic thermal load)
        target_temp = targets.get('temp', 30)
        self._temp = self._clamp(
            self._temp + (physics_temp - self._temp) * 0.6 + (target_temp - self._temp) * 0.15 + random.gauss(0, 0.15),
            22, 55
        )

        # Battery
        drain = 0.005 + (self._cpu / 100) * 0.012 + (self._gpu / 100) * 0.008
        if self._temp > 40:
            drain *= 1.3
        self._battery = max(0, self._battery - drain)
        self._battery_temp = self._clamp(self._temp * 0.85 + 2, 25, 48)

        # FPS degradation under pressure
        thermal_penalty = max(0, (self._temp - 43) * 2)
        load_penalty = max(0, (self._cpu - 88) * 0.3 + (self._gpu - 90) * 0.2)
        if thermal_penalty > 0 or load_penalty > 0:
            target_fps = 60 - thermal_penalty - load_penalty
            self._fps = self._clamp(self._smooth(self._fps, target_fps, 0.3), 20, 62)

        # Decay cumulative optimizations (they fade over time — optimizations are temporary)
        # This prevents AI OFF from becoming unrealistically bad after many optimizations
        for key in self._cumulative_opt:
            self._cumulative_opt[key] *= 0.95  # 5% decay per tick

        # Track battery drain from AI optimizations as a separate cumulative metric
        if self._ai_enabled and self._optimization_active:
            drain_saving = 0.003 + (abs(self._cumulative_opt.get('cpu', 0)) * 0.0002)
            self._cumulative_opt['battery_drain'] = self._cumulative_opt.get('battery_drain', 0) + drain_saving

        # AI predictions
        predictions = self._calculate_ai_predictions()
        self._risk_history.append(predictions['ai_risk_score'])
        if len(self._risk_history) > 50:
            self._risk_history = self._risk_history[-50:]

        # Check for critical predictions -> add timeline events
        if predictions['overheating_risk'] > 50 and not self._optimization_active:
            self._add_timeline_event(
                'prediction',
                f"THERMAL THROTTLING PREDICTED - Temperature rising to {self._temp:.1f}C",
                'critical'
            )
        elif predictions['fps_drop_risk'] > 40 and not self._tick_has_event('prediction', 'THERMAL'):
            self._add_timeline_event(
                'prediction',
                f"FPS DROP RISK - GPU at {self._gpu:.0f}%, thermal pressure building",
                'warning'
            )

        # Optimization decision
        optimization = None
        safety_result = None
        opt_desc = ""

        if self._ai_enabled:
            optimization = self._decide_optimization(predictions)

        if optimization:
            safety_result = self._safety_check(optimization)
            self._apply_optimization_impact(optimization)
            opt_desc = optimization['description']
            self._add_timeline_event(
                'action',
                f"AI Optimization Active: {optimization['description']}",
                'success'
            )
        elif self._optimization_cooldown <= 0:
            self._optimization_active = False
            opt_desc = ""

        # Track prediction vs actual (record predictions to compare later)
        self._track_prediction_accuracy(predictions)

        # Generate future predictions
        future_predictions = self._generate_future_predictions()

        # Calculate adaptive performance score
        adaptive_score = self._calculate_adaptive_score()

        # Record score history
        self._score_history.append({
            'tick': self.tick_count,
            'score': adaptive_score['score'],
            'cpu': self._cpu,
            'gpu': self._gpu,
            'temp': self._temp,
            'fps': self._fps
        })
        if len(self._score_history) > 100:
            self._score_history = self._score_history[-100:]

        # Build state
        state = DeviceState(
            timestamp=time.time(),
            cpu_usage=round(self._cpu, 1),
            gpu_usage=round(self._gpu, 1),
            ram_usage=round(self._ram, 1),
            temperature=round(self._temp, 1),
            battery_level=round(self._battery, 1),
            battery_temp=round(self._battery_temp, 1),
            fps=round(self._fps, 1),
            network_usage=round(self._network, 1),
            background_processes=self._bg_procs,
            active_app=targets.get('app', 'System'),
            performance_mode=self.performance_mode.value,
            ai_risk_score=predictions['ai_risk_score'],
            overheating_risk=predictions['overheating_risk'],
            fps_drop_risk=predictions['fps_drop_risk'],
            battery_drain_risk=predictions['battery_drain_risk'],
            ram_pressure_risk=predictions['ram_pressure_risk'],
            optimization_active=self._optimization_active,
            optimization_description=opt_desc,
            ai_confidence=predictions['confidence']
        )

        # Build comparison data (AI OFF state — what would happen without AI)
        ai_off_state = self._compute_ai_off_state()

        return {
            'state': state.to_dict(),
            'predictions': predictions,
            'timeline': self.timeline_events[-15:],
            'scenario': self.current_scenario,
            'scenario_description': SCENARIO_CONFIGS.get(self.current_scenario, {}).get('description', ''),
            'phase_progress': round(self.phase_tick / max(1, SCENARIO_CONFIGS.get(self.current_scenario, {}).get('duration', 30)) * 100, 1),
            'future_predictions': future_predictions,
            'adaptive_score': adaptive_score,
            'ai_comparison': {
                'ai_on': state.to_dict(),
                'ai_off': ai_off_state
            },
            'ai_enabled': self._ai_enabled,
            'safety_check': safety_result.to_dict() if safety_result else None,
            'performance_mode': self.performance_mode.value,
            'prediction_accuracy': self._get_prediction_accuracy_summary(),
        }

    def _track_prediction_accuracy(self, predictions: Dict):
        """Track predictions and compare with actual values over time."""
        # Record current actual values
        current_actual = {
            'cpu': self._cpu, 'gpu': self._gpu, 'temp': self._temp,
            'fps': self._fps, 'battery': self._battery
        }

        # Check if any pending predictions have reached their horizon
        expired_ticks = []
        for tick, pred_info in self._pending_predictions.items():
            ticks_elapsed = self.tick_count - tick
            horizon_ticks = pred_info['horizon'] * 2  # 2 ticks per second
            if ticks_elapsed >= horizon_ticks:
                # Record the prediction vs actual
                for metric, pred_val in pred_info['predicted'].items():
                    if metric in current_actual:
                        self._prediction_id_counter += 1
                        self._prediction_records.append(PredictionRecord(
                            id=self._prediction_id_counter,
                            timestamp=time.time(),
                            predicted_value=round(pred_val, 1),
                            actual_value=round(current_actual[metric], 1),
                            metric=metric,
                            horizon=pred_info['horizon']
                        ))
                expired_ticks.append(tick)

        for tick in expired_ticks:
            del self._pending_predictions[tick]

        # Keep only recent records
        if len(self._prediction_records) > 100:
            self._prediction_records = self._prediction_records[-100:]

        # Record new predictions for future comparison
        horizon = 10
        self._pending_predictions[self.tick_count] = {
            'horizon': horizon,
            'predicted': {
                'cpu': predictions.get('ai_risk_score', 50),  # Use risk as proxy
            }
        }

    def _get_prediction_accuracy_summary(self) -> Dict:
        """Get summary of prediction accuracy."""
        if not self._prediction_records:
            return {'avg_error': 0, 'count': 0, 'records': []}

        recent = self._prediction_records[-20:]
        errors = [abs(r.predicted_value - r.actual_value) for r in recent]
        avg_error = sum(errors) / len(errors) if errors else 0

        return {
            'avg_error': round(avg_error, 1),
            'count': len(recent),
            'records': [r.to_dict() for r in recent[-10:]]
        }

    def _tick_has_event(self, event_type: str, contains: str) -> bool:
        """Check if recent timeline has a specific event."""
        for event in self.timeline_events[-5:]:
            if event['type'] == event_type and contains in event['description']:
                return True
        return False

    def reset(self):
        """Reset simulator to initial state."""
        self.__init__()


# Global simulator instance
simulator = RealTimeSimulator()
