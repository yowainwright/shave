function shaveOld(target, maxHeight, opts = {}) {
  if (typeof maxHeight === 'undefined' || isNaN(maxHeight)) {
    throw Error('maxHeight is required')
  }

  function generateArrayOfNodes(target) {
    if (typeof target === 'string') {
      return [...document.querySelectorAll(target)]
    } else if ('length' in target) {
      return [...target]
    } else {
      return [target]
    }
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

  const spaces = typeof initialSpaces === 'boolean' ? initialSpaces : true
  const isLink = link && JSON.stringify(link) !== '{}' && link.href
  const shavedTextElType = isLink ? 'a' : 'span'

  for (let i = 0; i < els.length; i += 1) {
    const el = els[i]
    const styles = el.style
    const span = el.querySelector('.' + classname)
    const textProp = el.textContent === undefined ? 'innerText' : 'textContent'

    if (span) {
      el.removeChild(el.querySelector('.' + charclassname))
      el[textProp] = el[textProp]
    }

    const fullText = el[textProp]
    const words = spaces ? fullText.split(' ') : fullText

    if (words.length < 2) {
      continue
    }

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
      pivot = (min + max + 1) >> 1
      const wordItems = words.slice(0, pivot);
      el[textProp] = spaces
        ? (wordItems).join(' ')
        : wordItems;
      el.insertAdjacentElement('beforeend', shavedTextEl)
      if (el.offsetHeight > maxHeight) {
        max = pivot - 1
      } else {
        min = pivot
      }
    }
    const wordeItems = words.slice(0, max)
    el[textProp] = spaces ? (wordeItems).join(' ') : wordeItems
    el.insertAdjacentElement('beforeend', shavedTextEl)
    const diffItems = words.slice(max)
    const diff = spaces
      ? ' ' + (diffItems).join(' ')
      : diffItems;
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

function createTestElements(count, wordsPerElement = 50) {
  const elements = []
  const container = document.createElement('div')
  container.style.cssText = 'position: absolute; top: -9999px; width: 200px; font-family: Arial; font-size: 14px; line-height: 1.4;'
  document.body.appendChild(container)

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = `perf-test-${i}`
    el.style.cssText = 'width: 200px; font-family: Arial; font-size: 14px; line-height: 1.4;'

    const words = []
    for (let j = 0; j < wordsPerElement; j++) {
      words.push(`word${j}`)
    }
    el.textContent = words.join(' ')

    container.appendChild(el)
    elements.push(el)
  }

  return { elements, container }
}

function cleanupTestElements(container) {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container)
  }
}

function benchmark(name, fn, iterations = 1) {
  for (let i = 0; i < 3; i++) {
    fn()
  }

  const times = []
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    fn()
    const end = performance.now()
    times.push(end - start)
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)

  return { name, avg, min, max, times }
}

const testScenarios = [
  { elements: 10, words: 20, height: 50, description: 'Small test (10 elements, 20 words each)' },
  { elements: 50, words: 30, height: 60, description: 'Medium test (50 elements, 30 words each)' },
  { elements: 100, words: 50, height: 80, description: 'Large test (100 elements, 50 words each)' },
]

async function runPerformanceTests() {
  console.log('🚀 Starting performance regression test...\n')
  const shaveModule = await import('../../dist/shave.mjs')
  const shaveNew = shaveModule.default

  const results = []

  for (const scenario of testScenarios) {
    console.log(`📊 Running scenario: ${scenario.description}`)
    const { elements: oldElements, container: oldContainer } = createTestElements(scenario.elements, scenario.words)
    const oldResult = benchmark(
      `Old (${scenario.description})`,
      () => {
        oldElements.forEach((el, i) => {
          el.innerHTML = ''
          el.className = `perf-test-${i}`
          const words = []
          for (let j = 0; j < scenario.words; j++) {
            words.push(`word${j}`)
          }
          el.textContent = words.join(' ')
        })
        shaveOld(oldElements, scenario.height)
      },
      10
    )

    const { elements: newElements, container: newContainer } = createTestElements(scenario.elements, scenario.words)
    const newResult = benchmark(
      `New (${scenario.description})`,
      () => {
        newElements.forEach((el, i) => {
          el.innerHTML = ''
          el.className = `perf-test-${i}`
          const words = []
          for (let j = 0; j < scenario.words; j++) {
            words.push(`word${j}`)
          }
          el.textContent = words.join(' ')
        })
        shaveNew(newElements, scenario.height)
      },
      10
    )

    const { elements: delimiterElements, container: delimiterContainer } = createTestElements(scenario.elements, scenario.words)
    const delimiterResult = benchmark(
      `New with delimiter (${scenario.description})`,
      () => {
        delimiterElements.forEach((el, i) => {
          el.innerHTML = ''
          el.className = `perf-test-${i}`
          const words = []
          for (let j = 0; j < scenario.words; j++) {
            words.push(`word${j}`)
          }
          el.textContent = words.join('\n')
        })
        shaveNew(delimiterElements, scenario.height, { delimiter: '\n' })
      },
      10
    )

    cleanupTestElements(oldContainer)
    cleanupTestElements(newContainer)
    cleanupTestElements(delimiterContainer)

    results.push({ oldResult, newResult, delimiterResult, scenario })

    const regression = ((newResult.avg - oldResult.avg) / oldResult.avg) * 100
    const regressionColor = regression > 5 ? '🔴' : regression > 0 ? '🟡' : '🟢'

    console.log(`  Old implementation: ${oldResult.avg.toFixed(2)}ms (avg)`)
    console.log(`  New implementation: ${newResult.avg.toFixed(2)}ms (avg)`)
    console.log(`  New with delimiter: ${delimiterResult.avg.toFixed(2)}ms (avg)`)
    console.log(`  ${regressionColor} Performance change: ${regression > 0 ? '+' : ''}${regression.toFixed(2)}%\n`)
  }

  console.log('📈 Performance Test Summary:')
  console.log('=' .repeat(50))

  let totalRegression = 0
  let maxRegression = -Infinity
  let hasSignificantRegression = false

  results.forEach(({ oldResult, newResult, delimiterResult, scenario }) => {
    const regression = ((newResult.avg - oldResult.avg) / oldResult.avg) * 100
    totalRegression += regression
    maxRegression = Math.max(maxRegression, regression)

    if (regression > 5) {
      hasSignificantRegression = true
    }

    console.log(`${scenario.description}:`)
    console.log(`  Regression: ${regression > 0 ? '+' : ''}${regression.toFixed(2)}%`)
    console.log(`  Old: ${oldResult.avg.toFixed(2)}ms, New: ${newResult.avg.toFixed(2)}ms, Delimiter: ${delimiterResult.avg.toFixed(2)}ms`)
  })

  const avgRegression = totalRegression / results.length
  console.log(`\nAverage regression: ${avgRegression > 0 ? '+' : ''}${avgRegression.toFixed(2)}%`)
  console.log(`Maximum regression: ${maxRegression > 0 ? '+' : ''}${maxRegression.toFixed(2)}%`)

  if (hasSignificantRegression) {
    console.log('\n❌ SIGNIFICANT PERFORMANCE REGRESSION DETECTED (>5%)')
    throw new Error('Performance regression test failed')
  } else if (avgRegression > 2) {
    console.log('\n⚠️  Minor performance regression detected, but within acceptable range')
  } else {
    console.log('\n✅ No significant performance regression detected')
  }

  return results
}

if (typeof window !== 'undefined' && window.document) {
  window.runPerformanceTests = runPerformanceTests
} else {
  module.exports = { runPerformanceTests, benchmark, createTestElements, cleanupTestElements }
}
