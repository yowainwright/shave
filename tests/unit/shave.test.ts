import { afterEach, describe, it, expect, vi } from 'vitest'
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

describe('shave function', registerShaveFunctionTests)

function createMockSpan(): HTMLElement {
  const add = vi.fn()
  const classList = { add }
  const style = { display: '', height: '', maxHeight: '' }
  const appendChild = vi.fn()
  const element: Partial<MockElement> = { classList, style, appendChild, textContent: '' }
  const span = element as unknown as HTMLElement
  return span
}

function registerBasicFunctionalityTests() {
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
}

function registerGenerateArrayOfNodesTests() {
  it('should accept string selector', () => {
    const mockElement = createMockElement('Test', 10)
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
}

function registerOptionsHandlingTests() {
  it('should use default options when none provided', () => {
    const mockElement = createMockElement('Test content with multiple words', 100)

    vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
    vi.spyOn(document, 'createElement').mockImplementation(createMockSpan)

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
    const link = { href: 'http://example.com', target: '_blank' }
    expect(() => shave('.test', 50, { link })).not.toThrow()
  })

  it('should accept delimiter option', () => {
    expect(() => shave('.test', 50, { delimiter: '\n' })).not.toThrow()
  })
}

function registerDOMBehaviorTests() {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('creates a link marker and assigns its attributes', verifyCreatesALinkMarkerAndAssignsItsAttributes)
  it('keeps marker and hidden text from being parsed as HTML', verifyLiteralText)
  it('keeps link labels and quoted attribute values from injecting HTML', verifyLiteralLink)

  it('supports character-based shaving when spaces are false', verifySupportsCharacterBasedShavingWhenSpacesAreFalse)

  it('defaults non-boolean spaces to true', () => {
    const element = createMeasuredElement('one two three')

    const spaces = 'false' as unknown as boolean
    shave(element, 50, { spaces })

    expect(element.querySelector('.js-shave-char')).not.toBeNull()
  })

  it('removes a previous shaved marker before shaving again', () => {
    const element = createMeasuredElement('one two three')

    shave(element, 50)
    shave(element, 50)

    expect(element.querySelectorAll('.js-shave-char')).toHaveLength(1)
    expect(element.querySelectorAll('.js-shave')).toHaveLength(1)
  })

  it('handles a previous shave marker without a character', () => {
    const element = createMeasuredElement('one two three')
    const previousMarker = document.createElement('span')
    previousMarker.className = 'js-shave'
    element.appendChild(previousMarker)

    expect(() => shave(element, 50)).not.toThrow()
  })

  it('uses innerText when textContent is unavailable', () => {
    const mock = createMockElement('', 10)
    const element = { ...mock, textContent: undefined, innerText: 'one two' } as unknown as Node

    expect(() => shave(element, 50)).not.toThrow()
  })
}

function registerDelimiterFunctionalityTests() {
  it('should split text by custom delimiter', verifyShouldSplitTextByCustomDelimiter)

  it('should handle newline delimiter for multiline text', verifyShouldHandleNewlineDelimiterForMultilineText)

  it('should use default space splitting when delimiter is not provided', () => {
    const mockElement = createMockElement('word1 word2 word3', 100)

    vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
    vi.spyOn(document, 'createElement').mockImplementation(createMockSpan)
    vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

    shave('.test', 50)

    expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

    vi.restoreAllMocks()
  })

  it('should handle custom delimiters like pipes', () => {
    const mockElement = createMockElement('item1|item2|item3|item4', 100)

    vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
    vi.spyOn(document, 'createElement').mockImplementation(createMockSpan)
    vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

    shave('.test', 50, { delimiter: '|' })

    expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

    vi.restoreAllMocks()
  })

  it('should skip processing when text has less than 2 parts after splitting', () => {
    const mockElement = createMockElement('single-item', 100)

    vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)

    shave('.test', 50, { delimiter: '|' })

    expect(mockElement.insertAdjacentElement).not.toHaveBeenCalled()

    vi.restoreAllMocks()
  })

  it('should not process element that already fits within maxHeight', () => {
    const mockElement = createMockElement('Line one\nLine two', 30)

    vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)

    shave('.test', 50, { delimiter: '\n' })

    expect(mockElement.insertAdjacentElement).not.toHaveBeenCalled()

    vi.restoreAllMocks()
  })
}

function registerDelimiterArrayInputTests() {
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
}

function registerSpacesArrayInputTests() {
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
}

function registerArrayInputWithoutDelimiterSpacesTests() {
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
}

function registerStringInputHandlingTests() {
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
}

function registerEdgeCasesTests() {
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

  it('should handle very long arrays', verifyShouldHandleVeryLongArrays)

  it('should handle delimiter that exists in content', () => {
    const result = updateTextProp(',', true, ['apple,pie', 'banana,split'])
    expect(result).toBe('apple,pie,banana,split')
  })
}

