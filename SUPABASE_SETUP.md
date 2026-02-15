# Supabase Connection Setup

## Configuration

Your ERP system is now configured to connect to Supabase. The connection details are stored in the `.env` file:

```env
DB_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

**Configure with your Supabase credentials from Project Settings > API**

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file has been created with your Supabase credentials. Verify the settings:

```bash
# Check .env file
cat .env
```

### 3. Create Database Schema

Run the schema creation script in your Supabase SQL Editor:

1. Go to: https://app.supabase.com/project/wjxqtkvpcdeynmfnlfox
2. Navigate to: SQL Editor > New query
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run"

### 4. Test Connection

```bash
node test-supabase.js
```

Expected output:
```
🧪 Testing Supabase Connection...

✅ Database initialized successfully
📊 Database Type: Supabase

🔌 Connected to Supabase at: https://wjxqtkvpcdeynmfnlfox.supabase.co

👥 Users table accessible: 0 users found

✅ All tests passed! Supabase is properly connected.
```

### 5. Start the Server

```bash
npm start
```

Or for development:
```bash
npm run dev
```

## Features

✅ **Dual Database Support**: Automatically switches between SQLite (local) and Supabase (cloud)
✅ **Unified API**: Same code works with both databases
✅ **Async Operations**: Full support for Supabase async queries
✅ **Automatic Fallback**: Falls back to SQLite if Supabase is unavailable

## Database Schema

The following tables will be created in Supabase:

- `users` - System users and authentication
- `producers` - Cocoa producer records
- `collections` - Cocoa collection data
- `transactions` - Financial transactions
- `inventory` - Stock management
- `employees` - HR records
- `customers` - Buyer information
- `suppliers` - Vendor information
- `projects` - Project management

## API Usage

The unified database adapter provides these methods:

```javascript
// Insert data
await db.runAsync('table_name', { field: 'value' });

// Get single record
const record = await db.getAsync('table_name', { id: '123' });

// Get all records
const records = await db.allAsync('table_name', { status: 'active' });

// Update record
await db.updateAsync('table_name', '123', { field: 'new_value' });

// Delete record
await db.deleteAsync('table_name', '123');

// Count records
const count = await db.countAsync('table_name', { status: 'active' });
```

## Switching Back to SQLite

To use SQLite instead of Supabase, update your `.env` file:

```env
DB_TYPE=sqlite
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
```

## Troubleshooting

### Connection Issues

If you see "Supabase credentials not found":
- Verify your `.env` file exists
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are set
- Ensure there are no extra spaces or quotes

### Permission Errors

If you get "Permission denied" errors:
- Make sure you're using the correct API key (anon_key for client, service_key for admin)
- Check RLS (Row Level Security) policies in Supabase

### Missing Tables

If tables don't exist:
- Run the schema.sql script in Supabase SQL Editor
- Check for any SQL errors in the output

## Security Notes

⚠️ **Important**: 
- Never commit the `.env` file to version control
- Keep your Supabase keys secure
- Use environment variables in production
- Enable RLS policies for production use

## Support

For issues with the Supabase connection:
1. Check Supabase status: https://status.supabase.com
2. Review Supabase logs in the dashboard
3. Verify network connectivity
4. Check API rate limits
