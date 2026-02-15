# 🚀 Deploy to Vercel via GitHub (Easiest Method)

This guide shows you how to deploy SCCK ERP NEXUS to Vercel using GitHub integration - the **easiest and most automated** method!

## ✅ Why This Method?

- ✨ **Zero CLI installation** - Everything happens in the browser
- 🔄 **Automatic deployments** - Push to GitHub → Auto-deploy to Vercel
- 🌍 **Global CDN** - Instant worldwide distribution
- 💰 **Free forever** - 100GB bandwidth, unlimited projects
- 🔒 **Secure** - No tokens to manage manually

---

## 📋 Prerequisites

- ✅ GitHub repository with your code (already done!)
- ✅ Vercel account (free)
- ✅ 5 minutes of your time

---

## 🚀 Step-by-Step Deployment

### **Step 1: Go to Vercel**

1. Open https://vercel.com
2. Click **"Sign Up"** (use GitHub to sign up)
3. Authorize Vercel to access your GitHub repositories

### **Step 2: Import Your Repository**

1. Click **"Add New Project"**
2. Find and select: `Scck-Nexus`
3. Click **"Import"**

### **Step 3: Configure Project**

Fill in these settings:

```
Project Name: scck-erp-nexus (or your choice)
Framework Preset: Vite
Root Directory: ./
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
Install Command: npm install
```

**Screenshot of settings:**
```
┌─────────────────────────────────────┐
│ ⚙️ Configure Project                │
├─────────────────────────────────────┤
│                                     │
│ Project Name        [scck-erp-nexus]│
│ Framework Preset    [Vite ▼]       │
│ Root Directory      [./]           │
│ Build Command       [cd frontend...]│
│ Output Directory    [frontend/dist] │
│ Install Command     [npm install]   │
│                                     │
│ Environment Variables              │
│ ┌─────────────────────────────────┐│
│ │ VITE_API_URL                   ││
│ │ [https://scck-api.up.railway.app]││
│ └─────────────────────────────────┘│
│                                     │
│ [  Deploy  ]                       │
└─────────────────────────────────────┘
```

### **Step 4: Add Environment Variables**

Click **"Environment Variables"** and add:

**Required:**
```
VITE_API_URL=https://scck-api.up.railway.app
```

**Optional (if you have them):**
```
VITE_APP_NAME=SCCK ERP NEXUS
VITE_APP_VERSION=1.0.0
```

**⚠️ Important:** Replace `https://scck-api.up.railway.app` with your actual Railway backend URL after you deploy the backend!

### **Step 5: Deploy!**

Click **"Deploy"** and wait 2-3 minutes.

Vercel will:
1. ✅ Clone your repository
2. ✅ Install dependencies
3. ✅ Build the frontend
4. ✅ Deploy to global CDN
5. ✅ Provide you with a URL

**Example Output:**
```
🚀 Building...
✅ Build successful
🌍 Deploying...
✅ Deployed!

🎉 Your site is live at:
https://scck-erp-nexus.vercel.app
```

---

## 🔄 Automatic Deployments

Once connected, every time you push to GitHub:

```bash
git add .
git commit -m "Update dashboard design"
git push origin main
```

Vercel will **automatically**:
- Build the new version
- Deploy it
- Update your site in ~30 seconds

**No manual deployment needed!**

---

## 🌍 Custom Domain (Optional)

### Add Your Own Domain:

1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Enter your domain: `erp.scck.co`
3. Follow DNS instructions
4. SSL certificate is **automatic** (Let's Encrypt)

**Free SSL included!** 🔒

---

## ⚙️ Project Settings Reference

Your `vercel.json` is already configured:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "github": {
    "enabled": true,
    "autoJobCancelation": true
  }
}
```

---

## 🛠️ Troubleshooting

### Build Fails

**Problem:** "Build failed"

**Solution:**
1. Check that `frontend/package.json` exists
2. Verify `vercel.json` has correct paths
3. Check build logs in Vercel dashboard

### API Connection Fails

**Problem:** Frontend can't connect to backend

**Solution:**
1. Update `VITE_API_URL` environment variable
2. Ensure Railway backend is running
3. Add Vercel URL to Railway `ALLOWED_ORIGINS`

### 404 on Page Refresh

**Problem:** Refreshing page shows 404

**Solution:** The `rewrites` in `vercel.json` handles this automatically.

---

## 📊 Monitoring

### View Analytics:

1. Go to Vercel Dashboard
2. Select your project
3. Click **"Analytics"** tab
4. See:
   - Traffic
   - Performance
   - Errors
   - Web Vitals

**All free!** 📈

---

## 🔐 Environment Variables Management

### Update Variables:

1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Edit or add new variables
3. Redeploy (happens automatically)

### Variables for Production:

```
VITE_API_URL=https://scck-api.up.railway.app
NODE_ENV=production
```

### Variables for Preview (optional):

```
VITE_API_URL=https://scck-api-staging.up.railway.app
```

---

## 🎯 Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] Backend deployed (Railway)
- [ ] Supabase tables created
- [ ] Environment variables ready

After deploying:
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Website loads
- [ ] Login works
- [ ] API calls successful
- [ ] All modules functional

---

## 🚀 Quick Commands

If you ever need CLI access:

```bash
# Install Vercel CLI
npm install -g vercel

# Pull environment variables
vercel env pull

# Deploy manually
vercel --prod

# View logs
vercel logs
```

---

## 💡 Pro Tips

1. **Branch Previews:** Every Pull Request gets its own preview URL
2. **Production Branch:** Only `main` branch deploys to production
3. **Instant Rollback:** One click to rollback to previous version
4. **Team Access:** Invite team members in project settings
5. **Notifications:** Enable Slack/email notifications for deployments

---

## 📱 Mobile App

Download Vercel mobile app for:
- Push notifications on deploy
- View logs on the go
- Approve deployments
- Monitor performance

**iOS:** https://apps.apple.com/app/vercel/id1532587480
**Android:** https://play.google.com/store/apps/details?id=com.vercel.app

---

## 🆘 Support

**Vercel Docs:** https://vercel.com/docs
**Status Page:** https://www.vercel-status.com
**Community:** https://github.com/vercel/vercel/discussions

**Issues with this project?**
Create an issue: https://github.com/diawtrading/Scck-Nexus/issues

---

## ✅ Summary

**You need to do:**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import `Scck-Nexus`
4. Set Build Command: `cd frontend && npm install && npm run build`
5. Set Output Directory: `frontend/dist`
6. Add environment variable: `VITE_API_URL`
7. Click "Deploy"

**Time:** 5 minutes  
**Cost:** $0  
**Result:** Production-ready website! 🎉

---

**Ready?** Go to https://vercel.com/new and start deploying! 🚀
