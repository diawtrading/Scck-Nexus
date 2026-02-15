class DatabaseFactory {
    static create() {
        if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase')) {
            console.log('Using Supabase database...');
            const SupabaseDatabase = require('./supabase');
            return new SupabaseDatabase();
        } else if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            console.log('Using Supabase database...');
            const SupabaseDatabase = require('./supabase');
            return new SupabaseDatabase();
        } else {
            console.log('Using SQLite database...');
            const SQLiteDatabase = require('./database');
            return new SQLiteDatabase();
        }
    }
}

module.exports = DatabaseFactory;
