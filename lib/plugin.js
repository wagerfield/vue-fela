var DOM = require('./dom')

function isRoot(vm) {
  return vm === vm.$root
}

function plugin(Vue, options) {
  var renderer = options && options.renderer
  var autoRender = options && options.autoRender !== false
  var metaKeyName = options && options.metaKeyName || 'head'
  var metaTagId = options && options.metaTagId || 'hid'
  var ssr = options && options.ssr !== false
  var vue = new Vue()

  if (renderer) {

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
          mixin.beforeCreate = function init() {
            if (isRoot(this)) this._hasRenderedStyles = false
          }
          mixin[metaKeyName] = function meta() {
            if (this.$root._hasRenderedStyles) {
              return {}
            } else {
              this.$root._hasRenderedStyles = true
              return {
                style: DOM.renderServerStyles(renderer, metaTagId)
              }
            }
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
