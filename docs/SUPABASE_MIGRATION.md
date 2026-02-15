# Supabase Migration Guide

## Overview

This guide will help you migrate your SCCK ERP NEXUS application from SQLite to Supabase.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Ensure Node.js is installed (v18 or higher)
3. **Current Data**: Export your current SQLite data (if any)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: `scck-erp-nexus`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Wait for the project to be provisioned (usually 1-2 minutes)

---

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents from `supabase/schema.sql`
3. Paste into the SQL Editor and click **Run**
4. Verify all tables are created in **Table Editor**

---

## Step 3: Get API Credentials

1. Go to **Project Settings** (gear icon) → **API**
2. Copy the following values:
   - **URL**: e.g., `https://xxxxx.supabase.co`
   - **anon public key**: Click to copy

---

## Step 4: Configure Environment Variables

1. Open `.env` file in your project root
2. Add your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Keep your existing settings
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret
```

---

## Step 5: Install Dependencies

```bash
npm install
```

---

## Step 6: Migrate Existing Data (Optional)

If you have existing SQLite data, you can migrate it to Supabase:

1. Export SQLite data to JSON:
```bash
sqlite3 data/scck_erp.db ".mode json" ".all producers"
```

2. Use Supabase's Table Editor or API to import the data
3. Or create a migration script using the Supabase JavaScript client

---

## Step 7: Test the Application

```bash
npm run dev
```

The application will automatically detect Supabase credentials and connect to it.

---

## Features Enabled with Supabase

### 1. Row Level Security (RLS)
- All tables have RLS policies enabled
- Role-based access control is enforced at the database level
- Users can only access data they're authorized to see

### 2. Real-time Subscriptions
You can subscribe to database changes:

```javascript
const subscription = supabase
  .channel('custom-insert-channel')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'producers' }, 
  (payload) => console.log(payload)
  )
  .subscribe()
```

### 3. Storage
File uploads are now supported:

```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-avatar.jpg', file)
```

### 4. Edge Functions
Deploy serverless functions for custom logic.

---

## Switching Back to SQLite

To switch back to SQLite, simply:

1. Remove or comment out the Supabase credentials in `.env`:
```env
# SUPABASE_URL=
# SUPABASE_ANON_KEY=
```

2. Restart the server - it will automatically use SQLite

---

## Troubleshooting

### Connection Issues
- Verify your SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check that your project is not paused (free tier)
- Ensure your IP is not blocked in Supabase settings

### RLS Policy Errors
- Check the **Authentication** → **Policies** section in Supabase dashboard
- Ensure users are properly authenticated
- Test policies with different user roles

### Performance Issues
- Add indexes for frequently queried columns
- Use Supabase's query performance analysis
- Consider enabling connection pooling

---

## Security Considerations

1. **Never expose service role key** in client-side code
2. **Use anon key** for client-side operations
3. **Enable RLS** on all tables
4. **Regularly rotate** JWT secrets
5. **Enable 2FA** on your Supabase account

---

## Next Steps

- Set up **automatic backups** in Supabase dashboard
- Configure **custom domains**
- Enable **SSO** for enterprise authentication
- Set up **webhooks** for external integrations

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Issue Tracker**: Report bugs on GitHub
