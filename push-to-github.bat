@echo off
chcp 65001 >nul
echo ==========================================
echo SCCK ERP NEXUS - Git Push Script
echo ==========================================
echo.

cd /d "C:\Users\hp\Downloads\SCCK_ERP_NEXUS"

echo Checking if git repository exists...
if not exist .git (
    echo Initializing git repository...
    git init
) else (
    echo Git repository already initialized.
)

echo.
echo Configuring git user (if not already set)...
git config user.name "SCCK Developer"
git config user.email "dev@scck.com"

echo.
echo Checking remote origin...
git remote -v >nul 2>&1
if errorlevel 1 (
    echo Adding remote origin...
    git remote add origin https://github.com/alidxb1988/Scck-Nexus.git
) else (
    echo Remote origin already exists.
)

echo.
echo Adding all files to staging...
git add .

echo.
echo Committing changes...
git commit -m "Initial commit: SCCK ERP NEXUS complete codebase with AGENTS.md and deployment readiness tools"

echo.
echo Setting branch to main...
git branch -M main

echo.
echo ==========================================
echo Pushing to GitHub...
echo ==========================================
echo.
echo NOTE: You will be prompted for authentication.
echo Use your GitHub username and Personal Access Token (not password!)
echo.
echo To create a token:
echo 1. Go to https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Select "repo" scope
echo 4. Generate and copy the token
echo 5. Use it as your password when prompted
echo.

git push -u origin main

echo.
if errorlevel 1 (
    echo.
    echo ==========================================
    echo ERROR: Push failed!
    echo ==========================================
    echo Please check the error message above.
    echo Common issues:
    echo - Git not installed (download from git-scm.com)
    echo - Authentication failed (use Personal Access Token)
    echo - Repository doesn't exist on GitHub
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ==========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ==========================================
    echo Repository: https://github.com/alidxb1988/Scck-Nexus
    echo.
    pause
)
