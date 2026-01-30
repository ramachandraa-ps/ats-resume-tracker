import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🧪 Starting Authentication Tests...\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, condition) {
    if (condition) {
        tests.passed++;
        tests.results.push(`✅ ${name}`);
    } else {
        tests.failed++;
        tests.results.push(`❌ ${name}`);
    }
}

async function runTests() {
    // Test 1: Check Firebase config exists
    const firebaseConfigPath = path.join(projectRoot, 'firebase.ts');
    test('Firebase config file exists', fs.existsSync(firebaseConfigPath));

    // Test 2: Check AuthContext exists
    const authContextPath = path.join(projectRoot, 'context', 'AuthContext.tsx');
    test('AuthContext file exists', fs.existsSync(authContextPath));

    // Test 3: Check SignIn page exists (Login.tsx)
    const loginPath = path.join(projectRoot, 'components', 'Login.tsx');
    test('Login component exists', fs.existsSync(loginPath));

    // Test 4: Check SignUp page exists (Signup.tsx)
    const signupPath = path.join(projectRoot, 'components', 'Signup.tsx');
    test('Signup component exists', fs.existsSync(signupPath));

    // Test 5: Check ProtectedRoute exists
    const protectedRoutePath = path.join(projectRoot, 'components', 'ProtectedRoute.tsx');
    test('ProtectedRoute component exists', fs.existsSync(protectedRoutePath));

    // Test 6: Check environment variables
    const envPath = path.join(projectRoot, '.env.local');
    test('Environment file exists', fs.existsSync(envPath));

    // Test 7: Verify App.tsx uses Routes
    const appPath = path.join(projectRoot, 'App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    test('App.tsx imports Routes', appContent.includes('Routes') && appContent.includes('react-router-dom'));

    // Print results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    tests.results.forEach(r => console.log(r));
    console.log('================');
    console.log(`Total: ${tests.passed + tests.failed} | Passed: ${tests.passed} | Failed: ${tests.failed}`);

    if (tests.failed > 0) {
        console.log('\n⚠️  Some tests failed. Please fix issues before proceeding.');
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed! Authentication setup is complete.');
    }
}

runTests().catch(console.error);
