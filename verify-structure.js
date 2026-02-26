// Quick verification script
const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'src/features/auth/context/AuthContext.tsx',
    'src/features/auth/hooks/useAuth.ts',
    'src/features/booking/context/BookingContext.tsx',
    'src/core/navigation/AppNavigator.tsx',
    'src/core/services/mock/mockData.ts',
    'src/shared/constants/constants.ts',
    'App.tsx'
];

console.log('Verifying project structure...\n');

let allGood = true;
requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allGood = false;
});

console.log(allGood ? '\n✅ All required files present!' : '\n❌ Some files are missing!');
process.exit(allGood ? 0 : 1);
