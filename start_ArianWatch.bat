@echo off
title Anime Stram Launcher 🚀
color 0b

set "PROJECT_ROOT=%~dp0"
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"

echo ===================================================
echo       Anime Stram - Anime Streaming Platform
echo           Startup Sequence Initiated
echo ===================================================
echo.
echo Project Root: "%PROJECT_ROOT%"
echo Frontend Dir: "%FRONTEND_DIR%"
echo.

echo [1/3] Backend Server (Port 4000)...
start "Anime Stram Backend" /D "%PROJECT_ROOT%" cmd /k "npm run dev"
echo [OK] Backend signal sent.

echo [2/3] Checking Frontend Dependencies...
cd /d "%FRONTEND_DIR%"
if not exist node_modules (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

echo [3/3] Frontend Client (Port 3000)...
start "Anime Stram Frontend" /D "%FRONTEND_DIR%" cmd /k "npm run dev"
echo [OK] Frontend signal sent.

echo.
echo ===================================================
echo          System Launch Successful!
echo ===================================================
echo.
echo Opening browser in 10 seconds...
timeout /t 10 >nul
start http://localhost:3000

echo.
echo All systems operational.
pause
