export type Opts = {
  character?: string
  classname?: string
  spaces?: boolean
  charclassname?: string
}

function generateArrayOfNodes(target: string | NodeList): Array<Node> {
  if (typeof target === 'string') {
    return [...document.querySelectorAll(target)]
  } else if ('length' in target) {
    return [...target]
  } else {
    return [target]
  }
}

export default function shave(target: string | NodeList, maxHeight: number, opts: Opts = {}): void {
  if (typeof maxHeight === 'undefined' || isNaN(maxHeight)) {
    throw Error('maxHeight is required')
  }
  const els = generateArrayOfNodes(target)

  if (!els.length) {
    return
  }

  const {
    character = '&mldr;',
    classname = 'js-shave',
    spaces: initialSpaces = true,
    charclassname = 'js-shave-char',
  } = opts

  /**
   * @notes
   * the initialSpaces + spaces variable definition below fixes
   * a previous bug where spaces being a boolean type wasn't clear
   * meaning people were using (a string, in example—which is truthy)
   * hence, doing it this way is a non-breaking change
   */
  const spaces = typeof initialSpaces === 'boolean' ? initialSpaces : true
  const charHtml = `<span class="${charclassname}">${character}</span>`

  for (let i = 0; i < els.length; i += 1) {
    const el = els[i] as HTMLElement
    const styles = el.style
    const span = el.querySelector(`.${classname}`)
    const textProp = el.textContent === undefined ? 'innerText' : 'textContent'

    // If element text has already been shaved
    if (span) {
      // Remove the ellipsis to recapture the original text
      const charList = el.querySelectorAll(`.${charclassname}`)
      for (let i = 0; i < charList.length; i++) {
        const char = charList[i]
        char.parentNode.removeChild(char)
      }
      // innerText could not get the invisible element (such as 'display: none;'),so it special treatment is required.
      if (textProp === 'innerText') {
        const elWithShavedTextList = el.querySelectorAll(`.${classname}`)
        for (let i = 0; i < elWithShavedTextList.length; i++) {
          const elWithShavedText = elWithShavedTextList[i] as HTMLElement
          elWithShavedText.style.display = null
          elWithShavedText.style.fontSize = '0px'
        }
      }
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

    // Binary search for number of words which can fit in allotted height
    let max = words.length - 1
    let min = 0
    let pivot
    while (min < max) {
      pivot = (min + max + 1) >> 1 // eslint-disable-line no-bitwise
      el[textProp] = spaces
        ? ((words.slice(0, pivot) as string[]).join(' ') as string)
        : (words as string).slice(0, pivot)
      el.insertAdjacentHTML('beforeend', charHtml)
      if (el.offsetHeight > maxHeight) {
        max = pivot - 1
      } else {
        min = pivot
      }
    }

    el[textProp] = spaces ? ((words.slice(0, max) as string[]).join(' ') as string) : (words as string).slice(0, max)
    el.insertAdjacentHTML('beforeend', charHtml)
    const diff: string = spaces
      ? ` ${(words.slice(max) as string[]).join(' ') as string}`
      : (words as string).slice(max)

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
