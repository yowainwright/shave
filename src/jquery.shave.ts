import shave, { Opts } from './shave'

interface Plugin {
  fn: {
    shave: (maxHeight: number, opts?: Opts) => void
  }
}

declare global {
  interface Window {
    $: Plugin
    jQuery: Plugin
    Zepto: Plugin
  }
}

if (typeof window !== 'undefined') {
  const plugin = window.$ || window.jQuery || window.Zepto
  if (plugin) {
    plugin.fn.shave = function shavePlugin(maxHeight, opts) {
      shave(this, maxHeight, opts)
      return this
    }
  }
}
