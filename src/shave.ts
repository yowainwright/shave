export type Link = {
  [key: string]: string | number | boolean
}

export type Opts = {
  character?: string
  classname?: string
  spaces?: boolean
  charclassname?: string
  link?: Link
  delimiter?: string
}

type ShaveTarget = string | ArrayLike<Node> | Node
type Search = Generator<HTMLElement, void, number>

export default function shave(target: ShaveTarget, maxHeight: number, opts: Opts = {}): void {
  if (isNaN(maxHeight)) throw Error('maxHeight is required')
  const els = generateArrayOfNodes(target)
  if (!els.length) return
  const { character = '…', classname = 'js-shave', spaces: initialSpaces = true } = opts
  const { charclassname = 'js-shave-char', link = {}, delimiter } = opts

  /**
   * @notes
   * the initialSpaces + spaces variable definition below fixes
   * a previous bug where spaces being a boolean type wasn't clear
   * meaning people were using (a string, in example—which is truthy)
   * hence, doing it this way is a non-breaking change
   */
  const spaces = initialSpaces !== false
  const separator = delimiter || (spaces ? ' ' : '')

  /**
   * @notes
   * - create a span or anchor element and assign properties to it
   * - JSON.stringify is used to support IE8+
   * - if link.href is not provided, link object properties are ignored
   */
  const isLink = link && JSON.stringify(link) !== '{}' && link.href

  const groups = canBatch(els) ? els.map((el) => [el]) : [els]
  const searches = groups.map((group) => truncate(group))
  runSearches(searches)
  function* truncate(els: Node[]): Search {
    for (const el of els as HTMLElement[]) {
      const textProp = restoreText(el, classname, charclassname)
      const words = (el[textProp] || '').split(separator)

      if (words.length < 2) continue

      const styles = el.style
      const { height: heightStyle } = styles
      styles.height = 'auto'
      const { maxHeight: maxHeightStyle } = styles
      styles.maxHeight = 'none'
      if ((yield el) > maxHeight) {
        const shavedTextEl = createMarker(character, charclassname, link, isLink)
        const writeCandidate = (count: number): void => {
          el[textProp] = words.slice(0, count).join(separator)
          el.insertAdjacentElement('beforeend', shavedTextEl)
        }
        const max = yield* findCutoff(el, maxHeight, words.length, writeCandidate)
        const diff = separator + words.slice(max).join(separator)
        hideRemainder(el, classname, diff)
      }
      styles.height = heightStyle
      styles.maxHeight = maxHeightStyle
    }
  }
}

export function updateTextProp(delimiter: string | undefined, spaces: boolean, wordItems: string | string[]): string {
  const separator = delimiter || (spaces ? ' ' : '')
  if (Array.isArray(wordItems)) {
    const text = wordItems.join(separator)
    return text
  }
  return wordItems
}

function runSearches(searches: Search[]): void {
  const steps = searches.map((search) => search.next())
  let running = steps.length
  while (running) {
    const heights = steps.map((step) => (step.done ? 0 : step.value.offsetHeight))
    running = 0
    searches.forEach((search, index) => {
      const step = search.next(heights[index])
      steps[index] = step
      if (!step.done) running += 1
    })
  }
}

function restoreText(el: HTMLElement, classname: string, charclassname: string): 'innerText' | 'textContent' {
  const span = el.querySelector('.' + classname)
  const textProp = el.textContent === undefined ? 'innerText' : 'textContent'
  if (span) {
    const shavedCharacter = el.querySelector('.' + charclassname)
    if (shavedCharacter) el.removeChild(shavedCharacter)
    el[textProp] = el[textProp] // eslint-disable-line
  }
  return textProp
}

function createMarker(character: string, charclassname: string, link: Link, isLink: Link[string]): HTMLElement {
  const textContent = isLink && link.textContent ? link.textContent : character
  const marker = document.createElement(isLink ? 'a' : 'span')
  marker.className = charclassname
  marker.textContent = String(textContent)
  if (isLink) {
    assignLinkAttributes(marker, link)
    marker.classList.add(charclassname)
  }
  return marker
}

function* findCutoff(
  el: HTMLElement,
  maxHeight: number,
  length: number,
  writeCandidate: (count: number) => void,
): Generator<HTMLElement, number, number> {
  let max = length
  let min = 0
  while (min + 1 < max) {
    const pivot = (min + max) >> 1 // eslint-disable-line no-bitwise
    writeCandidate(pivot)
    if ((yield el) > maxHeight) {
      max = pivot
    } else {
      min = pivot
    }
  }
  writeCandidate(min)
  return min
}

function canBatch(els: Node[]): boolean {
  const tooFewTargets = els.length < 2
  if (tooFewTargets) return false
  const repeatedTargets = new Set(els).size !== els.length
  if (repeatedTargets) return false
  const parent = els[0].parentElement
  if (!parent) return false
  const fixedParentWidth = parent.style.width.endsWith('px')
  if (!fixedParentWidth) return false
  const siblings = els.every((el) => {
    const width = (el as HTMLElement).style?.width || ''
    const sameContainer = el.parentElement === parent
    if (!sameContainer) return false
    const fixedWidth = width === '100%' || width.endsWith('px')
    if (!fixedWidth) return false
    const block = isBlock(el as HTMLElement, 'flow-root')
    return block
  })
  if (!siblings) return false
  for (let ancestor: HTMLElement | null = parent; ancestor; ancestor = ancestor.parentElement) {
    if (!isBlock(ancestor)) return false
  }
  return true
}

function isBlock(el: HTMLElement, display = 'block'): boolean {
  const view = el.ownerDocument.defaultView || window
  const styles = view.getComputedStyle(el)
  const positioned = styles.position === 'absolute' || styles.position === 'fixed'
  const normalFlow = styles.display === display && styles.cssFloat === 'none'
  if (!normalFlow) return false
  if (positioned) return false
  const automaticColumns = styles.columnCount === 'auto' && styles.columnWidth === 'auto'
  if (!automaticColumns) return false
  const horizontal = styles.writingMode === 'horizontal-tb'
  return horizontal
}

function generateArrayOfNodes(target: ShaveTarget): Array<Node> {
  if (typeof target === 'string') {
    const nodes = [...document.querySelectorAll(target)]
    return nodes
  }
  if ('length' in target) {
    const nodes = Array.from(target)
    return nodes
  }
  const nodes = [target]
  return nodes
}

function assignLinkAttributes(element: HTMLElement, link: Link): void {
  Object.entries(link).forEach(([property, value]) => {
    const text = String(value)
    if (property === 'textContent') {
      element.textContent = text
      return
    }
    element.setAttribute(property === 'className' ? 'class' : property, text)
  })
}

function hideRemainder(el: HTMLElement, classname: string, diff: string): void {
  const hidden = document.createElement('span')
  hidden.classList.add(classname)
  hidden.style.display = 'none'
  hidden.textContent = diff
  el.appendChild(hidden)
}
