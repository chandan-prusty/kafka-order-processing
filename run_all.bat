@echo off
title Kafka Order Processing - Runner
echo ===============================================================================
echo Starting Real-Time Order Processing System using Apache Kafka
echo ===============================================================================
echo 1. Launching Backend (Spring Boot on port 8080)...
start "Kafka Backend" cmd /k "run_backend.bat"
timeout /t 6 /nobreak >nul
echo 2. Launching Frontend (React on port 5173)...
start "Kafka Frontend" cmd /k "run_frontend.bat"
echo ===============================================================================
echo Both Backend and Frontend have been launched!
echo Open http://localhost:5173 in your browser.
echo ===============================================================================
