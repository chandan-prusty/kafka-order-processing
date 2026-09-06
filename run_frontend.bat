@echo off
title Kafka Order Processing - React Vite Frontend
echo ================================================================
echo Starting React Vite Frontend (Port 5173)...
echo ================================================================
cd /d "%~dp0frontend"
npm run dev
pause
