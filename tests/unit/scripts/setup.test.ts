import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const setupPath = resolve(process.cwd(), 'scripts/setup.sh')
const temporaryRepositories = new Set<string>()
const shellTestTimeout = 30_000

afterEach(() => {
  const repositories = Array.from(temporaryRepositories)
  temporaryRepositories.clear()
  repositories.forEach((repositoryPath) => {
    rmSync(repositoryPath, { recursive: true, force: true })
  })
})

describe('setup hooks', () => {
  it('configures Git and installs all managed hooks', verifyManagedHooks, shellTestTimeout)

  it(
    'validates conventional commit messages',
    () => {
      const repositoryPath = createRepository()
      runSetup(repositoryPath)
      const messagePath = join(repositoryPath, 'COMMIT_EDITMSG')

      writeFileSync(messagePath, 'feat: add setup tests\n')
      const validResult = runCommitMessageHook(repositoryPath, messagePath)

      writeFileSync(messagePath, 'add setup tests\n')
      const invalidResult = runCommitMessageHook(repositoryPath, messagePath)

      expect(validResult.status).toBe(0)
      expect(invalidResult.status).toBe(1)
      expect(invalidResult.stdout).toContain('Invalid commit message format')
    },
    shellTestTimeout,
  )

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

function runCommitMessageHook(repositoryPath: string, messagePath: string) {
  const hookPath = join(repositoryPath, '.git', 'hooks', 'commit-msg')
  const relativeHookPath = relativeBashPath(repositoryPath, hookPath)
  const relativeMessagePath = relativeBashPath(repositoryPath, messagePath)

  const result = spawnSync('bash', [relativeHookPath, relativeMessagePath], {
    cwd: repositoryPath,
    encoding: 'utf8',
  })
  return result
}

function verifyManagedHooks() {
  const repositoryPath = createRepository()
  const result = runSetup(repositoryPath)
  const hooksPath = join(repositoryPath, '.git', 'hooks')

  expect(result.status).toBe(0)
  expect(getHooksPath(repositoryPath)).toBe('.git/hooks')

  const hookNames = ['pre-commit', 'commit-msg', 'post-merge']
  hookNames.forEach((name) => expectManagedHook(join(hooksPath, name)))

  expect(readFileSync(join(hooksPath, 'pre-commit'), 'utf8')).toContain('pnpm run pre-commit')
  expect(readFileSync(join(hooksPath, 'post-merge'), 'utf8')).toContain('./scripts/setup.sh')
}

function createRepository(): string {
  const repositoryPath = mkdtempSync(join(process.cwd(), 'node_modules', '.shave-setup-'))
  execFileSync('git', ['init', '--quiet'], { cwd: repositoryPath })
  temporaryRepositories.add(repositoryPath)
  return repositoryPath
}

function runSetup(repositoryPath: string, env: NodeJS.ProcessEnv = {}) {
  const environment = createTestEnvironment(env)
  const result = spawnSync('bash', [relativeBashPath(repositoryPath, setupPath), '--hooks-only'], {
    cwd: repositoryPath,
    encoding: 'utf8',
    env: environment,
  })
  return result
}

function relativeBashPath(from: string, to: string): string {
  const path = relative(from, to).replaceAll('\\', '/')
  return path
}

function createTestEnvironment(overrides: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const environment = { ...process.env }
  delete environment.CI
  const configured = { ...environment, ...overrides }
  return configured
}

function getHooksPath(repositoryPath: string): string {
  const hooksPath = execFileSync('git', ['config', '--local', '--get', 'core.hooksPath'], {
    cwd: repositoryPath,
    encoding: 'utf8',
  }).trim()
  return hooksPath
}

function expectManagedHook(hookPath: string): void {
  expect(existsSync(hookPath)).toBe(true)
  if (process.platform !== 'win32') {
    expect(statSync(hookPath).mode & 0o111).not.toBe(0)
  }
  expect(readFileSync(hookPath, 'utf8')).toContain('shave-managed-hook')
}
