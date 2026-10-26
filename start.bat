@echo off
title EventGenie AI Launcher
echo =======================================================
echo    EventGenie AI - Launching Local Server
echo =======================================================
echo Opening application in default browser...
start http://localhost:3000
echo.
echo Starting Python server on port 3000...
python server.py
pause
