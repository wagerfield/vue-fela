var mapArray = require('fast-loops/lib/arrayMap').default
var felaDom = require('fela-dom')

// http://fela.js.org/docs/api/fela-dom/renderToMarkup
// https://github.com/declandewet/vue-meta#style-object

function mapStyle(style) {
  var tag = { once: true, type: 'text/css' }
  if (style.css) tag.cssText = style.css
  if (style.type) tag['data-fela-type'] = style.type
  if (style.rehydration) tag['data-fela-rehydration'] = style.rehydration
  if (style.support) tag['data-fela-support'] = style.support
  if (style.media) tag['media'] = style.media
  return tag
}

function renderServerStyles(renderer) {
  var styles = felaDom.renderToSheetList(renderer)
  return mapArray(styles, mapStyle)
}

function renderClientStyles(renderer) {
  felaDom.rehydrate(renderer)
  felaDom.render(renderer)
}

module.exports = {
  renderServerStyles: renderServerStyles,
  renderClientStyles: renderClientStyles,
  mapStyle: mapStyle
}
