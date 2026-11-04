import { statSync } from 'node:fs'

// Baselines are the published shave@5.1.0 bundle sizes.
const bundleBaselines = new Map([
  ['dist/shave.global.js', 2632],
  ['dist/jquery.shave.global.js', 2265],
  ['dist/shave.mjs', 1903],
  ['dist/jquery.shave.mjs', 1990],
  ['dist/shave.cjs', 3519],
  ['dist/jquery.shave.cjs', 2833],
])

const totalBaseline = [...bundleBaselines.values()].reduce((total, size) => total + size, 0)
const perFileGrowthLimit = 1.35

const bundlesAreWithinLimit = [...bundleBaselines].every(([file, baseline]) => checkBundleSize(file, baseline))
const totalIsWithinLimit = checkTotalSize()

const exceedsLimit = !bundlesAreWithinLimit || !totalIsWithinLimit
if (exceedsLimit) process.exitCode = 1

function checkBundleSize(file: string, baseline: number): boolean {
  const actual = getFileSize(file)
  const limit = Math.ceil(baseline * perFileGrowthLimit)
  const isWithinLimit = actual <= limit
  const status = isWithinLimit ? 'ok' : 'too large'
  console.log(`${status}: ${file} (${actual} bytes, limit ${limit})`)
  return isWithinLimit
}

function checkTotalSize(): boolean {
  const actual = [...bundleBaselines.keys()].reduce((total, file) => total + getFileSize(file), 0)
  const isWithinLimit = actual <= totalBaseline
  const status = isWithinLimit ? 'ok' : 'too large'
  console.log(`${status}: dist total (${actual} bytes, limit ${totalBaseline})`)
  return isWithinLimit
}

function getFileSize(file: string): number {
  const { size } = statSync(file)
  return size
}
