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

function getFileSize(file) {
  return statSync(file).size
}

function checkBundleSize(file, baseline) {
  const actual = getFileSize(file)
  const limit = Math.ceil(baseline * perFileGrowthLimit)
  const isWithinLimit = actual <= limit
  const status = isWithinLimit ? 'ok' : 'too large'
  console.log(`${status}: ${file} (${actual} bytes, limit ${limit})`)
  return isWithinLimit
}

function checkTotalSize() {
  const actual = [...bundleBaselines.keys()].reduce((total, file) => total + getFileSize(file), 0)
  const isWithinLimit = actual <= totalBaseline
  const status = isWithinLimit ? 'ok' : 'too large'
  console.log(`${status}: dist total (${actual} bytes, limit ${totalBaseline})`)
  return isWithinLimit
}

const bundlesAreWithinLimit = [...bundleBaselines].every(([file, baseline]) => checkBundleSize(file, baseline))
const totalIsWithinLimit = checkTotalSize()

if (!bundlesAreWithinLimit || !totalIsWithinLimit) process.exitCode = 1
