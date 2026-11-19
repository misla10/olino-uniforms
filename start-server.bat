@echo off
title Olino Uniforms Website Server
echo ========================================================
echo   Launching Olino Uniforms Luxury Homepage...
echo ========================================================
echo.
echo Opening website in your default browser at http://localhost:8000
start http://localhost:8000
echo Server is running. Press Ctrl+C in this window to stop.
echo.
python -m http.server 8000
pause
