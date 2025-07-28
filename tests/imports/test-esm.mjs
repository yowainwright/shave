import shave from '../../dist/shave.mjs';

console.log('Testing ESM import...');

// Test that shave is imported as a function
if (typeof shave !== 'function') {
  console.error('❌ ESM import failed: shave is not a function, got:', typeof shave);
  process.exit(1);
}

// Test that the function has the expected structure
if (shave.length !== 2) {
  console.error('❌ ESM import failed: shave function should accept 2 required parameters, got:', shave.length);
  process.exit(1);
}

console.log('✅ ESM import test passed');