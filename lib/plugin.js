var DOM = require('./dom')

function isRoot(vm) {
  return vm === vm.$root
}

function plugin(Vue, options) {
  var renderer = options && options.renderer

  if (renderer) {

    var vue = new Vue()
    var ssr = options.ssr !== false
    var ssrMetaCache = options.ssrMetaCache || '_felaMeta'
    var metaKeyName = options.metaKeyName || 'head'
    var metaTagId = options.metaTagId || 'hid'
    var autoRender = options.autoRender !== false

    var mixin = {
      provide: function provide() {
        return isRoot(this) ? {
          fela: renderer
        } : null
      }
    }

    if (autoRender) {
      if (vue.$isServer) {
        if (ssr) {
          mixin[metaKeyName] = function meta() {
            return this.$root[ssrMetaCache] ? {} : (this.$root[ssrMetaCache] = {
              style: DOM.renderServerStyles(renderer, metaTagId)
            })
          }
        }
      } else {
        DOM.renderClientStyles(renderer)
      }
    }

    Vue.mixin(mixin)

    Vue.prototype.$fela = renderer

  } else {
    throw new Error('[vue-fela] requires a renderer option')
  }
}

module.exports = plugin
