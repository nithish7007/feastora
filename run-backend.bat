@echo off
echo =====================================================================
echo  Starting FEASTORA Java Tomcat Backend Server
echo  Project: FEASTORA ("Every Craving Has a Destination.")
echo =====================================================================

cd /d "%~dp0backend"
call mvnw.cmd compile exec:java
pause
