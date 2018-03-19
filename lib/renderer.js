var mapArray = require('fast-loops/lib/arrayMap').default
var felaDom = require('fela-dom')

// http://fela.js.org/docs/api/fela-dom/renderToMarkup
// https://github.com/declandewet/vue-meta#style-object

function mapStyle(tagId) {
  return function createTag(style) {
    var tag = { type: 'text/css' }
    if (style.css) {
      tag.cssText = style.css
    }
    if (style.rehydration) {
      tag['data-fela-rehydration'] = style.rehydration
    }
    if (style.type) {
      tag['data-fela-type'] = style.type
      tag[tagId] = style.type.toLowerCase()
    }
    if (style.support) {
      tag['data-fela-support'] = style.support
      tag[tagId] += '[support]'
    }
    if (style.media) {
      tag['media'] = style.media
      tag[tagId] += style.media
    }
    return tag
  }
}

function renderServerStyles(renderer, tagId) {
  var styles = felaDom.renderToSheetList(renderer)
  return { style: mapArray(styles, mapStyle(tagId)) }
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
