import { describe, it, expect, vi } from 'vitest'
import shave from '../../src/shave'

interface MockElement {
  style: {
    height: string
    maxHeight: string
    display?: string
  }
  offsetHeight: number
  textContent: string | null
  innerText?: string
  querySelector: ReturnType<typeof vi.fn>
  removeChild: ReturnType<typeof vi.fn>
  insertAdjacentElement: ReturnType<typeof vi.fn>
  classList?: {
    add: ReturnType<typeof vi.fn>
  }
  appendChild?: ReturnType<typeof vi.fn>
}

describe('shave function', () => {
  describe('basic functionality', () => {
    it('should be a function', () => {
      expect(typeof shave).toBe('function')
    })

    it('should throw error when maxHeight is not provided', () => {
      expect(() => shave('.test', undefined as unknown as number)).toThrow('maxHeight is required')
    })

    it('should throw error when maxHeight is NaN', () => {
      expect(() => shave('.test', NaN)).toThrow('maxHeight is required')
    })

    it('should handle empty selector gracefully', () => {
      expect(() => shave('.non-existent', 50)).not.toThrow()
    })

    it('should handle null target', () => {
      expect(() => shave(null as unknown as string, 50)).toThrow()
    })

    it('should handle undefined target', () => {
      expect(() => shave(undefined as unknown as string, 50)).toThrow()
    })
  })

  describe('generateArrayOfNodes', () => {
    it('should accept string selector', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 10,
        textContent: 'Test',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }
      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)

      expect(() => shave('.test', 50)).not.toThrow()
      expect(document.querySelectorAll).toHaveBeenCalledWith('.test')

      vi.restoreAllMocks()
    })

    it('should accept NodeList', () => {
      const nodeList = document.querySelectorAll('div')
      expect(() => shave(nodeList, 50)).not.toThrow()
    })

    it('should accept single Node', () => {
      const node = document.createElement('div')
      expect(() => shave(node, 50)).not.toThrow()
    })
  })

  describe('options handling', () => {
    it('should use default options when none provided', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 100,
        textContent: 'Test content with multiple words',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }

      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        const mockCreatedElement: Partial<MockElement> = {
          classList: { add: vi.fn() },
          style: { display: '', height: '', maxHeight: '' },
          appendChild: vi.fn(),
          textContent: ''
        }
        return mockCreatedElement as unknown as HTMLElement
      })

      shave('.test', 50)

      expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

      vi.restoreAllMocks()
    })

    it('should accept custom character option', () => {
      expect(() => shave('.test', 50, { character: '...' })).not.toThrow()
    })

    it('should accept custom classname option', () => {
      expect(() => shave('.test', 50, { classname: 'custom-shave' })).not.toThrow()
    })

    it('should accept spaces option', () => {
      expect(() => shave('.test', 50, { spaces: false })).not.toThrow()
    })

    it('should accept link option', () => {
      expect(() => shave('.test', 50, {
        link: { href: 'http://example.com', target: '_blank' }
      })).not.toThrow()
    })

    it('should accept delimiter option', () => {
      expect(() => shave('.test', 50, { delimiter: '\n' })).not.toThrow()
    })
  })

  describe('delimiter functionality', () => {
    it('should split text by custom delimiter', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 100,
        textContent: 'Line one\nLine two\nLine three',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }

      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        const mockCreatedElement: Partial<MockElement> = {
          classList: { add: vi.fn() },
          style: { display: '', height: '', maxHeight: '' },
          appendChild: vi.fn(),
          textContent: ''
        }
        return mockCreatedElement as unknown as HTMLElement
      })
      vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

      shave('.test', 50, { delimiter: '\n' })

      expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

      vi.restoreAllMocks()
    })

    it('should handle newline delimiter for multiline text', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 100,
        textContent: 'I am a cow.\nHear me moo!',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }

      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        const mockCreatedElement: Partial<MockElement> = {
          classList: { add: vi.fn() },
          style: { display: '', height: '', maxHeight: '' },
          appendChild: vi.fn(),
          textContent: ''
        }
        return mockCreatedElement as unknown as HTMLElement
      })
      vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

      shave('.test', 50, { delimiter: '\n' })

      expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

      vi.restoreAllMocks()
    })

    it('should use default space splitting when delimiter is not provided', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 100,
        textContent: 'word1 word2 word3',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }

      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        const mockCreatedElement: Partial<MockElement> = {
          classList: { add: vi.fn() },
          style: { display: '', height: '', maxHeight: '' },
          appendChild: vi.fn(),
          textContent: ''
        }
        return mockCreatedElement as unknown as HTMLElement
      })
      vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

      shave('.test', 50)

      expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

      vi.restoreAllMocks()
    })

    it('should handle custom delimiters like pipes', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 100,
        textContent: 'item1|item2|item3|item4',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }

      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        const mockCreatedElement: Partial<MockElement> = {
          classList: { add: vi.fn() },
          style: { display: '', height: '', maxHeight: '' },
          appendChild: vi.fn(),
          textContent: ''
        }
        return mockCreatedElement as unknown as HTMLElement
      })
      vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

      shave('.test', 50, { delimiter: '|' })

      expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

      vi.restoreAllMocks()
    })

    it('should skip processing when text has less than 2 parts after splitting', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 100,
        textContent: 'single-item',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }

      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)

      shave('.test', 50, { delimiter: '|' })

      expect(mockElement.insertAdjacentElement).not.toHaveBeenCalled()

      vi.restoreAllMocks()
    })

    it('should not process element that already fits within maxHeight', () => {
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 30,
        textContent: 'Line one\nLine two',
        querySelector: vi.fn().mockReturnValue(null),
        removeChild: vi.fn(),
        insertAdjacentElement: vi.fn()
      }

      vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)

      shave('.test', 50, { delimiter: '\n' })

      expect(mockElement.insertAdjacentElement).not.toHaveBeenCalled()

      vi.restoreAllMocks()
    })
  })
})
