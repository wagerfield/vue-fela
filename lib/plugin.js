var Provider = require('./provider')

function setupFela() {
  var options = this.$options
  if (options.fela) {
    this.$fela = options.fela
  } else if (options.parent && options.parent.$fela) {
    this.$fela = options.parent.$fela
  }
}

function plugin(Vue) {

  Vue.component('fela', Provider)

  Vue.mixin({ beforeCreate: setupFela })
}

module.exports = plugin
