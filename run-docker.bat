@echo off
cd /d "%~dp0"
echo ======================================================
echo   Starting AI Prompt & Tool Hub via Docker Compose...
echo   Open in browser: http://localhost:3000
echo   To stop container: press Ctrl + C
echo ======================================================
docker compose up --build
pause
