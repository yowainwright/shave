import type shave from '../../src/shave'

type Implementation = typeof shave
type Fixture = { container: HTMLDivElement; elements: HTMLDivElement[] }

const paragraph = 'Shave keeps the original text while shortening visible text to fit the available height. '
const benchmarkText = paragraph.repeat(12)
const regressionText = 'Words | 中文日本語 | العربية | emoji 👨‍👩‍👧‍👦 | more text to wrap across several lines. '.repeat(8)
const elementStyle = 'width: 100%; height: 90px; max-height: 100px; padding: 2px; border: 1px solid;'
const flexStyle = 'flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere;'

export async function compareLayouts(layouts: string[]) {
  const baselinePath = '/tests/performance/shave-baseline.ts'
  const currentPath = '/dist/shave.mjs'
  const { default: baseline } = await import(baselinePath)
  const { default: current } = await import(currentPath)
  const delimiterOptions = { spaces: false, delimiter: '|', character: '...' }
  const link = { href: '/more', className: '', textContent: 0, download: true, 'data-count': 2 }
  const options = [...comparisonOptions(), delimiterOptions, { link }]
  const compareLayout = (layout: string) =>
    options.map((opts) => {
      const before = runLayout(baseline, layout, opts)
      const after = runLayout(current, layout, opts)
      const matches = JSON.stringify(before) === JSON.stringify(after)
      const result = { layout, opts, matches }
      return result
    })
  const results = layouts.flatMap(compareLayout)
  return results
}

export async function benchmarkBatching() {
  const baselinePath = '/tests/performance/shave-baseline.ts'
  const currentPath = '/src/shave.ts'
  const { default: baseline } = await import(baselinePath)
  const { default: current } = await import(currentPath)
  const options = comparisonOptions()
  const independent = options.map((opts) => compare(baseline, current, false, opts))
  const coupled = options.map((opts) => compare(baseline, current, true, opts))
  const initial = benchmark(baseline, current, false)
  const resize = benchmark(baseline, current, true)
  const results = { independent, coupled, initial, resize }
  return results
}

export async function compareFloatingLayouts() {
  const baselinePath = '/tests/performance/shave-baseline.ts'
  const currentPath = '/dist/shave.mjs'
  const { default: baseline } = await import(baselinePath)
  const { default: current } = await import(currentPath)
  const cases = [
    ['auto', false, 'block'],
    ['20px', false, 'block'],
    ['90px', false, 'block'],
    ['auto', true, 'block'],
    ['20px', true, 'block'],
    ['90px', true, 'block'],
    ['auto', false, 'flow-root'],
    ['auto', true, 'flow-root'],
  ] as const
  const results = cases.map(([height, outside, display]) => {
    const before = captureFloatingLayout(baseline, height, outside, display)
    const after = captureFloatingLayout(current, height, outside, display)
    const result = { height, outside, before, after }
    return result
  })
  return results
}

function captureFloatingLayout(implementation: Implementation, height: string, outside: boolean, display: string) {
  const { container, elements } = floatingFixture(height, outside, display)
  implementation(elements, 60)
  const nodes = snapshot(elements)
  const range = document.createRange()
  range.selectNodeContents(elements[1])
  const textHeight = range.getBoundingClientRect().height
  container.remove()
  const result = { nodes, textHeight }
  return result
}

function floatingFixture(height: string, outside: boolean, display: string): Fixture {
  const container = document.createElement('div')
  const parent = document.createElement('div')
  container.style.cssText = 'width:240px;font:16px/20px Arial'
  parent.style.width = '240px'
  const floating = document.createElement('div')
  floating.style.cssText = 'float:left;width:120px;height:120px'
  const floatParent = outside ? container : parent
  floatParent.appendChild(floating)
  const text =
    'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty '.repeat(
      4,
    )
  const elements = Array.from({ length: 2 }, () => {
    const element = document.createElement('div')
    element.style.cssText = `width:100%;height:${height};max-height:100px;display:${display}`
    element.textContent = text
    parent.appendChild(element)
    return element
  })
  container.appendChild(parent)
  document.body.appendChild(container)
  const fixture = { container, elements }
  return fixture
}

function comparisonOptions(): Parameters<Implementation>[2][] {
  const link = { href: '/more', textContent: 'Read more', className: 'more' }
  const options = [
    {},
    { character: '...', classname: 'hidden', charclassname: 'marker' },
    { spaces: false },
    { delimiter: '|' },
    { link },
  ]
  return options
}

function runLayout(implementation: Implementation, layout: string, opts: Parameters<Implementation>[2]) {
  const { outer, parent, elements } = regressionFixture(layout)
  const snapshots: string[] = []
  const heights = [64, 44, 10_000, 0, 64]
  for (const [index, height] of heights.entries()) {
    if (layout !== 'intrinsic') parent.style.width = `${240 - index * 10}px`
    let error = ''
    try {
      implementation(elements, height, opts)
    } catch (caught) {
      error = (caught as Error).name
    }
    const nodes = snapshot(elements)
    const state = JSON.stringify({ nodes, error })
    snapshots[snapshots.length] = state
    if (error) break
  }
  outer.remove()
  return snapshots
}

