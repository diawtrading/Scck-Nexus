# SCCK ERP NEXUS - Vercel Deployment Guide

## Using Your Vercel Token

Your Vercel token: (Set in VERCEL_TOKEN environment variable)

## Option 1: Deploy from Command Line (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login with Token
```bash
vercel login
# Or use the token directly:
vercel --token YOUR_VERCEL_TOKEN
```

### Step 3: Configure Frontend Environment
Create `frontend/.env`:
```env
VITE_API_URL=https://scck-api.up.railway.app
```

### Step 4: Deploy
```bash
# Navigate to project root
cd SCCK_ERP_NEXUS

# Deploy frontend only
cd frontend
vercel --token YOUR_VERCEL_TOKEN --prod
```

## Option 2: Deploy via GitHub Integration

### Step 1: Connect Vercel to GitHub
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository: `diawtrading/Scck-Nexus`

### Step 2: Configure Build Settings
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 3: Environment Variables
Add to Vercel project settings:
```
VITE_API_URL=https://scck-api.up.railway.app
```

### Step 4: Deploy
Click "Deploy" - Vercel will automatically build and deploy.

## Option 3: Deploy via Vercel REST API

### Using cURL:
```bash
# Create deployment
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "scck-erp-frontend",
    "framework": "vite",
    "rootDirectory": "frontend"
  }'
```

## Post-Deployment Steps

### 1. Get Your Vercel URL
After deployment, you'll get a URL like:
```
https://scck-erp-frontend.vercel.app
```

### 2. Update Railway CORS
Add your Vercel URL to Railway environment variables:
```
ALLOWED_ORIGINS=https://scck-erp-frontend.vercel.app,https://scck-api.up.railway.app
```

### 3. Test the Application
1. Visit your Vercel URL
2. Login with demo credentials
3. Verify all modules work

## Troubleshooting

### Build Fails
```bash
# Check logs
vercel logs --token YOUR_VERCEL_TOKEN
```

### API Connection Issues
1. Verify `VITE_API_URL` is set correctly
2. Check Railway is running
3. Verify CORS settings include Vercel domain

### Domain Already Taken
```bash
# Use custom subdomain
vercel --token YOUR_TOKEN --name scck-erp-prod
```

## Quick Commands

```bash
# Deploy
vercel --token YOUR_VERCEL_TOKEN --prod

# View logs
vercel logs --token YOUR_VERCEL_TOKEN

# List deployments
vercel list --token YOUR_VERCEL_TOKEN

# Remove deployment
vercel remove --token YOUR_VERCEL_TOKEN
```

## Expected Output

```
🔍  Inspect: https://vercel.com/diawtrading/scck-erp-frontend/xxxxx [1s]
✅  Production: https://scck-erp-frontend.vercel.app [copied to clipboard] [2s]
📝  Deployed to production. Run `vercel --prod` to overwrite later (use `--target preview` to avoid this).
```

## Next Steps

1. ✅ Frontend deployed to Vercel
2. ⏳ Deploy backend to Railway
3. ⏳ Setup Supabase tables
4. ⏳ Configure CORS between services
5. ⏳ Test complete application

**Need help?** Check the full deployment guide: `DEPLOYMENT_GUIDE.md`
