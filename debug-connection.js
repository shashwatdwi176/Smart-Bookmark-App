const fs = require('fs');
const path = require('path');

async function testConnection() {
    try {
        // Load .env.local manually
        const envPath = path.resolve(__dirname, '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('❌ .env.local not found');
            process.exit(1);
        }

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

        console.log('🔍 Debugging Credentials:');
        console.log(`URL: ${url}`);
        console.log(`Key Prefix: ${key ? key.substring(0, 10) : 'MISSING'}`);
        console.log(`Key Length: ${key ? key.length : 0}`);

        if (!url || !key) {
            console.error('❌ Missing URL or Key');
            return;
        }

        // Test REST API (accessing a public table or just checking 401)
        console.log('\n📡 Testing REST API Connection...');
        const restUrl = `${url}/rest/v1/`;
        const restRes = await fetch(restUrl, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        console.log(`REST Status: ${restRes.status} ${restRes.statusText}`);
        const restText = await restRes.text();
        console.log(`REST Response: ${restText.substring(0, 200)}...`);

        if (restRes.status === 401) {
            console.error('❌ FATAL: API Key is invalid for this REST URL.');
            return;
        }

        // Test Auth API (recover) - just to check if auth endpoint accepts key
        console.log('\n🔐 Testing Auth API Connection...');
        const authUrl = `${url}/auth/v1/health`;
        const authRes = await fetch(authUrl, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        console.log(`Auth Status: ${authRes.status} ${authRes.statusText}`);
        const authText = await authRes.text();
        console.log(`Auth Response: ${authText}`);

    } catch (e) {
        console.error('❌ Script Error:', e);
    }
}

testConnection();
