var DOM = require('./dom')

function isRoot(vm) {
  return vm === vm.$root
}

function plugin(Vue, options) {
  var renderer = options && options.renderer

  if (renderer) {

    var vue = new Vue()
    var ssr = options.ssr !== false
    var stylesCache = options.stylesCache || '_felaStyles'
    var metaKeyName = options.metaKeyName || 'head'
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
            var metaInfo = {}
            if (!this.$root[stylesCache]) {
              var styles = DOM.renderServerStyles(renderer)
              this.$root[stylesCache] = metaInfo.style = styles
            }
            return metaInfo
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
