const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1]] = match[2].trim();
    }
});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', url);
console.log('Key Length:', key ? key.length : 'MISSING');
console.log('Key Prefix:', key ? key.substring(0, 10) : 'MISSING');

if (!url || !key) {
    console.error('Missing URL or Key');
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    try {
        const { data, error } = await supabase.from('bookmarks').select('*').limit(1);
        if (error) {
            console.error('❌ Database connection failed:', error);
        } else {
            console.log('✅ Database connection successful!');
            console.log('Data sample:', data);
        }

        // Test Auth Config
        const { data: authConfig, error: authError } = await supabase.auth.getSession();
        if (authError) {
            console.error('❌ Auth check failed:', authError);
        } else {
            console.log('✅ Auth client initialized (no session expected):', !!authConfig);
        }

    } catch (e) {
        console.error('❌ Unexpected error:', e);
    }
}

test();
