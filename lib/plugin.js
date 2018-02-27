var FelaProvider = require('./provider')

function bindFela() {
  var options = this.$options
  var parent = options.parent
  if (options.fela) {
    this.$fela = options.fela
  } else if (parent && parent.$fela) {
    this.$fela = parent.$fela
  }
}

function provideFela() {
  var fela = this.$options.fela
  return fela ? { fela: fela } : null
}

function plugin(Vue) {
  Vue.component('fela', FelaProvider)
  Vue.mixin({
    beforeCreate: bindFela,
    provide: provideFela
  })
}

module.exports = plugin
