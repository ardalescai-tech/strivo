@echo off
start cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 4 /nobreak
start cmd /k "cd /d %~dp0 && npm run electron"