function registerUpdateTextPropFunctionTests() {
  describe('delimiter + array input', registerDelimiterArrayInputTests)

  describe('spaces + array input', registerSpacesArrayInputTests)

  describe('array input without delimiter/spaces', registerArrayInputWithoutDelimiterSpacesTests)

  describe('string input handling', registerStringInputHandlingTests)

  describe('edge cases', registerEdgeCasesTests)
}

function registerShaveFunctionTests() {
  describe('basic functionality', registerBasicFunctionalityTests)

  describe('generateArrayOfNodes', registerGenerateArrayOfNodesTests)

  describe('options handling', registerOptionsHandlingTests)

  describe('DOM behavior', registerDOMBehaviorTests)

  describe('delimiter functionality', registerDelimiterFunctionalityTests)

  describe('updateTextProp function', registerUpdateTextPropFunctionTests)
}

function verifyCreatesALinkMarkerAndAssignsItsAttributes() {
  const element = createMeasuredElement('one two three')

  const link = {
    href: 'https://example.com',
    target: '_blank',
    className: 'custom-link',
    textContent: 'read more',
  }
  shave(element, 50, { charclassname: 'custom-char', link })

  const marker = element.querySelector('.custom-link')
  expect(marker?.tagName).toBe('A')
  expect(marker?.textContent).toBe('read more')
  expect(marker?.getAttribute('href')).toBe('https://example.com')
  expect(marker?.getAttribute('target')).toBe('_blank')
}

function verifySupportsCharacterBasedShavingWhenSpacesAreFalse() {
  const element = createMeasuredElement('abcdef')
  Object.defineProperty(element, 'offsetHeight', {
    configurable: true,
    get: () => {
      const fits = element.textContent && element.textContent.length <= 5
      const height = fits ? 10 : 100
      return height
    },
  })

  shave(element, 50, { spaces: false })

  expect(element.querySelector('.js-shave-char')?.textContent).toBe('…')
  expect(element.querySelector('.js-shave')?.textContent).toBe('ef')
}

function verifyLiteralText() {
  const text = '<img src=x onerror=alert(1)> one two three'
  const element = createMeasuredElement(text)
  const character = '<svg onload=alert(1)>'
  shave(element, 50, { character })

  expect(element.querySelectorAll('img, svg, script')).toHaveLength(0)
  expect(element.querySelector('.js-shave-char')?.textContent).toBe(character)
  expect(element.querySelector('.js-shave')?.textContent).toContain(text)
}

function verifyLiteralLink() {
  const element = createMeasuredElement('one two three')
  const textContent = '<script>alert(1)</script>'
  const label = '" onmouseover="alert(1)'
  const link = { href: '/more', textContent, 'data-label': label }
  shave(element, 50, { link })

  const marker = element.querySelector('a.js-shave-char')
  expect(marker?.textContent).toBe(textContent)
  expect(marker?.getAttribute('data-label')).toBe(label)
  expect(marker?.getAttribute('onmouseover')).toBeNull()
  expect(element.querySelector('script')).toBeNull()
}

function createMeasuredElement(text: string, offsetHeight = 100): HTMLElement {
  const element = document.createElement('div')
  element.textContent = text
  Object.defineProperty(element, 'offsetHeight', { configurable: true, value: offsetHeight })
  document.body.appendChild(element)
  return element
}

function verifyShouldSplitTextByCustomDelimiter() {
  const mockElement = createMockElement('Line one\nLine two\nLine three', 100)

  vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
  vi.spyOn(document, 'createElement').mockImplementation(createMockSpan)
  vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

  shave('.test', 50, { delimiter: '\n' })

  expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

  vi.restoreAllMocks()
}

function verifyShouldHandleNewlineDelimiterForMultilineText() {
  const mockElement = createMockElement('I am a cow.\nHear me moo!', 100)

  vi.spyOn(document, 'querySelectorAll').mockReturnValue([mockElement] as unknown as NodeListOf<Element>)
  vi.spyOn(document, 'createElement').mockImplementation(createMockSpan)
  vi.spyOn(document, 'createTextNode').mockReturnValue({} as Text)

  shave('.test', 50, { delimiter: '\n' })

  expect(mockElement.insertAdjacentElement).toHaveBeenCalled()

  vi.restoreAllMocks()
}

function createMockElement(textContent: string, offsetHeight: number): MockElement {
  const style = { height: '', maxHeight: '' }
  const querySelector = vi.fn().mockReturnValue(null)
  const removeChild = vi.fn()
  const insertAdjacentElement = vi.fn()
  const appendChild = vi.fn()
  const element = { style, offsetHeight, textContent, querySelector, removeChild, insertAdjacentElement, appendChild }
  return element
}

function verifyShouldHandleVeryLongArrays() {
  const longArray = Array(1000).fill('item')
  const result = updateTextProp(',', true, longArray)
  expect(result).toBe(longArray.join(','))
}
