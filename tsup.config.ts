import { defineConfig } from 'tsup'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const { author, description, homepage, license, name, version } = pkg

const banner = `/**
  ${name} - ${description}
  @version v${version}
  @link ${homepage}
  @author ${author}
  @license ${license}
**/`

export default defineConfig([
  // Main shave library
  {
    entry: ['src/shave.ts'],
    format: ['esm', 'cjs', 'iife'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: true,
    banner: {
      js: banner
    },
    outExtension({ format }) {
      if (format === 'esm') return { js: '.mjs' }
      if (format === 'cjs') return { js: '.js' }
      if (format === 'iife') return { js: '.global.js' }
      return { js: '.js' }
    },
    globalName: 'shave',
    // For IIFE/UMD builds, we want to export the function directly
    footer({ format }) {
      if (format === 'iife') {
        return {
          js: `if (typeof module !== 'undefined' && module.exports) {
  module.exports = shave.default || shave;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return shave.default || shave; });
} else {
  window.shave = shave.default || shave;
}`
        }
      }
      return {}
    }
  },
  // jQuery plugin
  {
    entry: ['src/jquery.shave.ts'],
    format: ['esm', 'cjs', 'iife'],
    dts: true,
    splitting: false,
    sourcemap: true,
    minify: true,
    banner: {
      js: banner
    },
    outExtension({ format }) {
      if (format === 'esm') return { js: '.mjs' }
      if (format === 'cjs') return { js: '.js' }
      if (format === 'iife') return { js: '.global.js' }
      return { js: '.js' }
    },
    external: ['shave'],
    globalName: 'jqueryShave',
    // Make sure jQuery plugin works in global context
    footer({ format }) {
      if (format === 'iife') {
        return {
          js: `// Auto-initialize jQuery plugin if jQuery is available
if (typeof jQuery !== 'undefined' || typeof $ !== 'undefined') {
  const jq = jQuery || $;
  if (jq && jq.fn && !jq.fn.shave) {
    jqueryShave.default && jqueryShave.default(jq);
  }
}`
        }
      }
      return {}
    }
  }
])