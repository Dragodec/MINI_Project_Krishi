@echo off
title AgriAI Dev Stopper

echo ===============================
echo Stopping AgriAI Dev Servers
echo ===============================

:: Kill Node (Frontend + Backend)
taskkill /F /IM node.exe >nul 2>&1

:: Kill Python (AI Simulation)
taskkill /F /IM python.exe >nul 2>&1

:: Kill any leftover cmd windows (optional but aggressive)
taskkill /F /IM cmd.exe >nul 2>&1

echo All services stopped.
echo ===============================
pause