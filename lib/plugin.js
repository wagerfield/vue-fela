var DOM = require('./dom')

function isRoot(vm) {
  return vm === vm.$root
}

function plugin(Vue, options) {
  var renderer = options && options.renderer
  var metaTagId = options && options.metaTagId || 'hid'
  var metaKeyName = options && options.metaKeyName || 'head'
  var autoRender = options && options.autoRender !== false
  var ssr = options && options.ssr !== false

  if (typeof renderer === 'object') {

    var mixin = {
      provide: function provide() {
        return isRoot(this) ? {
          fela: renderer
        } : null
      },
      created: function created() {
        if (autoRender && isRoot(this) && !this.$isServer) {
          DOM.renderClientStyles(renderer)
        }
      }
    }

    if (autoRender && ssr) {
      mixin[metaKeyName] = function meta() {
        return {
          style: DOM.renderServerStyles(renderer, metaTagId)
        }
      }
    }

    Vue.mixin(mixin)

    Vue.prototype.$fela = renderer

  } else {
    throw new Error('[vue-fela] requires a renderer option')
  }
}

module.exports = plugin
