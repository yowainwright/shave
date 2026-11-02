import { defineConfig } from 'oxlint'
import legibility from 'oxlint-plugin-legibility'

const categories = { correctness: 'error' } as const
const env = { browser: true, jquery: true, node: true, vitest: true }
const ignorePatterns = ['dist/**', 'tests/performance/**']
const repositoryPolicy = defineConfig({ categories, env, ignorePatterns })

const config = Object.assign({}, legibility.configs.agentStrict, repositoryPolicy)

export default config
