import { afterEach, expect, it, vi } from 'vitest'
import shave from '../../src/shave'

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

function measuredSiblings(flex = false) {
  const parent = document.createElement('div')
  parent.style.width = '240px'
  const reads: (string | null)[][] = []
  const elements = Array.from({ length: 2 }, () => {
    const element = document.createElement('div')
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
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
    const flexParent = flex && element === parent
    const display = flexParent ? 'flex' : 'block'
    const styles = {
      display,
      cssFloat: 'none',
      position: 'static',
      columnCount: 'auto',
      columnWidth: 'auto',
      writingMode: 'horizontal-tb',
    } as CSSStyleDeclaration
    return styles
  })
  document.body.appendChild(parent)
  const fixture = { elements, reads }
  return fixture
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
  const { elements, reads } = measuredSiblings(true)

  shave(elements, 40)

  expect(reads.some(([first, second]) => first !== second)).toBe(true)
})
