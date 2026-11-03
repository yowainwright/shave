import { afterEach, expect, it, vi } from 'vitest'
import shave from '../../src/shave'

type FixtureOptions = {
  flex?: boolean
  ownerDocument?: Document
  layout?: Partial<CSSStyleDeclaration>
}

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

function measuredSiblings({ flex = false, ownerDocument = document, layout = {} }: FixtureOptions = {}) {
  const parent = ownerDocument.createElement('div')
  parent.style.width = '240px'
  const reads: (string | null)[][] = []
  const elements = Array.from({ length: 2 }, () => {
    const element = ownerDocument.createElement('div')
    element.style.width = '100%'
    element.textContent = 'one two three four five'
    Object.defineProperty(element, 'offsetHeight', {
      get: () => {
        const snapshot = elements.map((sibling) => sibling.textContent)
        reads[reads.length] = snapshot
        const length = element.textContent?.length || 0
        const height = length > 15 ? 80 : 20
        return height
      },
    })
    parent.appendChild(element)
    return element
  })
  mockLayout(parent, flex, layout)
  ownerDocument.body.appendChild(parent)
  const fixture = { elements, reads }
  return fixture
}

function mockLayout(parent: HTMLElement, flex: boolean, layout: Partial<CSSStyleDeclaration>): void {
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
    const flexParent = flex && element === parent
    const parentDisplay = flexParent ? 'flex' : 'block'
    const target = element.parentElement === parent
    const display = target ? 'flow-root' : parentDisplay
    const styles = {
      display,
      cssFloat: 'none',
      position: 'static',
      columnCount: 'auto',
      columnWidth: 'auto',
      writingMode: 'horizontal-tb',
      ...layout,
    } as CSSStyleDeclaration
    return styles
  })
}

it('writes all candidates before reading sibling heights and reads options once', () => {
  const { elements, reads } = measuredSiblings()
  const character = vi.fn(() => '…')
  const opts = {
    get character() {
      const value = character()
      return value
    },
  }

  shave(elements, 40, opts)

  expect(character).toHaveBeenCalledOnce()
  expect(reads.length).toBeGreaterThan(2)
  expect(reads.every(([first, second]) => first === second)).toBe(true)
  expect(elements.every((element) => element.querySelector('.js-shave'))).toBe(true)
})

it('finishes each element sequentially when its parent uses flex layout', () => {
  const { elements, reads } = measuredSiblings({ flex: true })

  shave(elements, 40)

  expect(reads.some(([first, second]) => first !== second)).toBe(true)
})

it.each([
  'duplicate targets',
  'detached target',
  'fluid parent',
  'different parents',
  'missing width',
  'relative width',
])('uses sequential truncation for %s', (scenario) => {
  const { elements, reads } = measuredSiblings()
  const targets = arrangeFallback(scenario, elements)

  shave(targets, 40)

  expect(reads.some(([first, second]) => first !== second)).toBe(true)
  elements.forEach(expectTruncatedText)
})

it.each([
  { display: 'block' },
  { display: 'inline' },
  { cssFloat: 'left' },
  { position: 'absolute' },
  { position: 'fixed' },
  { columnCount: '2' },
  { columnWidth: '100px' },
  { writingMode: 'vertical-rl' },
])('uses sequential truncation for layout %j', (layout) => {
  const { elements, reads } = measuredSiblings({ layout })

  shave(elements, 40)

  expect(reads.some(([first, second]) => first !== second)).toBe(true)
  elements.forEach(expectTruncatedText)
})

it('batches pixel-width siblings using their document view', () => {
  const { elements, reads } = measuredSiblings()
  elements.forEach((element) => {
    element.style.width = '120px'
  })

  shave(elements, 40)

  expect(reads.every(([first, second]) => first === second)).toBe(true)
  elements.forEach(expectTruncatedText)
})

it('uses the global view for a document without a browsing context', () => {
  const ownerDocument = document.implementation.createHTMLDocument('detached')
  const { elements, reads } = measuredSiblings({ ownerDocument })
  expect(ownerDocument.defaultView).toBeNull()

  shave(elements, 40)

  expect(reads.every(([first, second]) => first === second)).toBe(true)
  elements.forEach(expectTruncatedText)
})

it('preserves an unstyled element while truncating its sibling', () => {
  const { elements } = measuredSiblings()
  const unstyled = document.createElementNS('urn:shave-test', 'text')
  unstyled.textContent = 'single'
  elements[0].replaceWith(unstyled)
  const targets = [unstyled, elements[1]]

  shave(targets, 40)

  expect(unstyled.textContent).toBe('single')
  expectTruncatedText(elements[1])
  expect(window.getComputedStyle).not.toHaveBeenCalled()
})

function arrangeFallback(scenario: string, elements: HTMLElement[]): HTMLElement[] {
  const [first, second] = elements
  const parent = first.parentElement as HTMLElement
  if (scenario === 'duplicate targets') {
    const targets = [first, first, second]
    return targets
  }
  if (scenario === 'detached target') first.remove()
  if (scenario === 'fluid parent') parent.style.width = 'auto'
  if (scenario === 'different parents') document.createElement('div').appendChild(second)
  if (scenario === 'missing width') first.style.removeProperty('width')
  if (scenario === 'relative width') first.style.width = '50%'
  return elements
}

function expectTruncatedText(element: HTMLElement): void {
  expect(element.querySelectorAll('.js-shave-char')).toHaveLength(1)
  expect(element.querySelector('.js-shave')?.textContent).toBe(' four five')
  expect(element.textContent).toBe('one two three… four five')
}
