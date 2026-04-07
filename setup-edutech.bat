@echo off
title EduTech Pro Suite - Professional Installation
echo ########################################################
echo #                                                      #
echo #   EDUTECH PRO SUITE - INITIALIZING MASTER LEDGER    #
echo #                                                      #
echo ########################################################
echo.

:: Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install it to continue.
    pause
    exit /b
)

echo [1/4] Installing Essential Dependencies...
call npm install --silent

echo [2/4] Generating Master Ledger Schema...
call npx prisma generate --schema=server/prisma/schema.prisma

echo [3/4] Synchronizing Database...
call npx prisma db push --schema=server/prisma/schema.prisma --accept-data-loss
call node server/prisma/seed.js

echo [4/4] Building Production Assets...
call npm run web:build

echo.
echo ########################################################
echo #   INSTALLATION SUCCESSFUL: EDU-TECH PRO IS READY     #
echo #   RUN: 'npm run electron:dev' to Launch Desktop OS  #
echo ########################################################
echo.
pause
