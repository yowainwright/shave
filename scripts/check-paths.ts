import { execFileSync, spawnSync, type StdioOptions } from 'node:child_process'
import { existsSync } from 'node:fs'

const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
  encoding: 'utf8',
})
const paths = output.split('\0')
const existing = paths.filter((path) => {
  const exists = Boolean(path) && existsSync(path)
  return exists
})
const input = existing.join('\0') + '\0'
const stdio: StdioOptions = ['pipe', 'inherit', 'inherit']
const result = spawnSync('fs-lint', ['check', '--stdin0'], { input, stdio })
if (result.error) throw result.error
process.exitCode = result.status ?? 1
