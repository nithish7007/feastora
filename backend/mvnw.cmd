@echo off
set "DIR=%~dp0"
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Java\jdk-25.0.5.0.3" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-25.0.5.0.3"
    )
)
"%DIR%..\tools\apache-maven-3.9.9\bin\mvn.cmd" %*
