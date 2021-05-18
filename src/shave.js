export default function shave(target, maxHeight, opts = {}) {
  if (typeof maxHeight === 'undefined' || isNaN(maxHeight)) throw Error('maxHeight is required')
  let els = typeof target === 'string' ? document.querySelectorAll(target) : target
  if (!els) return

  const character = opts.character || '&mldr;'
  const classname = opts.classname || 'js-shave'
  const spaces = typeof opts.spaces === 'boolean' ? opts.spaces : true
  const charclassname = opts.charclassname || 'js-shave-char'
  const charHtml = `<span class="${charclassname}">${character}</span>`
  const targetLinkText = opts.targetLink.text || undefined
  const targetLinkUrl = opts.targetLink.url || '#'
  const targetLinkTabindex = opts.targetLink.tabindex || 0
  const targetLinkNewTab = opts.targetLink.newTab ? '_blank' : '_self'
  const targetLinkHtml = `
    <a
      class="js-shave-link"
      href="${targetLinkUrl}"
      target="${targetLinkNewTab}"
      aria-lable="${targetLinkText}"
      title="${targetLinkText}"
      tabindex="${targetLinkTabindex}"
    >${targetLinkText}</a>`

  if (!('length' in els)) els = [els]
  for (let i = 0; i < els.length; i += 1) {
    const el = els[i]
    const styles = el.style
    const span = el.querySelector(`.${classname}`)
    const link = el.querySelector('js-shave-link')
    const textProp = el.textContent === undefined ? 'innerText' : 'textContent'

    // If element text has already been shaved
    if (span) {
      // Remove the ellipsis and link to recapture the original text
      el.removeChild(el.querySelector(`.${charclassname}`))
      link ? el.removeChild(link) : null
      el[textProp] = el[textProp] // eslint-disable-line
      // nuke span, recombine text
    }

    const fullText = el[textProp]
    const words = spaces ? fullText.split(' ') : fullText
    // If 0 or 1 words, we're done
    if (words.length < 2) continue

    // Temporarily remove any CSS height for text height calculation
    const heightStyle = styles.height
    styles.height = 'auto'
    const maxHeightStyle = styles.maxHeight
    styles.maxHeight = 'none'

    // Adjust number of words if target link is set in options
    const linkLength = targetLinkText.split(' ').length

    // If already short enough, we're done
    if (el.offsetHeight <= maxHeight) {
      styles.height = heightStyle
      styles.maxHeight = maxHeightStyle
      continue
    }

    // Binary search for number of words which can fit in allotted height
    let max = words.length + (linkLength - 1)
    let min = 0
    let pivot
    while (min < max) {
      pivot = (min + max + 1) >> 1 // eslint-disable-line no-bitwise
      el[textProp] = spaces ? words.slice(0, pivot).join(' ') : words.slice(0, pivot)
      el.insertAdjacentHTML('beforeend', charHtml)
      // Insert target link text if set in options
      targetLinkText ? el.insertAdjacentHTML('beforeend', targetLinkHtml) : null
      if (el.offsetHeight > maxHeight) max = pivot - 1
      else min = pivot
    }

    el[textProp] = spaces ? words.slice(0, max).join(' ') : words.slice(0, max)
    el.insertAdjacentHTML('beforeend', charHtml)
    targetLinkText ? el.insertAdjacentHTML('beforeend', targetLinkHtml) : null
    const diff = spaces ? ` ${words.slice(max).join(' ')}` : words.slice(max)

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
