@echo off
cd /d "%~dp0"
echo ======================================================
echo   Starting AI Prompt & Tool Hub on http://localhost:3000
echo ======================================================
call npm.cmd run dev
pause
