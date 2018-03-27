# [Fela][fela] plugin for [Vue][vue]

![build](https://img.shields.io/travis/wagerfield/vue-fela.svg)
![coveralls](https://img.shields.io/coveralls/github/wagerfield/vue-fela.svg)
![issues](https://img.shields.io/github/issues/wagerfield/vue-fela.svg)
![license](https://img.shields.io/github/license/wagerfield/vue-fela.svg)

- [Installation](#installation)
- [Usage](#usage)
  - [Rendering Rules](#rendering-rules)
    - [mapRule(rule, optProps)](#map-rule)
    - [mapRules(rules, optMap, optProps)](#map-rules)
    - [mapStyles(rules, optMap, optProps)](#map-styles)
    - [renderRule(renderer, rule, props)](#render-rule)
    - [renderRules(renderer, rules, props, optMap)](#render-rules)
  - [Rendering Styles](#rendering-styles)
    - [Plugin Options](#plugin-options)
    - [Universal Rendering](#universal-rendering)
    - [Nuxt Example](#nuxt-example)
- [Tests](#tests)

## Installation

```bash
yarn add vue-fela
```

## Usage

```js
import Vue from 'vue'
import VueFela from 'vue-fela'
import { createRenderer } from 'fela'

// 1. Create a Fela renderer
const renderer = createRenderer()

// 2. Install the plugin and pass the renderer as an option
Vue.use(VueFela, { renderer })
```

When the plugin is installed, a `$fela` property is set on Vue's `prototype` making it available on each component instance. The `$fela` property provides a reference to the [Fela Renderer][fela-renderer] instance that was passed as an option when the plugin was installed.

The Fela Renderer instance is also [provided][vue-provide-inject] through the `inject` interface on a `fela` key. This allows you to access the renderer within [functional Vue components][vue-functional].

**Check out a full working [example using Nuxt](example).**

## Rendering Rules

Since a [Fela Renderer][fela-renderer] instance is assigned to Vue's `prototype`, you can reference and use within a Vue component via `this.$fela`.

See the [Single File Component][vue-sfc] example below:

```html
<template>
  <div :class="className"/>
</template>

<script>
const rule = (props) => ({
  color: props.color,
  margin: 10
})

export default {
  props: {
    color: {
      type: String,
      default: 'red'
    }
  },
  computed: {
    className() {
      return this.$fela.renderRule(rule, this)
    }
  }
}
</script>
```

In the example above, we are passing `this` as the rule's `props` to Fela's `renderRule` function. Doing so will give the rule access to all the component instance properties such as `color` to derive the styles.

You can of course pass any arbitrary `props` object as the second argument to `renderRule`.

<a name="map-rule"></a>

### mapRule(rule, optProps)

To save having to define a computed prop function and return `this.$fela.renderRule(rule, props)` each time, a `mapRule` helper is provided:

```html
<template>
  <div :class="className"/>
</template>

<script>
import { mapRule } from 'vue-fela'

const rule = (props) => ({
  color: props.color,
  margin: 10
})

export default {
  props: {
    color: {
      type: String,
      default: 'red'
    }
  },
  computed: {
    className: mapRule(rule)
  }
}
</script>
```

Passing `optProps` as the second argument to `mapRule` is _optional_.

If `optProps` is omitted (like in the example above) then the Vue component instance will be passed by default. Typically this is the desired behaviour since a component's styles will generally want to be the result of its state.

In the example above, the `color` prop can be configured by a parent component. This value will then be available within the component instance via `this.color`. If `color` is not set by the parent component, it will default to 'red' since we have set the `default` field in the `props` color definition.

As you might expect, _all properties and methods_ on a Vue component instance can be used within a rule:

- `props` values set by parent components
- `data` values set when the component is initialised
- `computed` values derived from other properties and state
- `methods` that return values

Since the class names being returned from `mapRule` are assigned to the component's `computed` props object, any change in state referenced by a rule will trigger an update and return new class names.

<a name="map-rules"></a>

### mapRules(rules, optMap, optProps)

Taking it one step further, the `mapRules` helper repeats the work of `mapRule`—but expects an object map of `rules` rather than a single `rule` function:

```html
<template>
  <div :class="container">
    <h1 :class="heading">Kitten Socks</h1>
    <p :class="body">The purrrfect gift for your cat.</p>
  </div>
</template>

<script>
import { mapRules } from 'vue-fela'

const rules = {
  // We can use object destructuring on the rule props
  container: ({ highlight, textAlign }) => ({
    backgroundColor: highlight ? '#DDF' : '#DDD',
    padding: 16,
    textAlign
  }),
  heading: ({ highlight }) => ({
    fontWeight: highlight ? 700 : 400,
    fontSize: 24
  }),
  body: ({ highlight }) => ({
    color: highlight ? '#F00' : '#888',
    fontSize: 16
  })
}

export default {
  props: {
    highlight: {
      type: Boolean,
      default: false
    },
    textAlign: {
      type: String,
      default: 'left'
    }
  },
  computed: mapRules(rules)
}
</script>
```

Writing all your rules in a component can start to get a little cumbersome, so you might want to consider breaking them out into a separate file:

```js
// component-rules.js
export default {
  container: ({ highlight, textAlign }) => ({
    backgroundColor: highlight ? '#DDF' : '#DDD',
    padding: 16,
    textAlign
  }),
  heading: ({ highlight }) => ({
    fontWeight: highlight ? 700 : 400,
    fontSize: 24
  }),
  body: ({ highlight }) => ({
    color: highlight ? '#08F' : '#888',
    fontSize: 16
  })
}
```

...and then `import` them into your Vue component:

```html
<template>
  <div :class="container">
    <h1 :class="heading">Kitten Socks</h1>
    <p :class="body">The purrrfect gift for your cat.</p>
  </div>
</template>

<script>
import { mapRules } from 'vue-fela'
import rules from './component-rules'

export default {
  props: {
    highlight: {
      type: Boolean
    },
    textAlign: {
      type: String,
      default: 'left'
    }
  },
  computed: mapRules(rules)
}
</script>
```

Calling `mapRules(rules, optMap, optProps)` with no `optMap` argument will result in all `rules` being returned and assigned to the component's `computed` props.

In the example above, this would assign `container`, `heading` and `body` to the component's `computed` props. These 3 props can then be used as class names on the 3 respective elements in the template.

This behaviour might not always be desirable, so `mapRules` provides another level of control with the `optMap` argument.

If you have used [Vuex's mapping helpers][vuex-helpers] the following interface should look familiar to you.

#### optMap

The `optMap` argument can either be:

1. An Array of Strings where:
    - String values are the names of the rules to include in the object that is returned
    - This allows you to filter out only the rules you require
    - It does not allow you to rename the rules
2. An Object of key values where:
    - Keys are aliases to use as the computed prop names in the object that is returned
    - Values are the names of the rules in the object map
    - This allows you to both filter and rename rules

For example, using the same component and rules map from the example above:

```html
<template>
  <div :class="container">
    <h1 :class="title">Kitten Socks</h1>
    <p>The purrrfect gift for your cat.</p>
  </div>
</template>

<script>
import { mapRules } from 'vue-fela'
import rules from './component-rules'

export default {
  props: {
    highlight: {
      type: Boolean
    },
    textAlign: {
      type: String,
      default: 'left'
    }
  },
  computed: {
    ...mapRules(rules, [
      'container' // Only return the container rule
    ]),
    ...mapRules(rules, {
      title: 'heading' // Only return the heading rule, but rename it to 'title'
    })
  }
}
</script>
```

In the example above you can see that we have used the [object spread operator][object-spread] to merge multiple calls to `mapRules` onto the component's `computed` props object. We have also omitted the `body` rule from the `component-rules.js` map.

#### optProps

Finally, much like the `mapRule` helper, `optProps` can be passed as the _third argument_ to `mapRules`. Omitting `optProps` will result in the component instance being passed to each of the rules as the `props` argument by default.

<a name="map-styles"></a>

### mapStyles(rules, optMap, optProps)

If your component has properties that clash with your rule names when mapping them to the `computed` object—you have a couple of options:

1. Pass an `optMap` argument to `mapRules` to alias your rule names to different ones eg. `iconClass: 'icon'`
2. Use a naming convention for all your rules that separates them from your component `props` eg. `iconRule` or `iconClass`

The first option requires more code in your components. The second option compromises the precise naming of your rules. Neither options are ideal.

As a third option you can use the `mapStyles` helper.

This helper works in _exactly the same way_ as `mapRules`, but rather than returning an object map of computed prop functions, it returns a single computed function.

The computed function returned from the `mapStyles` helper will then return an object map of class names that are the result of rendering your `rules`.

This allows you to assign all your rules to a single `computed` property eg. `styles` and render the result of each rule within your template using dot syntax eg. `styles.icon`:

```html
<template>
  <div>
    <svg :class="styles.icon">...</svg>
    <span :class="styles.text">{icon}</span>
  </div>
</template>

<script>
import { mapStyles } from 'vue-fela'

const rules = {
  // Here we have a rule name that is the
  // same as one of the component props
  icon: ({ size, color }) => ({
    width: size,
    height: size,
    fill: color
  }),
  text: ({ size, color }) => ({
    fontSize: size,
    color
  })
}

export default {
  props: {
    icon: {
      type: String
    },
    size: {
      type: Number,
      default: 16
    },
    color: {
      type: 'String',
      default: 'red'
    }
  },
  computed: {
    // All rules are assigned to a single computed 'styles'
    // property and do not clash with any other props
    styles: mapStyles(rules)
  }
}
</script>
```

The function signature of `mapStyles(rules, optMap, optProps)` is identical to `mapRules(rules, optMap, optProps)`.

[Read the documentation](#optmap) on `optMap` and `optProps` above.

<a name="render-rule"></a>

### renderRule(renderer, rule, props)

When creating [functional Vue components][vue-functional] you can `inject` the Fela Renderer instance via the `fela` key:

```js
export default {
  functional: true,
  inject: [ 'fela' ],
  render(h, { data, children, injections }) {
    // Reference to Fela Renderer instance
    const renderer = injections.fela
    return h('span', data, children)
  }
}
```

To render a single Fela `rule` you can either use the Fela Renderer instance's `renderRule` method directly or you can use the `renderRule` helper provided by Vue Fela. They do exactly the same thing—this is just a matter of style:

```js
import { renderRule } from 'vue-fela'

const rule = ({ size }) => ({ width: size, height: size })

export default {
  functional: true,
  inject: [ 'fela' ],
  props: { size: Number },
  render(h, { props, children, injections }) {
    const renderer = injections.fela
    // The following 2 lines return exactly the same value
    const class1 = renderRule(renderer, rule, props)
    const class2 = renderer.renderRule(rule, props)
    // class1 === class2
    return h('span', {
      class: [ class1, class2 ] // a b
    }, children)
  }
}
```

<a name="render-rules"></a>

### renderRules(renderer, rules, props, optMap)

When using an object map of `rules` within a [functional Vue component][vue-functional] you can use the `renderRules` helper provided by Vue Fela:

```js
import { renderRules } from 'vue-fela'

const rules = {
  container: ({ fillColor }) => ({
    backgroundColor: fillColor,
    padding: '8px'
  }),
  text: ({ textColor }) => ({
    color: textColor,
    fontSize: '16px'
  }),
}

export default {
  functional: true,
  inject: [ 'fela' ],
  props: {
    fillColor: String,
    textColor: String
  },
  render(h, { props, children, injections }) {
    const renderer = injections.fela
    const styles = renderRules(renderer, rules, props)
    return h('div', {
      class: styles.container
    }, [
      h('span', {
        class: styles.text
      }, children)
    ])
  }
}
```

You can also optionally pass `optMap` as the final argument to the `renderRules` helper.

This works in exactly the same way as [documented above](#optmap) in the `mapRules` helper.

## Rendering Styles

To render the styles cached by the Fela Renderer we need to use `fela-dom`.

However, since Fela works on both the [client][fela-client] and the [server][fela-server], the method for rendering the cached styles differs between environments.

To simplify this, `VueFela` handles the logic of determining what to do in each environment automatically.

### Plugin Options

You can disable automatic rendering via the plugin options when installing `VueFela`:

```js
import Vue from 'vue'
import VueFela from 'vue-fela'
import { createRenderer } from 'fela'
import { render } from 'fela-dom'

const renderer = createRenderer()

Vue.use(VueFela, {
  renderer, // required
  autoRender: false
})

render(renderer)
```

Options that can be configured when the plugin is installed are as follows:

Option | Type | Default | Description
----------|------|---------|------------
`renderer` | `Object` | | [Fela Renderer][fela-renderer] instance. **Required**
`autoRender` | `Boolean` | `true` | Enable/disable automatic rendering. When set to `false` the `ssr`, `metaKeyName` and `metaTagId` properties are ignored
`ssr` | `Boolean` | `true` | Enable/disable SSR
`metaKeyName` | `String` | `head` | Vue Meta `keyName` [option][vue-meta-options]<br>This is [configured to work with Nuxt][nuxt-meta] by default
`metaTagId` | `String` | `hid` | Vue Meta `tagIDKeyName` [option][vue-meta-options]<br>This is [configured to work with Nuxt][nuxt-meta] by default

An example using [Vue Meta's default values][vue-meta-options] while disabling SSR can be seen below:

```js
import Vue from 'vue'
import VueFela from 'vue-fela'
import { createRenderer } from 'fela'

Vue.use(VueFela, {
  renderer: createRenderer(), // required
  metaKeyName: 'metaInfo',
  metaTagId: 'vmid',
  ssr: false
})
```

### Universal Rendering

The easiest way to create universal Vue applications is with [Nuxt][nuxt]. Nuxt takes care of setting up the logic for rendering Vue components on the server and rehydrating them on the client.

Nuxt uses `vue-meta` to render and update tags in the `<head>` of your pages. [Vue Meta][vue-meta] provides the mechanism Vue Fela needs for rendering the cached styles on the server and sending them to the client.

Because of this, the `vue-fela` plugin is configured to work with `vue-meta` using [Nuxt's configuration options][nuxt-meta] by default.

### Nuxt Example

To setup Vue Fela with Nuxt you will need to create a file in the `plugins` directory:

```js
// plugins/fela.js
import Vue from 'vue'
import VueFela from 'vue-fela'
import { createRenderer } from 'fela'

// 1. Create a Fela renderer
const renderer = createRenderer()

// 2. Install the plugin and pass the renderer as an option
Vue.use(VueFela, { renderer })
```

Then add the plugin to Nuxt's configuration:

```js
// nuxt.config.js
module.exports = {
  plugins: [
    'plugins/fela'
  ]
}
```

**Check out a full working [example using Nuxt](example).**

## Tests

Tests are written using [`jest`][jest] and [`vue-test-utils`][vue-test-utils].

To run the tests after cloning the repository and installing its dependencies:

```bash
yarn test
```

To run the tests in watch mode:

```bash
yarn test-watch
```

To generate a coverage report:

```bash
yarn test-coverage
```

## Author

[Matthew Wagerfield][twitter]

## License

[MIT][mit]

[vue]: https://vuejs.org
[vue-sfc]: https://vuejs.org/v2/guide/single-file-components.html
[vue-functional]: https://vuejs.org/v2/guide/render-function.html#Functional-Components
[vue-provide-inject]: https://vuejs.org/v2/api/#provide-inject
[vue-before-create]: https://vuejs.org/v2/api/#beforeCreate

[vue-test-utils]: https://vue-test-utils.vuejs.org

[vue-meta]: https://github.com/declandewet/vue-meta
[vue-meta-options]: https://github.com/declandewet/vue-meta#options

[vuex-helpers]: https://vuex.vuejs.org/en/api.html#component-binding-helpers

[fela]: http://fela.js.org
[fela-client]: http://fela.js.org/docs/advanced/DOMRendering.html
[fela-server]: http://fela.js.org/docs/advanced/ServerRendering.html
[fela-renderer]: http://fela.js.org/docs/basics/Renderer.html

[nuxt]:https://nuxtjs.org
[nuxt-meta]:https://nuxtjs.org/guide/views#html-head

[object-spread]: https://github.com/tc39/proposal-object-rest-spread

[jest]: https://facebook.github.io/jest

[mit]: https://opensource.org/licenses/MIT

[twitter]: https://twitter.com/wagerfield
