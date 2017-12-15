# VueFela

**[Fela][fela] plugin for [Vue][vue]**

- [Installation](#installation)
- [Usage](#usage)
    - [Fela Renderer Configuration](#fela-renderer-configuration)
    - [Custom Fela Renderer](#custom-fela-renderer)
    - [Rendering Rules](#rendering-rules)
        - [`mapRule(rule, optProps)`](#map-rule)
        - [`mapRules(rules, optMap, optProps)`](#map-rules)
    - [Rendering Styles](#rendering-styles)
        - [Fela Provider](#fela-provider)
- [Tests](#tests)

## Installation

```bash
yarn add vue-fela-plugin
```

## Usage

```js
import Vue from 'vue'
import VueFela from 'vue-fela-plugin'

Vue.use(VueFela)
```

Installing `VueFela` via `Vue.use` will create a [Fela Renderer][fela-renderer] instance ([unless one is provided](#custom-fela-renderer)) and add it to Vue's prototype on a `$fela` property.

### Fela Renderer Configuration

To configure the Fela Renderer instance, pass the [configuration options][fela-config] as the second argument to `Vue.use`.

Internally the plugin will pass these options to Fela's `createRenderer` function:

```js
import Vue from 'vue'
import VueFela from 'vue-fela-plugin'
import beautifier from 'fela-beautifier'
import prefixer from 'fela-plugin-prefixer'

Vue.use(VueFela, {
  enhancers: [
    beautifier()
  ],
  plugins: [
    prefixer()
  ]
})
```

### Custom Fela Renderer

To use your own Fela Renderer instance, pass it to the plugin configuration options using the `renderer` key:

```js
import Vue from 'vue'
import VueFela from 'vue-fela-plugin'
import beautifier from 'fela-beautifier'
import prefixer from 'fela-plugin-prefixer'
import { createRenderer } from 'fela'

export const renderer = createRenderer({
  enhancers: [
    beautifier()
  ],
  plugins: [
    prefixer()
  ]
})

Vue.use(VueFela, { renderer })
```

This is useful if you want to create and keep a reference to the `renderer` instance to allow you to render [static styles][fela-render-static], [fonts][fela-render-fonts] and [keyframes][fela-render-keyframes] using the [Renderer API][fela-renderer] elsewhere in your application.

### Rendering Rules

Since a Fela Renderer instance is added to Vue's prototype on the `$fela` property, you can reference and use it within a Vue component instance via `this.$fela`.

See the [Single File Component][vue-sfc] example below:

```vue
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

You can of course pass any arbitary `props` object as the second argument to `renderRule`.

<a name="map-rule"></a>

#### `mapRule(rule, optProps)`

To save having to define a computed prop function and return `this.$fela.renderRule(rule, props)` each time, a `mapRule` helper is provided:

```vue
<template>
  <div :class="className"/>
</template>

<script>
import { mapRule } from 'vue-fela-plugin'

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

If `optProps` is omitted (like in the example above) then the Vue component instance will be passed by default. This is shorthand for calling `mapRule(rule, this)`. Typically this is the desired behaviour since a component's styles will generally want to be the result of its state.

In the example above, the `color` prop can be configured by a parent component. This value will then be available within the component instance via `this.color`. If `color` is not set by the parent component, it will default to 'red' since we have set the `default` field in the `props` color definition.

As you might expect, _all properties and methods_ on a Vue component instance can be used within a rule:

- `props` values that can be set by parent components
- `data` values set when the component is initialised
- `computed` values derived from other properties and state
- `methods` that return values

Since the class names being returned from `mapRule` are assigned to the component's `computed` props object, any change in the state referenced by the rule will trigger an update and return new class names.

<a name="map-rules"></a>

#### `mapRules(rules, optMap, optProps)`

Taking it one step further, the `mapRules` helper repeats the work of `mapRule`—but expects an object map of `rules` rather than a single `rule` function:

```vue
<template>
  <div :class="container">
    <h1 :class="heading">Kitten Socks</h1>
    <p :class="body">The purrrfect gift for your cat.</p>
  </div>
</template>

<script>
import { mapRules } from 'vue-fela-plugin'

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

```vue
<template>
  <div :class="container">
    <h1 :class="heading">Kitten Socks</h1>
    <p :class="body">The purrrfect gift for your cat.</p>
  </div>
</template>

<script>
import { mapRules } from 'vue-fela-plugin'
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

Calling `mapRules(rules, optMap, optProps)` _with no_ `optMap` argument will result in _all_ of the `rules` being returned and assigned to the component's `computed` props.

In the example above, this would assign `container`, `heading` and `body` to the component's `computed` props. These 3 props could then be used as the class names on the 3 respective elements in the template.

This behaviour might not always be desirable, so `mapRules` provides another level of control with the `optMap` argument.

If you have used [Vuex's mapping helpers][vuex-helpers] the following interface should look familiar to you.

The `optMap` argument can either be:

1. An Array of Strings where:
    - String values are the names of the rules in the object map to include in the object that is returned
    - This allows you to filter out the rules you require
    - It does not allow you to rename the rules
2. An Object of key values where:
    - Keys are aliases to use as the computed prop names in the object that is returned
    - Values are the names of the rules in the object map
    - This allows you to both filter and rename rules

For example, using the same component and rules map from the example above:

```vue
<template>
  <div :class="container">
    <h1 :class="title">Kitten Socks</h1>
    <p>The purrrfect gift for your cat.</p>
  </div>
</template>

<script>
import { mapRules } from 'vue-fela-plugin'
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

In the example above you can see that we have used the [object spread operator][object-spread] to merge multiple calls to `mapRules` onto the component's `computed` object. We have also omitted the `body` rule from the `component-rules.js` map.

Finally, much like the `mapRule` helper, `optProps` can be passed as the _third argument_ to `mapRules`. Omitting `optProps` will result in the component instance being passed to each of the rules as the `props` argument by default.

### Rendering Styles

To render the actual styles cached by the Fela Renderer to the DOM we need to use `fela-dom`.

However, since Fela works on both the [client][fela-client] and the [server][fela-server], the method for rendering styles differs between environments.

To simplify this, `VueFela` includes a `Provider` component to handle the logic of determining what to do in each environment.

#### Fela Provider

By default `VueFela` registers a `fela-provider` component in Vue's global scope when you install the plugin.

To allow Fela to render the styles to the DOM, you must include the `fela-provider` component _once_ in your application:

```vue
<template>
  <div id="app">
    <fela-provider/>
  </div>
</template>
```

If you want the Fela Provider to be registered globally with a different component name, you can specify this using the `provider` key in the plugin options:

```js
import Vue from 'vue'
import VueFela from 'vue-fela-plugin'

Vue.use(VueFela, { provider: 'custom-fela-provider' })
```

Alternatively if you don't want the Fela Provider component to be registered globally, you can pass `false` as the `provider` value:

```js
import Vue from 'vue'
import VueFela from 'vue-fela-plugin'

Vue.use(VueFela, { provider: false })
```

When doing this, you _must_ then register the Fela `Provider` locally in one of your components:

```vue
<template>
  <div id="app">
    <fela-provider/>
  </div>
</template>

<script>
import { Provider } from 'vue-fela-plugin'

export default {
  components: {
    FelaProvider: Provider
  }
}
</script>
```

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

[vue-test-utils]: https://vue-test-utils.vuejs.org

[vuex-helpers]: https://vuex.vuejs.org/en/api.html#component-binding-helpers

[fela]: http://fela.js.org
[fela-config]: http://fela.js.org/docs/advanced/RendererConfiguration.html
[fela-client]: http://fela.js.org/docs/advanced/DOMRendering.html
[fela-server]: http://fela.js.org/docs/advanced/ServerRendering.html
[fela-renderer]: http://fela.js.org/docs/basics/Renderer.html
[fela-render-fonts]: http://fela.js.org/docs/api/fela/Renderer.html#renderfontfamily-files-properties
[fela-render-static]: http://fela.js.org/docs/api/fela/Renderer.html#renderstaticstyle-selector
[fela-render-keyframes]: http://fela.js.org/docs/api/fela/Renderer.html#renderkeyframekeyframe-props

[object-spread]: https://github.com/tc39/proposal-object-rest-spread

[jest]: https://facebook.github.io/jest

[mit]: https://opensource.org/licenses/MIT

[twitter]: https://twitter.com/wagerfield
