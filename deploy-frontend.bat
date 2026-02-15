@echo off
chcp 65001 >nul
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   SCCK ERP NEXUS - Vercel Deployment
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Set VERCEL_TOKEN environment variable before running this script

echo Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js found

if not exist "vercel.json" (
    echo ❌ Error: Not in project root directory
    echo Please run this script from SCCK_ERP_NEXUS folder
    pause
    exit /b 1
)

echo ✓ Project directory verified

echo Installing Vercel CLI if needed...
call npm list -g vercel >nul 2>&1
if errorlevel 1 (
    call npm install -g vercel
)

echo ✓ Vercel CLI ready

cd frontend

if not exist ".env" (
    echo Creating .env file...
    echo VITE_API_URL=https://scck-api.up.railway.app > .env
    echo ⚠ Please update VITE_API_URL with your Railway backend URL
)

echo Installing dependencies...
call npm install

echo Building frontend...
call npm run build

echo.
echo Deploying to Vercel...
echo.
call vercel --prod --yes

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   ✅ Deployment Complete!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Next steps:
echo 1. Copy the Vercel URL above
echo 2. Update Railway ALLOWED_ORIGINS with this URL
echo 3. Test the application
echo.
pause
