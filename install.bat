@echo off
REM ╔══════════════════════════════════════════════════════════════╗
REM ║   MUSE Customer Bot - Windows One-Click Setup                 ║
REM ╚══════════════════════════════════════════════════════════════╝

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   🤖 MUSE Customer Bot - Auto Setup                         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo [1/3] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found

REM Install dependencies
echo [2/3] Installing dependencies...
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Create .env if not exists
echo [3/3] Setting up configuration...
if not exist .env (
    (
        echo # MUSE Customer Bot Configuration
        echo # AI Provider: 'demo' ^| 'openai' ^| 'huggingface' ^| 'cloudflare'
        echo AI_PROVIDER=demo
        echo.
        echo # OpenAI ^(optional - for production^)
        echo # OPENAI_API_KEY=sk-your-key-here
        echo.
        echo # Hugging Face ^(free alternative^)
        echo # HF_API_KEY=hf_your-key-here
        echo.
        echo # Server
        echo PORT=3000
    ) > .env
    echo ✓ Configuration file created
) else (
    echo ⚠ .env already exists, skipping
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   ✅ Setup Complete!                                         ║
echo ║                                                              ║
echo ║   To start: npm start                                        ║
echo ║   Open: http://localhost:3000                               ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

set /p START="Start server now? (y/n): "
if /i "%START%"=="y" (
    npm start
)

pause
