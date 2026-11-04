import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

type BrowserContext = { window: { shave?: unknown } }
type CommonJSContext = { module: { exports: unknown } }

const source = readFileSync(new URL('../../dist/shave.global.js', import.meta.url), 'utf8')

test('exposes the IIFE as a browser global', () => {
  const window = {}
  const context: BrowserContext = { window }
  runInNewContext(source, context)
  expectShave(context.window.shave)
})

test('exports the IIFE through CommonJS without a browser global', () => {
  const exports = {}
  const module = { exports }
  const context: CommonJSContext = { module }
  runInNewContext(source, context)
  expectShave(context.module.exports)
})

test('registers an AMD factory without a browser global', () => {
  let exported: unknown
  const define = (_dependencies: unknown[], factory: () => unknown): void => {
    exported = factory()
  }
  define.amd = {}
  const context = { define }
  runInNewContext(source, context)
  expectShave(exported)
})

function expectShave(value: unknown): void {
  assert.ok(typeof value === 'function')
  assert.equal(value.length, 2)
}
