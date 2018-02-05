var FelaProvider = require('./provider')

function bindFela() {
  var options = this.$options
  if (options.fela) {
    this.$fela = options.fela
  } else if (options.parent && options.parent.$fela) {
    this.$fela = options.parent.$fela
  }
}

function plugin(Vue) {
  Vue.component('fela', FelaProvider)
  Vue.mixin({ beforeCreate: bindFela })
}

module.exports = plugin
