@echo off
title AgriAI Dev Launcher

echo ===============================
echo Starting AgriAI Dev Servers
echo ===============================

:: ---- FRONTEND ----
echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

:: ---- BACKEND ----
echo Starting Backend...
start cmd /k "cd backend && node server.js"

:: ---- AI SIMULATION ----
echo Starting AI Simulation...
start cmd /k "cd ai_simulation && call venv\Scripts\activate && python main.py"

echo ===============================
echo All services launched
echo ===============================
pause