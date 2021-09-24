import shave from './shave'

declare global {
  interface Window {
    $: any
    jQuery: any
    Zepto: any
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
