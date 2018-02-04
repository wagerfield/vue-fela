var Provider = require('./provider')

function plugin(Vue) {

  Vue.component('fela', Provider)

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      var options = this.$options
      if (options.fela) {
        this.$fela = options.fela
      } else if (options.parent && options.parent.$fela) {
        this.$fela = options.parent.$fela
      }
    }
  })
}

module.exports = plugin
