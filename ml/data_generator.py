"""
iQOO Adaptive Performance Intelligence - Synthetic Data Generator
Generates realistic smartphone performance telemetry for ML training.
"""

import numpy as np
import pandas as pd
import os
from datetime import datetime, timedelta


def generate_realistic_telemetry(n_samples: int = 50000, seed: int = 42) -> pd.DataFrame:
    """
    Generate realistic smartphone telemetry with correlated metrics.
    Simulates gaming, browsing, idle, and heavy workload scenarios.
    """
    np.random.seed(seed)
    
    timestamps = [datetime(2026, 1, 1) + timedelta(seconds=i * 2) for i in range(n_samples)]
    
    # Scenario mixing: different usage patterns
    scenarios = np.random.choice(
        ['idle', 'browsing', 'gaming', 'heavy'],
        size=n_samples,
        p=[0.25, 0.30, 0.30, 0.15]
    )
    
    # Base metrics per scenario
    cpu_base = {'idle': 15, 'browsing': 35, 'gaming': 75, 'heavy': 85}
    gpu_base = {'idle': 8, 'browsing': 20, 'gaming': 70, 'heavy': 80}
    ram_base = {'idle': 25, 'browsing': 40, 'gaming': 65, 'heavy': 75}
    temp_base = {'idle': 28, 'browsing': 32, 'gaming': 38, 'heavy': 42}
    fps_base = {'idle': 60, 'browsing': 60, 'gaming': 60, 'heavy': 55}
    net_base = {'idle': 2, 'browsing': 15, 'gaming': 25, 'heavy': 40}
    bg_proc = {'idle': 12, 'browsing': 18, 'gaming': 22, 'heavy': 30}
    
    # Generate correlated metrics with temporal dynamics
    cpu_usage = np.zeros(n_samples)
    gpu_usage = np.zeros(n_samples)
    ram_usage = np.zeros(n_samples)
    temperature = np.zeros(n_samples)
    fps = np.zeros(n_samples)
    battery = np.zeros(n_samples)
    network = np.zeros(n_samples)
    background = np.zeros(n_samples)
    
    # Initialize battery
    battery[0] = 85.0
    
    for i in range(n_samples):
        s = scenarios[i]
        
        if i == 0:
            cpu_usage[i] = cpu_base[s] + np.random.normal(0, 3)
            gpu_usage[i] = gpu_base[s] + np.random.normal(0, 3)
            ram_usage[i] = ram_base[s] + np.random.normal(0, 2)
            temperature[i] = temp_base[s] + np.random.normal(0, 0.5)
            fps[i] = fps_base[s] + np.random.normal(0, 1)
            network[i] = net_base[s] + np.random.normal(0, 2)
            background[i] = bg_proc[s] + np.random.normal(0, 1)
        else:
            # Temporal autocorrelation + noise
            alpha = 0.85  # how much previous value matters
            cpu_usage[i] = alpha * cpu_usage[i-1] + (1-alpha) * cpu_base[s] + np.random.normal(0, 4)
            gpu_usage[i] = alpha * gpu_usage[i-1] + (1-alpha) * gpu_base[s] + np.random.normal(0, 4)
            ram_usage[i] = alpha * ram_usage[i-1] + (1-alpha) * ram_base[s] + np.random.normal(0, 2)
            
            # Temperature depends on CPU/GPU load with delay
            heat_factor = (cpu_usage[i] * 0.4 + gpu_usage[i] * 0.4) / 100
            cooling = max(0, temperature[i-1] - 27) * 0.02  # natural cooling
            temperature[i] = temperature[i-1] + heat_factor * 0.8 - cooling + np.random.normal(0, 0.3)
            
            # FPS drops when temperature is high or CPU/GPU overloaded
            thermal_penalty = max(0, (temperature[i] - 42) * 2)
            load_penalty = max(0, (cpu_usage[i] - 85) * 0.3 + (gpu_usage[i] - 85) * 0.3)
            fps[i] = fps_base[s] - thermal_penalty - load_penalty + np.random.normal(0, 1)
            
            network[i] = alpha * network[i-1] + (1-alpha) * net_base[s] + np.random.normal(0, 3)
            background[i] = alpha * background[i-1] + (1-alpha) * bg_proc[s] + np.random.normal(0, 2)
        
        # Battery drain depends on CPU/GPU/temperature
        drain_rate = 0.003 + (cpu_usage[i] / 100) * 0.008 + (gpu_usage[i] / 100) * 0.006
        if temperature[i] > 40:
            drain_rate *= 1.5
        battery[i] = max(0, battery[i-1 if i > 0 else 0] - drain_rate) if i > 0 else battery[0]
    
    # Clip values to realistic ranges
    cpu_usage = np.clip(cpu_usage, 2, 100)
    gpu_usage = np.clip(gpu_usage, 1, 100)
    ram_usage = np.clip(ram_usage, 15, 95)
    temperature = np.clip(temperature, 22, 55)
    fps = np.clip(fps, 15, 62)
    battery = np.clip(np.cumsum(np.full(n_samples, -0.005)) + 85, 0, 100)[:n_samples]
    network = np.clip(network, 0, 100)
    background = np.clip(background, 3, 50).astype(int)
    
    # Generate targets based on correlated patterns
    overheating_risk = ((temperature > 42) | ((temperature > 39) & (cpu_usage > 80))).astype(int)
    
    fps_drop_risk = (
        ((fps < 45) | 
         ((temperature > 40) & (gpu_usage > 80)) |
         ((cpu_usage > 85) & (gpu_usage > 85)))
    ).astype(int)
    
    battery_drain_risk = (
        ((battery < 30) |
         ((cpu_usage > 70) & (temperature > 38) & (background > 25)) |
         (network > 70))
    ).astype(int)
    
    performance_degradation = (
        (overheating_risk | fps_drop_risk | 
         (cpu_usage > 90) | (ram_usage > 85) |
         ((temperature > 40) & (cpu_usage > 75)))
    ).astype(int)
    
    # Add some noise to targets to make them more realistic
    noise = np.random.random(n_samples)
    overheating_risk = np.where(noise < 0.05, 1 - overheating_risk, overheating_risk)
    fps_drop_risk = np.where(noise < 0.05, 1 - fps_drop_risk, fps_drop_risk)
    
    df = pd.DataFrame({
        'timestamp': timestamps,
        'cpu_usage': np.round(cpu_usage, 2),
        'gpu_usage': np.round(gpu_usage, 2),
        'ram_usage': np.round(ram_usage, 2),
        'temperature': np.round(temperature, 2),
        'battery_level': np.round(battery, 2),
        'fps': np.round(fps, 1),
        'network_usage': np.round(network, 2),
        'background_processes': background.astype(int),
        'app_usage': scenarios,
        'performance_mode': np.random.choice(
            ['performance', 'balanced', 'smart_ai'],
            size=n_samples,
            p=[0.2, 0.3, 0.5]
        ),
        'overheating_risk': overheating_risk,
        'fps_drop_risk': fps_drop_risk,
        'battery_drain_risk': battery_drain_risk,
        'performance_degradation': performance_degradation
    })
    
    return df


if __name__ == '__main__':
    print("Generating synthetic telemetry data...")
    df = generate_realistic_telemetry(50000)
    
    output_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_telemetry.csv')
    df.to_csv(output_path, index=False)
    
    print(f"Generated {len(df)} samples -> {output_path}")
    print(f"\nClass distribution:")
    print(f"  Overheating risk: {df['overheating_risk'].mean():.2%}")
    print(f"  FPS drop risk: {df['fps_drop_risk'].mean():.2%}")
    print(f"  Battery drain risk: {df['battery_drain_risk'].mean():.2%}")
    print(f"  Performance degradation: {df['performance_degradation'].mean():.2%}")
    print(f"\nMetric ranges:")
    print(df.describe().round(2))
