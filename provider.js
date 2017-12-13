var felaDom = require('fela-dom')
var utils = require('./utils')

var isClient = utils.isClient
var isServer = utils.isServer
var mapArray = utils.mapArray

module.exports = {
  beforeCreate: function beforeCreate() {
    if (isClient) {
      felaDom.rehydrate(this.$fela)
      felaDom.render(this.$fela)
    }
  },
  render: function render(createElement) {
    if (isServer) {
      var styles = felaDom.renderToSheetList(this.$fela)
      return createElement('template', mapArray(styles, function child(style) {
        return createElement('style', {
          dataFelaSupport: style.support,
          dataFelaType: style.type,
          media: style.media,
          type: 'text/css'
        }, style.css)
      }))
    } else {
      return null
    }
  }
}
