# iQOO Adaptive Performance Intelligence v2.0 — Run Doc

## How to reproduce artifacts

1. **Install Python dependencies** (from project root):
   ```
   cd backend && pip install -r requirements.txt
   ```

2. **Install frontend dependencies** (from project root):
   ```
   cd frontend && npm install
   ```

3. **Generate ML training data** (if `data/sample_telemetry.csv` is missing):
   ```
   cd ml && python data_generator.py
   ```

4. **Train ML models** (if `backend/models/prediction_models.pkl` is missing):
   ```
   cd ml && python train.py
   ```

## How to run the server

### Backend (FastAPI, port 8000):
```
cd backend && python main.py
```

### Frontend (Vite dev server, port 5173):
```
cd frontend && npm run dev
```

Open http://localhost:5173 in a browser.

## Architecture

- **Backend**: Python FastAPI server with WebSocket + REST APIs
  - `backend/simulator.py` — Real-time device telemetry simulator with 8 demo scenarios
  - `backend/main.py` — FastAPI server with all API endpoints
  - `backend/models/` — Trained ML models (Random Forest/Gradient Boosting)

- **Frontend**: React + Vite + Recharts
  - `frontend/src/components/` — 19 React components
  - `frontend/src/hooks/useWebSocket.js` — WebSocket with REST polling fallback
  - `frontend/src/styles/globals.css` — Dark futuristic iQOO-inspired theme

- **ML Pipeline**: Scikit-learn
  - `ml/data_generator.py` — Generates 50K telemetry samples
  - `ml/train.py` — Trains 4 prediction models with full evaluation

## Demo Mode

Demo mode is ON by default and cycles through:
idle → gaming → thermal_stress → idle → battery_drain → idle → ram_pressure → idle → heavy_load → idle

Use the header buttons to Skip, Toggle Demo, Toggle AI, Reset, or switch Performance Modes.
