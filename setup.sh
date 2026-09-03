#!/bin/bash
set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  iQOO Adaptive Performance Intelligence — Setup"
echo "═══════════════════════════════════════════════════════════════"

# ── Backend ──────────────────────────────────────────────────────────
echo ""
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
echo "✓ Backend dependencies installed"

# ── ML Training ──────────────────────────────────────────────────────
echo ""
echo "🧠 Training ML models..."
cd ../ml
python train.py
echo "✓ ML models trained"

# ── Frontend ─────────────────────────────────────────────────────────
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✓ Frontend dependencies installed"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  To run the project, open two terminals:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && python main.py"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Then open http://localhost:5173"
echo ""