function regressionFixture(layout: string) {
  const outer = document.createElement('div')
  const parent = document.createElement('div')
  parent.style.cssText = 'width: 240px; font: 16px/20px Arial;'
  const flexible = layout === 'flex' || layout === 'grid'
  if (flexible) parent.style.display = layout
  if (layout === 'table') parent.style.display = 'table'
  if (layout === 'columns') parent.style.columnCount = '2'
  if (layout === 'float') parent.style.cssFloat = 'left'
  if (layout === 'intrinsic') parent.style.width = 'fit-content'
  if (layout === 'nested-flex') outer.style.display = 'flex'
  const elements = Array.from({ length: 8 }, (_, index) => {
    const element = document.createElement('div')
    element.textContent = index === 1 ? 'single' : regressionText.slice(index * 3)
    element.style.cssText = layout === 'flex' ? flexStyle : elementStyle
    if (layout === 'isolated-block') element.style.display = 'flow-root'
    parent.appendChild(element)
    return element
  })
  if (layout === 'overlap') elements[elements.length] = parent
  if (layout === 'duplicate') elements[elements.length] = elements[0]
  outer.appendChild(parent)
  document.body.appendChild(outer)
  const fixture = { outer, parent, elements }
  return fixture
}

function compare(
  baseline: Implementation,
  current: Implementation,
  coupled: boolean,
  opts: Parameters<Implementation>[2],
) {
  const original = captureResize(baseline, coupled, opts)
  const candidate = captureResize(current, coupled, opts)
  const initialMatches = JSON.stringify(original.initial) === JSON.stringify(candidate.initial)
  const resizeMatches = JSON.stringify(original.resized) === JSON.stringify(candidate.resized)
  const result = { initialMatches, resizeMatches }
  return result
}

function captureResize(implementation: Implementation, coupled: boolean, opts: Parameters<Implementation>[2]) {
  const fixture = benchmarkFixture(8, coupled)
  implementation(fixture.elements, 64, opts)
  const initial = snapshot(fixture.elements)
  fixture.container.style.width = '180px'
  implementation(fixture.elements, 44, opts)
  const resized = snapshot(fixture.elements)
  fixture.container.remove()
  const result = { initial, resized }
  return result
}

function snapshot(elements: HTMLElement[]) {
  const nodes = elements.map((element) => {
    const { innerHTML: html, style: styles } = element
    const { cssText: style } = styles
    const node = { html, style }
    return node
  })
  return nodes
}

function benchmark(baseline: Implementation, current: Implementation, resize: boolean) {
  sample(baseline, resize)
  sample(current, resize)
  const pairs = Array.from({ length: 9 }, (_, index) => samplePair(baseline, current, resize, index))
  const before = pairs.map((pair) => pair.before)
  const after = pairs.map((pair) => pair.after)
  const baselineMs = median(before)
  const currentMs = median(after)
  const speedup = baselineMs / currentMs
  const results = { baselineMs, currentMs, speedup }
  return results
}

function samplePair(baseline: Implementation, current: Implementation, resize: boolean, index: number) {
  const currentFirst = index % 2 !== 0
  if (currentFirst) {
    const after = sample(current, resize)
    const before = sample(baseline, resize)
    const pair = { before, after }
    return pair
  }
  const before = sample(baseline, resize)
  const after = sample(current, resize)
  const pair = { before, after }
  return pair
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = sorted[4]
  return middle
}

function sample(implementation: Implementation, resize: boolean) {
  const fixture = benchmarkFixture(100)
  if (resize) implementation(fixture.elements, 64)
  fixture.container.style.width = resize ? '180px' : '240px'
  void fixture.container.offsetHeight
  const start = performance.now()
  implementation(fixture.elements, 44)
  const duration = performance.now() - start
  fixture.container.remove()
  return duration
}

function benchmarkFixture(count: number, coupled = false): Fixture {
  const container = document.createElement('div')
  container.style.cssText = 'width: 240px; font: 16px/20px Arial;'
  if (coupled) {
    container.style.display = 'flex'
    container.style.width = '900px'
  }
  const elements = Array.from({ length: count }, (_, index) => {
    const element = document.createElement('div')
    element.textContent = benchmarkText.slice(0, benchmarkText.length - index * 3).replaceAll(' ', '| ')
    element.style.cssText = coupled ? flexStyle : elementStyle
    if (!coupled) element.style.display = 'flow-root'
    container.appendChild(element)
    return element
  })
  document.body.appendChild(container)
  const fixture = { container, elements }
  return fixture
}
