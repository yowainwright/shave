export type Link = {
  [key: string]: string | number | boolean
}

export type Opts = {
  character?: string
  classname?: string
  spaces?: boolean
  charclassname?: string
  link?: Link
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

    // If element text has already been shaved
    if (span) {
      // Remove the ellipsis to recapture the original text
      el.removeChild(el.querySelector('.' + charclassname))
      el[textProp] = el[textProp] // eslint-disable-line
      // nuke span, recombine text
    }

    const fullText = el[textProp]
    const words: string | string[] = spaces ? fullText.split(' ') : fullText
    // If 0 or 1 words, we're done
    if (words.length < 2) {
      continue
    }

    // Temporarily remove any CSS height for text height calculation
    const heightStyle = styles.height
    styles.height = 'auto'
    const maxHeightStyle = styles.maxHeight
    styles.maxHeight = 'none'

    // If already short enough, we're done
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

    // Binary search for number of words which can fit in allotted height
    let max = words.length - 1
    let min = 0
    let pivot
    while (min < max) {
      pivot = (min + max + 1) >> 1 // eslint-disable-line no-bitwise
      const wordItems = words.slice(0, pivot);
      el[textProp] = spaces
        ? (wordItems as string[]).join(' ') as string
        : wordItems as string;
      el.insertAdjacentElement('beforeend', shavedTextEl)
      if (el.offsetHeight > maxHeight) {
        max = pivot - 1
      } else {
        min = pivot
      }
    }
    const wordeItems = words.slice(0, max)
    el[textProp] = spaces ? ((wordeItems as string[]).join(' ') as string) : wordeItems as string
    el.insertAdjacentElement('beforeend', shavedTextEl)
    const diffItems = words.slice(max)
    const diff: string = spaces
      ? ' ' + (diffItems as string[]).join(' ')
      : diffItems as string;
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
