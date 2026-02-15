# SCCK ERP NEXUS - Complete Deployment Guide

## Architecture (Free Tier)

```
┌─────────────────────────────────────────────────────────────┐
│                    FREE TIER DEPLOYMENT                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────────┐          ┌──────────────────┐        │
│   │   Vercel         │          │   Railway        │        │
│   │   (Frontend)     │──────────│   (Backend)      │        │
│   │   React + Vite   │   API    │   Node.js        │        │
│   │   $0/month       │   Calls  │   Express        │        │
│   │   100GB Bandwidth│          │   $0/month       │        │
│   └──────────────────┘          │   500 hrs/mo     │        │
│           │                     └────────┬─────────┘        │
│           │                              │                   │
│           │                     ┌────────▼─────────┐        │
│           │                     │   Supabase       │        │
│           │                     │   (Database)     │        │
│           │                     │   PostgreSQL     │        │
│           │                     │   $0/month       │        │
│           │                     │   500MB Storage  │        │
│           │                     └──────────────────┘        │
│           │                                                  │
│   SSL/HTTPS│                    SSL/HTTPS                   │
│   ┌───────▼───────────────────────────────────────┐        │
│   │   Custom Domain (optional)                     │        │
│   │   erp.scck.co                                 │        │
│   └────────────────────────────────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Total Cost: $0/month

---

## Step 1: Deploy Backend to Railway

### 1.1 Sign up for Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Verify email

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `Scck-Nexus` repository
4. Railway will auto-detect Node.js

### 1.3 Configure Environment Variables
Go to Project Settings → Variables and add:

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
ALLOWED_ORIGINS=https://scck-erp.vercel.app,https://scck-erp-git-main-diawtradings-projects.vercel.app
CORS_ENABLED=true
```

**Your Supabase Credentials:** (Add these to your .env file from your Supabase dashboard)

**Important:** Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Deploy
1. Railway will auto-deploy
2. Wait for build to complete
3. Note your Railway domain: `https://scck-api.up.railway.app`
4. Test: Visit `https://scck-api.up.railway.app/api/health`

---

## Step 2: Setup Supabase Database

### 2.1 Run Schema
1. Go to https://app.supabase.com/project/wjxqtkvpcdeynmfnlfox
2. Navigate to SQL Editor → New query
3. Open `supabase/schema.sql` from your repo
4. Copy entire content
5. Paste into SQL Editor
6. Click "Run"
7. Wait for completion

### 2.2 Verify Tables
1. Go to Table Editor
2. Verify all tables created:
   - users
   - producers
   - collections
   - transactions
   - inventory
   - employees
   - customers
   - suppliers
   - projects
   - audit_logs

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign up for Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Verify email

### 3.2 Import Repository
1. Click "Add New Project"
2. Import `Scck-Nexus` from GitHub
3. Select the repository

### 3.3 Configure Build Settings

**Framework Preset:** Vite

**Build and Output Settings:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`
- Root Directory: `./`

### 3.4 Configure Environment Variables

Add these variables:

```env
VITE_API_URL=https://scck-api.up.railway.app
```

Replace the URL with your actual Railway backend URL.

### 3.5 Deploy
1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Vercel will provide a domain: `https://scck-erp.vercel.app`

---

## Step 4: Update CORS and Security

### 4.1 Update Railway Environment
1. Go back to Railway dashboard
2. Add Vercel domain to ALLOWED_ORIGINS:

```env
ALLOWED_ORIGINS=https://scck-erp.vercel.app,https://scck-erp-git-main-diawtradings-projects.vercel.app
```

3. Redeploy Railway service

### 4.2 Verify Connection
1. Open your Vercel frontend
2. Try logging in with demo account
3. Check browser console for errors

---

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain to Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Click "Settings" → "Domains"
4. Add your domain: `erp.scck.co`
5. Follow DNS configuration instructions

### 5.2 Update Railway CORS
1. Add your custom domain to ALLOWED_ORIGINS:

```env
ALLOWED_ORIGINS=https://scck-erp.vercel.app,https://erp.scck.co
```

---

## Deployment Checklist

### Before Deployment
- [ ] All code committed to GitHub
- [ ] Supabase tables created
- [ ] JWT_SECRET generated (minimum 32 characters)
- [ ] Environment variables prepared

### Railway Deployment
- [ ] Railway account created
- [ ] Project connected to GitHub
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health check endpoint responding

### Vercel Deployment
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Frontend deployed successfully

