import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
const { author, description, homepage, license, name, version } = packageJson

const banner = `/**
  ${name} - ${description}
  @version v${version}
  @link ${homepage}
  @author ${author}
  @license ${license}
**/`

const shaveFooter = `if (typeof module !== 'undefined' && module.exports) {
  module.exports = shave.default || shave;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return shave.default || shave; });
} else {
  window.shave = shave.default || shave;
}`

function assertSupportedMode(mode: string): void {
  const isSupportedMode = mode === 'jquery' || mode === 'shave'
  if (!isSupportedMode) throw new Error(`Unsupported build mode: ${mode}`)
}

function getExtension(format: string): string {
  if (format === 'es') return 'mjs'
  if (format === 'cjs') return 'cjs'
  if (format === 'iife') return 'global.js'
  throw new Error(`Unsupported build format: ${format}`)
}

function getFooter(fileName: string, isJqueryBuild: boolean): string {
  const isGlobalBuild = fileName.endsWith('.global.js')
  if (!isGlobalBuild || isJqueryBuild) return ''
  return shaveFooter
}

export default defineConfig(({ mode }) => {
  assertSupportedMode(mode)

  const isJqueryBuild = mode === 'jquery'
  const isShaveBuild = mode === 'shave'
  const entry = isJqueryBuild ? 'src/jquery.shave.ts' : 'src/shave.ts'
  const globalName = isJqueryBuild ? 'jqueryShave' : 'shave'
  const fileBaseName = isJqueryBuild ? 'jquery.shave' : 'shave'

  return {
    build: {
      emptyOutDir: isShaveBuild,
      lib: {
        entry,
        fileName(format) {
          const extension = getExtension(format)
          return `${fileBaseName}.${extension}`
        },
        formats: ['es', 'cjs', 'iife'],
        name: globalName,
      },
      minify: 'oxc',
      rolldownOptions: {
        output: {
          banner,
          footer({ fileName }) {
            return getFooter(fileName, isJqueryBuild)
          },
          minify: true,
        },
      },
      sourcemap: true,
      target: 'es2015',
    },
  }
})
