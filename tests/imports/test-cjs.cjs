const shave = require('../../dist/shave.cjs');

console.log('Testing CommonJS require...');

// Test that shave is imported correctly
const shaveFunction = shave.default || shave;

if (typeof shaveFunction !== 'function') {
  console.error('❌ CJS import failed: shave is not a function, got:', typeof shaveFunction);
  console.error('Imported object:', shave);
  process.exit(1);
}

// Test that the function has the expected structure
if (shaveFunction.length !== 2) {
  console.error('❌ CJS import failed: shave function should accept 2 required parameters, got:', shaveFunction.length);
  process.exit(1);
}

console.log('✅ CommonJS import test passed');