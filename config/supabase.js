const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count');
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};
