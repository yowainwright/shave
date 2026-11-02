import { readFileSync } from 'node:fs'
import { defineConfig, type OutputOptions, type RolldownOptions } from 'rolldown'

type Library = 'shave' | 'jquery.shave'
type Format = 'es' | 'cjs' | 'iife'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
const { author, license, name, version } = packageJson
const authorName = author.split('<')[0].trim()
const banner = `/*! ${name}@${version} ${authorName} (${license}) */\n`
const shaveFooter = `((entry) => {
if (typeof module !== 'undefined' && module.exports) {
  module.exports = entry;
} else if (typeof define === 'function' && define.amd) {
  define([], () => entry);
} else {
  window.shave = entry;
}
})(shave.default || shave);`
const extensions = { es: 'mjs', cjs: 'cjs', iife: 'global.js' }
const formats: Format[] = ['es', 'cjs', 'iife']
const libraries: Library[] = ['shave', 'jquery.shave']

const configs = libraries.map(createLibrary)

export default defineConfig(configs)

function createLibrary(library: Library): RolldownOptions {
  const input = `src/${library}.ts`
  const output = formats.map((format) => createOutput(library, format))
  const transform = { target: 'es2015' }
  const config = { input, output, transform }
  return config
}

function createOutput(library: Library, format: Format): OutputOptions {
  const globalName = library === 'shave' ? 'shave' : 'jqueryShave'
  const extension = extensions[format]
  const file = `dist/${library}.${extension}`
  const needsFooter = format === 'iife' && library === 'shave'
  const footer = needsFooter ? shaveFooter : ''
  const exportsMode = library === 'shave' ? 'named' : 'none'
  const output: OutputOptions = {
    file,
    format,
    name: globalName,
    postBanner: banner,
    footer,
    sourcemap: 'hidden',
    minify: true,
    exports: exportsMode,
  }
  return output
}
