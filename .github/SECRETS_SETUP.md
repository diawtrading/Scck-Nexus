# GitHub Actions Secrets Configuration

To deploy to Vercel automatically, add these three secrets to your repository:

## Required Secrets

### 1. VERCEL_TOKEN
- Get from: https://vercel.com/account/tokens
- Click "Create Token" and copy the value

### 2. VERCEL_ORG_ID  
- Get from: https://vercel.com/dashboard
- Click profile → Team Settings → General
- Copy the Team ID

### 3. VERCEL_PROJECT_ID
- Get from: https://vercel.com/dashboard
- Select your project → Settings → General
- Copy the Project ID

## How to Add Secrets

1. Go to: https://github.com/diawtrading/Scck-Nexus/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret value

## After Configuration

Push to `main` branch to trigger automatic deployment to Vercel!
