const fs = require('fs');
const path = require('path');

console.log('Testing IIFE/browser build...');

// Read the IIFE build
const iifeContent = fs.readFileSync(path.join(__dirname, '../../dist/shave.global.js'), 'utf8');

// Simple check that the global variable is being set
if (!iifeContent.includes('window.shave')) {
  console.error('❌ IIFE build does not set window.shave global');
  process.exit(1);
}

// Check that it handles module.exports
if (!iifeContent.includes('module.exports')) {
  console.error('❌ IIFE build does not handle module.exports');
  process.exit(1);
}

// Check that it handles AMD
if (!iifeContent.includes('define.amd')) {
  console.error('❌ IIFE build does not handle AMD');
  process.exit(1);
}

console.log('✅ IIFE import test passed');