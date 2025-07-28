import { describe, it, expect, vi } from 'vitest'
import shave, { updateTextProp } from '../../src/shave'

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

  describe('updateTextProp function', () => {
    describe('delimiter + array input', () => {
      it('should join array with delimiter when delimiter is provided and input is array', () => {
        const result = updateTextProp(',', true, ['apple', 'banana', 'cherry'])
        expect(result).toBe('apple,banana,cherry')
      })

      it('should join array with newline delimiter', () => {
        const result = updateTextProp('\n', true, ['line1', 'line2', 'line3'])
        expect(result).toBe('line1\nline2\nline3')
      })

      it('should join array with pipe delimiter', () => {
        const result = updateTextProp('|', false, ['item1', 'item2', 'item3'])
        expect(result).toBe('item1|item2|item3')
      })

      it('should join empty array with delimiter', () => {
        const result = updateTextProp(',', true, [])
        expect(result).toBe('')
      })

      it('should join single item array with delimiter', () => {
        const result = updateTextProp(',', true, ['single'])
        expect(result).toBe('single')
      })

      it('should prioritize delimiter over spaces when both are true', () => {
        const result = updateTextProp('-', true, ['word1', 'word2', 'word3'])
        expect(result).toBe('word1-word2-word3')
      })
    })

    describe('spaces + array input', () => {
      it('should join array with spaces when spaces is true and no delimiter', () => {
        const result = updateTextProp('', true, ['hello', 'world', 'test'])
        expect(result).toBe('hello world test')
      })

      it('should join array with spaces when delimiter is empty string', () => {
        const result = updateTextProp('', true, ['one', 'two', 'three'])
        expect(result).toBe('one two three')
      })

      it('should join empty array with spaces', () => {
        const result = updateTextProp('', true, [])
        expect(result).toBe('')
      })

      it('should join single item array with spaces', () => {
        const result = updateTextProp('', true, ['single'])
        expect(result).toBe('single')
      })
    })

    describe('array input without delimiter/spaces', () => {
      it('should join array without separator when spaces is false and no delimiter', () => {
        const result = updateTextProp('', false, ['join', 'me', 'together'])
        expect(result).toBe('joinmetogether')
      })

      it('should join array without separator when both are falsy', () => {
        const result = updateTextProp('', false, ['no', 'spaces', 'here'])
        expect(result).toBe('nospaceshere')
      })

      it('should join empty array without separator', () => {
        const result = updateTextProp('', false, [])
        expect(result).toBe('')
      })

      it('should join single item array without separator', () => {
        const result = updateTextProp('', false, ['single'])
        expect(result).toBe('single')
      })
    })

    describe('string input handling', () => {
      it('should return string as-is regardless of delimiter', () => {
        const result = updateTextProp(',', true, 'this is a string')
        expect(result).toBe('this is a string')
      })

      it('should return string as-is regardless of spaces', () => {
        const result = updateTextProp('', true, 'another string')
        expect(result).toBe('another string')
      })

      it('should return string as-is with both delimiter and spaces', () => {
        const result = updateTextProp('|', true, 'keep me intact')
        expect(result).toBe('keep me intact')
      })

      it('should return empty string as-is', () => {
        const result = updateTextProp(',', true, '')
        expect(result).toBe('')
      })

      it('should return string with special characters as-is', () => {
        const result = updateTextProp(',', true, 'special!@#$%^&*()characters')
        expect(result).toBe('special!@#$%^&*()characters')
      })
    })

    describe('edge cases', () => {
      it('should handle array with empty strings', () => {
        const result = updateTextProp(',', true, ['', 'middle', ''])
        expect(result).toBe(',middle,')
      })

      it('should handle array with empty strings and space delimiter', () => {
        const result = updateTextProp('', true, ['', 'middle', ''])
        expect(result).toBe(' middle ')
      })

      it('should handle array with only empty strings', () => {
        const result = updateTextProp(',', true, ['', '', ''])
        expect(result).toBe(',,')
      })

      it('should handle special delimiter characters', () => {
        const result = updateTextProp('\t', true, ['tab', 'separated', 'values'])
        expect(result).toBe('tab\tseparated\tvalues')
      })

      it('should handle multi-character delimiters', () => {
        const result = updateTextProp(' - ', true, ['one', 'two', 'three'])
        expect(result).toBe('one - two - three')
      })

      it('should handle array with undefined/null values', () => {
        const result = updateTextProp(',', true, ['first', undefined as any, 'third'])
        expect(result).toBe('first,,third')
      })

      it('should handle numeric values in array', () => {
        const result = updateTextProp(',', true, [1, 2, 3] as any)
        expect(result).toBe('1,2,3')
      })

      it('should handle mixed type array', () => {
        const result = updateTextProp(',', true, ['text', 123, true] as any)
        expect(result).toBe('text,123,true')
      })

      it('should handle very long arrays', () => {
        const longArray = Array(1000).fill('item')
        const result = updateTextProp(',', true, longArray)
        expect(result).toBe(longArray.join(','))
      })

      it('should handle delimiter that exists in content', () => {
        const result = updateTextProp(',', true, ['apple,pie', 'banana,split'])
        expect(result).toBe('apple,pie,banana,split')
      })
    })
  })
})
