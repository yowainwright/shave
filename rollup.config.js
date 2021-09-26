import { author, description, homepage, license, name, version } from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

const banner = `/**
  ${name} - ${description}
  @version v${version}
  @link ${homepage}
  @author ${author}
  @license ${license}
**/`

const plugins = [
  resolve(),
  commonjs(),
  typescript({ tsconfig: false, lib: ['esnext', 'dom', 'dom.iterable'], target: 'es5', downlevelIteration: true }),
]

const inputs = ['shave', 'jquery.shave']
const esRollups = inputs.map((name) => ({
  input: `src/${name}.ts`,
  output: { banner, name, file: `dist/${name}.es.js`, format: 'es' },
  plugins,
}))

const umdRollups = inputs.map((name) => ({
  input: `src/${name}.ts`,
  output: { banner, name, file: `dist/${name}.js`, format: 'umd' },
  plugins,
}))

const minRollups = inputs.map((name) => ({
  input: `src/${name}.ts`,
  output: { banner, name, file: `dist/${name}.min.js`, format: 'umd' },
  plugins: [...plugins, uglify()],
}))

export default [...esRollups, ...umdRollups, ...minRollups]
