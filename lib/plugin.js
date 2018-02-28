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

function plugin(Vue) {
  Vue.mixin({ beforeCreate: bindFela })
  Vue.component('fela', FelaProvider)
}

module.exports = plugin
