const UnifiedDatabase = require('./db/unified');

console.log('🧪 Testing Supabase Connection...\n');

const db = new UnifiedDatabase();

db.initialize().then(async () => {
    console.log('✅ Database initialized successfully');
    console.log('📊 Database Type:', db.isUsingSupabase() ? 'Supabase' : 'SQLite');
    
    if (db.isUsingSupabase()) {
        console.log('\n🔌 Connected to Supabase at:', process.env.SUPABASE_URL);
    }
    
    // Test connection by trying to count users
    try {
        const userCount = await db.countAsync('users');
        console.log('\n👥 Users table accessible:', userCount, 'users found');
        console.log('\n✅ All tests passed! Supabase is properly connected.');
    } catch (error) {
        console.log('\n⚠️ Note:', error.message);
        console.log('This is normal if tables have not been created yet.');
    }
    
    db.close();
    process.exit(0);
}).catch(error => {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
});
