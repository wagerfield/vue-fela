var Renderer = require('./renderer')

function created() {
  var renderer = this.$fela
  var tagId = this.metaTagId
  var isClient = !this.$isServer
  var ssr = this.$isServer && this.ssr
  var metaInfo = Renderer.renderServerStyles(renderer, tagId)
  if (isClient || ssr) this.$options[this.metaKeyName] = metaInfo
  if (isClient) Renderer.renderClientStyles(renderer)
}

function render(createElement) {
  return createElement(this.tag, {
    props: this.props
  }, this.$slots.default)
}

module.exports = {
  created: created,
  render: render,
  props: {
    ssr: {
      type: Boolean,
      default: true
    },
    tag: {
      type: String,
      default: 'div'
    },
    props: {
      type: Object
    },
    metaTagId: {
      type: String,
      default: 'hid'
    },
    metaKeyName: {
      type: String,
      default: 'head'
    }
  }
}
