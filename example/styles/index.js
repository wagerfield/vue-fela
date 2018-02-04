import { createRenderer } from 'fela'

const renderer = createRenderer()

renderer.renderStatic({
  fontFamily: 'Bungee Shade',
  margin: 0
}, 'body,h1')

export default renderer
