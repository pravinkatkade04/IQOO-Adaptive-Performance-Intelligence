"""Combined backend + frontend server for testing the full stack."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend', 'dist')

# Create app and include backend routes
from backend.main import app as backend_app

# Mount static assets from frontend build
if os.path.exists(os.path.join(FRONTEND_DIST, 'assets')):
    backend_app.mount('/assets', StaticFiles(directory=os.path.join(FRONTEND_DIST, 'assets')), name='static-assets')

# Serve index.html for root (SPA fallback)
@backend_app.get('/')
async def serve_root():
    return FileResponse(os.path.join(FRONTEND_DIST, 'index.html'))


if __name__ == '__main__':
    print(f"Serving frontend from: {FRONTEND_DIST}")
    print("Server running on http://127.0.0.1:8000")
    uvicorn.run(backend_app, host='127.0.0.1', port=8000, log_level='info')
