# Vercel Deployment Configuration

This document outlines the environment variables and configuration needed to deploy SCCK ERP NEXUS to Vercel.

## Environment Variables for Vercel

Set the following environment variables in your Vercel project dashboard:

### Security Configuration
```
JWT_SECRET=<generate-with: openssl rand -base64 32>
SESSION_SECRET=<generate-with: openssl rand -base64 32>
```

### Server Configuration
```
NODE_ENV=production
PORT=3000
```

### Database Configuration
```
DB_PATH=/tmp/scck_erp.db
```
**Note:** Vercel's serverless functions have a `/tmp` directory for temporary storage. This is suitable for read-heavy operations but not recommended for persistent production data. Consider using PostgreSQL or MongoDB for production.

### CORS Configuration
```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```
Update with your actual domain(s). Do NOT use localhost or http:// in production.

### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### File Upload
```
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/tmp/uploads
```
**Note:** Use a cloud storage service like AWS S3, Azure Blob, or Cloudinary for persistent file storage.

### Logging
```
LOG_LEVEL=info
```

### Email Configuration (Optional)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose `diawtrading/Scck-Nexus`
5. Click "Import"

### 3. Configure Environment Variables
1. In Vercel dashboard, go to Settings → Environment Variables
2. Add all variables from the section above
3. Generate secure values for JWT_SECRET and SESSION_SECRET:
   ```bash
   openssl rand -base64 32
   ```

### 4. Configure Build Settings
- **Build Command:** `npm run vercel-build`
- **Output Directory:** (leave blank - auto-detected)
- **Install Command:** `npm ci`

### 5. Deploy
Click "Deploy" button in Vercel dashboard.

## Important Notes

### Database Considerations
- SQLite on Vercel is limited to `/tmp` which is ephemeral (resets on redeploy)
- For production, migrate to PostgreSQL using:
  - Vercel Postgres
  - AWS RDS
  - Digital Ocean Managed Databases
  - Railway.app

### File Storage
- Implement cloud storage for uploads:
  - AWS S3
  - Cloudinary
  - Azure Blob Storage
  - Digital Ocean Spaces

### Monitoring
- Add error tracking: Sentry, DataDog, or similar
- Setup uptime monitoring
- Configure alerts for critical errors

### Custom Domain
1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Update DNS records according to Vercel's instructions
4. Update ALLOWED_ORIGINS environment variable

## Testing Deployment

After deployment, test critical endpoints:
```bash
curl https://your-domain.com/api/health
curl https://your-domain.com/api/auth/login -X POST -H "Content-Type: application/json"
```

## Troubleshooting

### 502 Bad Gateway
- Check Vercel function logs
- Verify all required environment variables are set
- Check database connectivity

### Database Connection Issues
- Verify DB_PATH is set correctly
- For PostgreSQL, check connection string format
- Test connection locally before deploying

### JWT Token Errors
- Ensure JWT_SECRET is set and consistent
- Check token expiration (24h default)
- Regenerate if needed

## Support

For issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com)
- [Better SQLite3 Docs](https://github.com/WiseLibs/better-sqlite3)