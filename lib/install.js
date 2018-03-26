var plugin = require('./plugin')

var localVue = null

function install(Vue, options) {
  if (Vue && localVue === Vue) {
    throw new Error([
      '[vue-fela] already installed.',
      'Vue.use(VueFela) should only be called once.'
    ].join(' '))
  } else {
    plugin(localVue = Vue, options)
  }
}

module.exports = install
