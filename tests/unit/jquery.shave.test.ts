import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type LibraryName = '$' | 'jQuery' | 'Zepto'

interface MockWindow {
  $?: MockjQuery
  jQuery?: MockjQuery
  Zepto?: MockjQuery
}

interface MockjQuery {
  fn: Record<string, unknown>
}

function getWindow(): MockWindow {
  return (globalThis as unknown as { window: MockWindow }).window
}

function createMockLibrary(): MockjQuery {
  return { fn: {} }
}

async function loadPlugin(library?: LibraryName): Promise<MockjQuery | undefined> {
  const mockLibrary = library ? createMockLibrary() : undefined
  if (library) getWindow()[library] = mockLibrary
  vi.resetModules()
  await import('../../src/jquery.shave')
  return mockLibrary
}

describe('jQuery shave plugin', () => {
  beforeEach(() => {
    ;(globalThis as unknown as { window: MockWindow }).window = {
      $: undefined,
      jQuery: undefined,
      Zepto: undefined,
    }
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('registers and invokes the plugin on $', async () => {
    const mockLibrary = await loadPlugin('$')
    const shavePlugin = mockLibrary?.fn.shave as (this: unknown, maxHeight: number) => unknown
    const collection = [document.createElement('div')]

    expect(typeof shavePlugin).toBe('function')
    expect(shavePlugin.call(collection, 50)).toBe(collection)
  })

  it.each(['jQuery', 'Zepto'] as const)('supports the %s fallback', async (library) => {
    const mockLibrary = await loadPlugin(library)

    expect(typeof mockLibrary?.fn.shave).toBe('function')
  })

  it('handles the absence of a jQuery-like library', async () => {
    await loadPlugin()
    const globalWindow = getWindow()

    expect(globalWindow.$).toBeUndefined()
    expect(globalWindow.jQuery).toBeUndefined()
    expect(globalWindow.Zepto).toBeUndefined()
  })

  it('does not require a browser window', async () => {
    vi.stubGlobal('window', undefined)
    vi.resetModules()

    await import('../../src/jquery.shave')
  })
})
