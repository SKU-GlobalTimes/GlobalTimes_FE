@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-full-stack-e2e.ps1" -ExternalSmoke %*