### Post-Deployment
- [ ] Test login functionality
- [ ] Verify all API endpoints
- [ ] Test CRUD operations
- [ ] Check file uploads (if applicable)
- [ ] Verify mobile responsiveness
- [ ] Test on different browsers

---

## Troubleshooting

### Railway Issues

**Issue: Service won't start**
```bash
# Check logs in Railway dashboard
# Ensure NODE_ENV=production
# Verify all environment variables set
```

**Issue: Database connection failed**
- Verify Supabase credentials
- Check if Supabase project is active
- Ensure database tables created

### Vercel Issues

**Issue: Build fails**
```bash
# Check build logs
# Ensure frontend/package.json exists
# Verify all dependencies installed
```

**Issue: API calls failing (CORS)**
- Update ALLOWED_ORIGINS in Railway
- Include both Vercel production and preview URLs
- Redeploy Railway service

**Issue: 404 on page refresh**
- Vercel rewrites configured in vercel.json
- Ensure SPA fallback is working

### General Issues

**Issue: Login not working**
- Check JWT_SECRET is set
- Verify Supabase users table has admin user
- Check browser console for errors

**Issue: Data not loading**
- Verify API_URL environment variable
- Check network tab in DevTools
- Ensure Railway service is running

---

## Free Tier Limits

### Railway (Free)
- **Hours:** 500 hours/month (~21 days continuous)
- **RAM:** 512MB
- **CPU:** Shared
- **Disk:** 1GB
- **Bandwidth:** 100GB/month

**Optimization:**
- Service sleeps after 5 minutes of inactivity
- First request after sleep takes 10-30 seconds (cold start)
- Upgrade to $5/month for always-on

### Vercel (Hobby)
- **Bandwidth:** 100GB/month
- **Builds:** 6000 minutes/month
- **Functions:** 100GB-hours/month
- **Team Members:** 1

### Supabase (Free)
- **Database:** 500MB
- **Bandwidth:** 2GB/month
- **Auth:** 50,000 users/month
- **Storage:** 1GB
- **Edge Functions:** 500K invocations/month

---

## Scaling Beyond Free Tier

### When to Upgrade

**Railway:**
- Need 24/7 uptime ($5/month)
- More RAM ($5-20/month)
- More storage ($0.15/GB/month)

**Vercel:**
- More bandwidth ($20/month Pro)
- More team members
- Priority support

**Supabase:**
- More storage ($25/month Pro)
- More bandwidth
- Advanced features

---

## Monitoring & Maintenance

### Railway Monitoring
- Dashboard shows CPU, RAM, Disk usage
- Logs available in real-time
- Set up alerts (Pro feature)

### Vercel Analytics
- Real User Monitoring (RUM)
- Web Vitals tracking
- Error tracking

### Supabase Monitoring
- Database performance metrics
- API usage stats
- Realtime connections

---

## Security Best Practices

### Environment Variables
- ✅ Never commit .env files
- ✅ Use strong JWT_SECRET
- ✅ Rotate keys regularly
- ✅ Use service role key only on backend

### Database Security
- ✅ RLS policies enabled
- ✅ Use anon key for client-side
- ✅ Validate all inputs
- ✅ Sanitize user data

### Application Security
- ✅ HTTPS only
- ✅ Secure cookies
- ✅ Rate limiting enabled
- ✅ CORS configured properly

---

## Backup Strategy

### Database Backups
Supabase free tier includes daily backups.

### Manual Backup
```bash
# Export database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Import database
psql $DATABASE_URL < backup_20240215.sql
```

### Code Backups
- GitHub repository (automatic)
- Regular commits
- Branch protection (recommended)

---

## Quick Commands

### Test Backend
```bash
curl https://scck-api.up.railway.app/api/health
```

### Test Frontend
```bash
# Should redirect to Vercel
curl -I https://scck-erp.vercel.app
```

### Check Logs
```bash
# Railway
railway logs

# Vercel
vercel logs
```

---

## Support & Resources

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Vercel
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Status: https://www.vercel-status.com

### Supabase
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Status: https://status.supabase.com

---

**Questions? Issues?**

Create an issue on GitHub: https://github.com/diawtrading/Scck-Nexus/issues

---

## Deployment Timeline

| Step | Duration | Cost |
|------|----------|------|
| Railway Setup | 10 min | $0 |
| Supabase Setup | 10 min | $0 |
| Vercel Setup | 10 min | $0 |
| Testing | 15 min | $0 |
| **Total** | **45 min** | **$0** |

---

**Ready to deploy? Start with Step 1!**
