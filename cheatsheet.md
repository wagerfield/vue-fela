# Vue + Fela Cheatsheet

- [Vue Plugin](#vue-plugin)
- [Fela Renderer Configuration](#fela-renderer-configuration)
- [Rendering Rules](#rendering-rules)
- [Rendering Fonts](#rendering-fonts)
- [Rendering Keyframes](#rendering-keyframes)
- [Rendering Static Styles](#rendering-static-styles)
- [Universal Rendering](#universal-rendering)

## [Vue Plugin](https://vuejs.org/v2/guide/plugins.html)

```js
const VueFela = {
  install(Vue, options) {
    Vue.prototype.$fela = createRenderer(options)
  }
}

Vue.use(VueFela, {
  enhancers: [],
  plugins: []
})
```

## [Fela Renderer Configuration](http://fela.js.org/docs/advanced/RendererConfiguration.html)

```js
import { createRenderer } from 'fela'

export const renderer = createRenderer({
  enhancers: [
    // fela-perf (dev)
    // fela-beautifier (dev)
    // fela-monolithic (dev)
    // fela-statistics (dev)
  ],
  plugins: [
    // fela-preset-dev
    // - fela-plugin-logger
    // - fela-plugin-validator
    // fela-preset-web
    // - fela-plugin-extend
    // - fela-plugin-embedded
    // - fela-plugin-prefixer
    // - fela-plugin-fallback-value
    // - fela-plugin-lvha
    // - fela-plugin-unit
    // fela-plugin-custom-property
    // fela-plugin-friendly-pseudo-class
    // fela-plugin-placeholder-prefixer
    // fela-plugin-remove-undefined
  ]
})
```

## [Rendering Rules](http://fela.js.org/docs/api/fela/Renderer.html#renderrulerule-props)

```js
import { combineRules } from 'fela'

const ruleA = ({ primary }) => ({
  backgroundColor: primary ? 'red' : 'green'
})

const ruleA = ({ primary }) => ({
  backgroundColor: primary ? 'orange' : 'blue'
})

const rulaAB = combineRules(ruleA, ruleB)
const rulaBA = combineRules(ruleB, ruleA)

renderer.renderRule(rulaAB, { primary: true })
renderer.renderRule(rulaBA, { primary: false })
```

## [Rendering Fonts](http://fela.js.org/docs/api/fela/Renderer.html#renderfontfamily-files-properties)

```js
const files = [
  './fonts/Lato.ttf',
  './fonts/Lato.woff'
]

renderer.renderFont('Lato', files, { fontWeight: 'bold' })
```

## [Rendering Keyframes](http://fela.js.org/docs/api/fela/Renderer.html#renderkeyframekeyframe-props)

```js
const keyframe = ({ fromColor, toColor }) => ({
  from: {
    color: fromColor
  },
  to: {
    color: toColor
  }
})

renderer.renderKeyframe(keyframe, { fromColor: 'blue', toColor: 'red' })
```

## [Rendering Static Styles](http://fela.js.org/docs/api/fela/Renderer.html#renderstaticstyle-selector)

```js
import normalize from 'normalize.css' // requires webpack style loader

renderer.renderStatic('html,body{box-sizing:border-box;margin:0}')
renderer.renderStatic(normalize) // string value
renderer.renderStatic({
  boxSizing: 'border-box'
}, '*, html, input')
```

## [Universal Rendering](http://fela.js.org/docs/Advanced.html)

```js
import { render, renderToMarkup } from 'fela-dom'

const isServer = typeof window === 'undefined'

if (isServer) {
  renderToMarkup(renderer)
} else {
  render(renderer)
}
```
