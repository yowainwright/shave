import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const setupPath = resolve(process.cwd(), 'scripts/setup.sh')
const temporaryRepositories: string[] = []

function createRepository(): string {
  const repositoryPath = mkdtempSync(join(process.cwd(), 'node_modules', '.shave-setup-'))
  execFileSync('git', ['init', '--quiet'], { cwd: repositoryPath })
  temporaryRepositories.push(repositoryPath)
  return repositoryPath
}

function runSetup(repositoryPath: string, env: NodeJS.ProcessEnv = {}) {
  return spawnSync(setupPath, ['--hooks-only'], {
    cwd: repositoryPath,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
}

function getHooksPath(repositoryPath: string): string {
  return execFileSync('git', ['config', '--local', '--get', 'core.hooksPath'], {
    cwd: repositoryPath,
    encoding: 'utf8',
  }).trim()
}

afterEach(() => {
  temporaryRepositories.splice(0).forEach((repositoryPath) => {
    rmSync(repositoryPath, { recursive: true, force: true })
  })
})

describe('setup hooks', () => {
  it('configures Git and installs all managed hooks', () => {
    const repositoryPath = createRepository()
    const result = runSetup(repositoryPath)
    const hooksPath = join(repositoryPath, '.git', 'hooks')

    expect(result.status).toBe(0)
    expect(getHooksPath(repositoryPath)).toBe('.git/hooks')

    for (const hookName of ['pre-commit', 'commit-msg', 'post-merge']) {
      const hookPath = join(hooksPath, hookName)
      expect(existsSync(hookPath)).toBe(true)
      expect(statSync(hookPath).mode & 0o111).not.toBe(0)
      expect(readFileSync(hookPath, 'utf8')).toContain('shave-managed-hook')
    }

    expect(readFileSync(join(hooksPath, 'pre-commit'), 'utf8')).toContain('pnpm run pre-commit')
    expect(readFileSync(join(hooksPath, 'post-merge'), 'utf8')).toContain('./scripts/setup.sh')
  })

  it('validates conventional commit messages', () => {
    const repositoryPath = createRepository()
    runSetup(repositoryPath)
    const messagePath = join(repositoryPath, 'COMMIT_EDITMSG')
    const hookPath = join(repositoryPath, '.git', 'hooks', 'commit-msg')

    writeFileSync(messagePath, 'feat: add setup tests\n')
    const validResult = spawnSync(hookPath, [messagePath], { encoding: 'utf8' })

    writeFileSync(messagePath, 'add setup tests\n')
    const invalidResult = spawnSync(hookPath, [messagePath], { encoding: 'utf8' })

    expect(validResult.status).toBe(0)
    expect(invalidResult.status).toBe(1)
    expect(invalidResult.stdout).toContain('Invalid commit message format')
  })

  it('preserves unmanaged hooks', () => {
    const repositoryPath = createRepository()
    const hookPath = join(repositoryPath, '.git', 'hooks', 'pre-commit')
    const unmanagedHook = '#!/bin/sh\nexit 42\n'

    writeFileSync(hookPath, unmanagedHook)
    const result = runSetup(repositoryPath)

    expect(result.status).toBe(0)
    expect(readFileSync(hookPath, 'utf8')).toBe(unmanagedHook)
    expect(result.stdout).toContain('Skipped unmanaged pre-commit hook')
  })

  it('does not configure hooks in CI', () => {
    const repositoryPath = createRepository()
    const result = runSetup(repositoryPath, { CI: 'true' })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('CI environment detected')
    expect(() => getHooksPath(repositoryPath)).toThrow()
  })
})
