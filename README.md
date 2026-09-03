# iQOO Adaptive Performance Intelligence

> **AI-Powered Predictive Smartphone Performance System**

A real-time predictive intelligence system that continuously monitors device behavior, predicts potential performance issues before they occur, and proactively optimizes system resources to prevent them.

## 🎯 Core Innovation

```
Traditional System: Problem → Detect → React
Our System:         Monitor → Predict → Prevent → Optimize
```

## 📦 Architecture

```
Device Metrics → Data Collection → Feature Extraction → AI Prediction Engine
    → Risk Assessment → Adaptive Decision Engine → Optimization Recommendation
    → Performance Monitoring → Feedback Loop
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| ML Engine | Python, Scikit-learn, Pandas, NumPy |
| Backend API | FastAPI, WebSocket, Uvicorn |
| Frontend | React 18, Recharts, Vite |
| Models | Gradient Boosting Classifiers |

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm

### 1. Set Up Backend

```bash
cd backend
pip install -r requirements.txt

# Train ML models (generates sample data too)
cd ../ml
python train.py
cd ../backend
```

### 2. Start Backend

```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Open the Dashboard

Navigate to **http://localhost:5173** in your browser.

The demo mode runs automatically, showing:
1. 🟢 **Idle State** — Normal device metrics
2. 🎮 **Gaming Load** — CPU/GPU ramp up with rising temperature
3. 🔥 **Thermal Stress** — AI predicts overheating before it happens
4. ⚡ **AI Optimization** — Automatic preventive action taken
5. ✅ **Stable Performance** — System recovered without user intervention

## 📊 Features

### Real-Time Monitoring
- CPU, GPU, RAM usage with trend charts
- Temperature monitoring with thermal gauge
- Battery intelligence with drain prediction
- FPS tracking with degradation alerts
- Background process monitoring

### AI Prediction Engine
- Overheating risk prediction
- FPS drop risk assessment
- Battery drain forecasting
- RAM pressure analysis
- Performance degradation scoring

### AI Explanations
Every prediction includes a human-readable explanation of *why* the AI made that prediction:

> "CPU utilization has been above 80% while device temperature is 42.3°C and rising."

### Adaptive Optimization
When risks exceed thresholds, the system automatically:
- Reduces CPU/GPU frequency (thermal throttling)
- Kills unnecessary background processes
- Reallocates GPU priority to active apps
- Clears memory cache
- Switches performance modes

### Three Performance Modes
- **Performance Mode** — Maximum CPU/GPU allocation for gaming
- **Balanced Mode** — Even power distribution for general use
- **Smart AI Mode** (Default) — AI-driven adaptive optimization

## 🗂 Project Structure

```
├── backend/
│   ├── main.py          # FastAPI server with WebSocket + REST
│   ├── simulator.py     # Real-time device telemetry simulator
│   ├── models/          # Trained ML models
│   └── requirements.txt
├── ml/
│   ├── train.py         # ML training pipeline
│   └── data_generator.py # Synthetic telemetry data generator
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/  # Dashboard components
│   │   ├── hooks/       # WebSocket + polling hooks
│   │   └── styles/      # Dark futuristic CSS
│   └── package.json
├── data/                # Generated telemetry datasets
├── docs/                # Documentation
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/current-state` | Current device state + predictions |
| `POST` | `/api/reset` | Reset simulator |
| `POST` | `/api/set-mode?mode=X` | Set performance mode |
| `POST` | `/api/toggle-demo` | Toggle demo mode |
| `POST` | `/api/skip-scenario` | Skip to next demo scenario |
| `GET` | `/api/predict?cpu=X&gpu=Y...` | ML risk prediction |
| `GET` | `/api/training-info` | Model training information |
| `WS` | `/ws/telemetry` | Real-time telemetry stream |

## 🧠 ML Models

Trained using Gradient Boosting Classifiers on synthetic smartphone telemetry:

- **Overheating Risk** — Predicts thermal throttling probability
- **FPS Drop Risk** — Predicts frame rate degradation
- **Battery Drain Risk** — Predicts accelerated battery drain
- **Performance Degradation** — Overall system degradation risk

Features include raw metrics + derived features (CPU/GPU ratio, thermal stress, power draw, load imbalance).

---

**Built for the iQOO Adaptive Performance Intelligence Hackathon** 🏆
