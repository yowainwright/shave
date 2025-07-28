import { describe, it, expect, vi } from 'vitest'
import shave from '../../src/shave'

// Define proper types for mock elements
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
      // The function checks target type, so null should throw
      expect(() => shave(null as unknown as string, 50)).toThrow()
    })

    it('should handle undefined target', () => {
      // The function checks target type, so undefined should throw
      expect(() => shave(undefined as unknown as string, 50)).toThrow()
    })
  })

  describe('generateArrayOfNodes', () => {
    it('should accept string selector', () => {
      // Mock document.querySelectorAll with proper mock elements
      const mockElement: MockElement = {
        style: { height: '', maxHeight: '' },
        offsetHeight: 10, // Short enough to not need shaving
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
      const nodeList = document.querySelectorAll('div') // Empty NodeList
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
      
      // Should create elements with default classnames
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
  })
})