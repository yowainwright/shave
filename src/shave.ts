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

function generateArrayOfNodes(target: string | NodeList | Node): Array<Node> {
  if (typeof target === 'string') {
    return [...document.querySelectorAll(target)]
  } else if ('length' in target) {
    return [...target]
  } else {
    return [target]
  }
}

export default function shave(target: string | NodeList | Node, maxHeight: number, opts: Opts = {}): void {
  if (typeof maxHeight === 'undefined' || isNaN(maxHeight)) {
    throw Error('maxHeight is required')
  }
  const els = generateArrayOfNodes(target)

  if (!els.length) {
    return
  }

  const {
    character = '…',
    classname = 'js-shave',
    spaces: initialSpaces = true,
    charclassname = 'js-shave-char',
    link = {},
    delimiter,
  } = opts

  /**
   * @notes
   * the initialSpaces + spaces variable definition below fixes
   * a previous bug where spaces being a boolean type wasn't clear
   * meaning people were using (a string, in example—which is truthy)
   * hence, doing it this way is a non-breaking change
   */
  const spaces = typeof initialSpaces === 'boolean' ? initialSpaces : true

  /**
   * @notes
   * - create a span or anchor element and assign properties to it
   * - JSON.stringify is used to support IE8+
   * - if link.href is not provided, link object properties are ignored
   */
  const isLink = link && JSON.stringify(link) !== '{}' && link.href
  const shavedTextElType = isLink ? 'a' : 'span'

  for (let i = 0; i < els.length; i += 1) {
    const el = els[i] as HTMLElement
    const styles = el.style
    const span = el.querySelector('.' + classname)
    const textProp = el.textContent === undefined ? 'innerText' : 'textContent'
    if (span) {
      el.removeChild(el.querySelector('.' + charclassname))
      el[textProp] = el[textProp] // eslint-disable-line
    }

    const fullText = el[textProp]
    let words: string | string[]

    if (!delimiter) words = spaces ? fullText.split(' ') : fullText
    else words = fullText.split(delimiter)

    if (words.length < 2) continue

    const heightStyle = styles.height
    styles.height = 'auto'
    const maxHeightStyle = styles.maxHeight
    styles.maxHeight = 'none'

    if (el.offsetHeight <= maxHeight) {
      styles.height = heightStyle
      styles.maxHeight = maxHeightStyle
      continue
    }

    const textContent = isLink && link.textContent ? link.textContent : character
    const shavedTextEl = document.createElement(shavedTextElType)
    const shavedTextElAttributes = {
      className: charclassname,
      textContent,
    }

    for (const property in shavedTextElAttributes) {
      shavedTextEl[property] = shavedTextElAttributes[property]
      shavedTextEl.textContent = character;
    }

    if (isLink) {
      for (const linkProperty in link) {
        shavedTextEl[linkProperty] = link[linkProperty]
      }
    }

    let max = words.length - 1
    let min = 0
    let pivot
    while (min < max) {
      pivot = (min + max + 1) >> 1 // eslint-disable-line no-bitwise
      const wordItems = words.slice(0, pivot);
      el[textProp] = updateTextProp(delimiter, spaces, wordItems)
      el.insertAdjacentElement('beforeend', shavedTextEl)
      if (el.offsetHeight > maxHeight) {
        max = pivot - 1
      } else {
        min = pivot
      }
    }
    const wordeItems = words.slice(0, max)
    el[textProp] = updateTextProp(delimiter, spaces, wordeItems)
    el.insertAdjacentElement('beforeend', shavedTextEl)
    const diffItems = words.slice(max);
    const isArray = Array.isArray(diffItems)
    let diff = '';
    if (delimiter && isArray) diff = delimiter + diffItems.join(delimiter)
    else if (spaces && isArray) diff = ' ' + diffItems.join(' ')
    else if (isArray) diff = diffItems.join('')
    else diff = diffItems
    const shavedText = document.createTextNode(diff)
    const elWithShavedText = document.createElement('span')
    elWithShavedText.classList.add(classname)
    elWithShavedText.style.display = 'none'
    elWithShavedText.appendChild(shavedText)
    el.insertAdjacentElement('beforeend', elWithShavedText)
    styles.height = heightStyle
    styles.maxHeight = maxHeightStyle
  }
}

export function updateTextProp (delimiter: string, spaces: boolean, wordItems: string | string[]): string {
  const isArray = Array.isArray(wordItems)
  if (delimiter && isArray) return (wordItems).join(delimiter)
  if (spaces && isArray) return (wordItems).join(' ')
  if (isArray) return wordItems.join('')
  return wordItems
}
