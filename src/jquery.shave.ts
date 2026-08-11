import shave, { Opts } from './shave'

interface PluginCollection extends ArrayLike<Node> {}

interface Plugin {
  fn: {
    shave(this: PluginCollection, maxHeight: number, opts?: Opts): PluginCollection
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
    plugin.fn.shave = function shavePlugin(this: PluginCollection, maxHeight, opts) {
      shave(this, maxHeight, opts)
      return this
    }
  }
}
