@echo off
echo =====================================================================
echo  FEASTORA Full Stack Food Platform - Launch All
echo  Backend: Java 17/25 + Jakarta EE 10 + Tomcat 10.1+ (Port 8080)
echo  Frontend: React.js + Tailwind CSS + Framer Motion (Port 5173)
echo =====================================================================

start "FEASTORA Java Backend" cmd /c "%~dp0run-backend.bat"
timeout /t 3 /nobreak >nul
start "FEASTORA React Frontend" cmd /c "%~dp0run-frontend.bat"

echo.
echo Both servers initiated!
echo Open your browser at: http://localhost:5173
echo.
