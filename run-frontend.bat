@echo off
echo =====================================================================
echo  Starting FEASTORA React Frontend
echo  Vite Dev Server: http://localhost:5173
echo =====================================================================

cd /d "%~dp0frontend"
call npm.cmd run dev
pause
