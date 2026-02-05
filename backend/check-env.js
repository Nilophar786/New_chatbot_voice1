import dotenv from 'dotenv';
dotenv.config();

console.log('=== Environment Variables Check ===');
console.log('All environment variables:');
Object.keys(process.env).forEach(key => {
    if (key.includes('GEMINI') || key.includes('API') || key.includes('URL')) {
        console.log(`${key}: ${process.env[key]}`);
    }
});

console.log('\n=== Specific Checks ===');
console.log('GEMINI_API_URL:', process.env.GEMINI_API_URL);
console.log('GEMINI_API_URL exists:', !!process.env.GEMINI_API_URL);
console.log('GEMINI_API_URL length:', process.env.GEMINI_API_URL ? process.env.GEMINI_API_URL.length : 0);

console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
