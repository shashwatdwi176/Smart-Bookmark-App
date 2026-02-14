const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const content = fs.readFileSync(envPath, 'utf8');

console.log('--- RAW CONTENT START ---');
console.log(content);
console.log('--- RAW CONTENT END ---');

const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
        const parts = line.split('=');
        if (parts.length > 1) {
            const key = parts[1];
            console.log(`\nLine ${index + 1} Key Analysis:`);
            console.log(`Value: "${key}"`);
            console.log(`Length: ${key.length}`);
            console.log('Character Codes:');
            for (let i = 0; i < key.length; i++) {
                process.stdout.write(`${key.charCodeAt(i)} `);
            }
            console.log('\n');

            if (key.trim().length !== key.length) {
                console.log('⚠️ WARNING: Key has leading/trailing whitespace!');
            }
        }
    }
});
