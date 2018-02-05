# VueFela

**[Fela][fela] plugin for [Vue][vue]**

- [Installation](#installation)
- [Usage](#usage)
    - [Working Example Using Nuxt](example)
    - [Rendering Rules](#rendering-rules)
        - [mapRule(rule, optProps)](#map-rule)
        - [mapRules(rules, optMap, optProps)](#map-rules)
    - [Rendering Styles](#rendering-styles)
        - [Fela Provider](#fela-provider)
        - [Server Side Rendering](#server-side-rendering)
- [Tests](#tests)

## Installation

```bash
yarn add vue-fela-plugin
```

## Usage

```js
import Vue from 'vue'
import VueFela from 'vue-fela-plugin'
import { createRenderer } from 'fela'

// 1. Install the plugin
Vue.use(VueFela)

// 2. Create a fela renderer
const renderer = createRenderer()

// 3. Inject the renderer on a 'fela' property
const app = new Vue({
  fela: renderer
}).$mount('#app')
```

When the plugin is installed, a `$fela` property is set on each Vue component instance in the [`beforeCreate`][vue-before-create] hook.

The `$fela` property provides a reference to the [Fela Renderer][fela-renderer] instance that was injected into the root application.

**Check out a full working [example using Nuxt](example).**

### Rendering Rules

Since a [Fela Renderer][fela-renderer] instance is added to each Vue component instance, you can reference and use it via `this.$fela`.

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

#### mapRule(rule, optProps)

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

If `optProps` is omitted (like in the example above) then the Vue component instance will be passed by default. Typically this is the desired behaviour since a component's styles will generally want to be the result of its state.

In the example above, the `color` prop can be configured by a parent component. This value will then be available within the component instance via `this.color`. If `color` is not set by the parent component, it will default to 'red' since we have set the `default` field in the `props` color definition.

As you might expect, _all properties and methods_ on a Vue component instance can be used within a rule:

- `props` values set by parent components
- `data` values set when the component is initialised
- `computed` values derived from other properties and state
- `methods` that return values

Since the class names being returned from `mapRule` are assigned to the component's `computed` props object, any change in state referenced by a rule will trigger an update and return new class names.

<a name="map-rules"></a>

#### mapRules(rules, optMap, optProps)

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

Calling `mapRules(rules, optMap, optProps)` with no `optMap` argument will result in all `rules` being returned and assigned to the component's `computed` props.

In the example above, this would assign `container`, `heading` and `body` to the component's `computed` props. These 3 props can then be used as class names on the 3 respective elements in the template.

This behaviour might not always be desirable, so `mapRules` provides another level of control with the `optMap` argument.

If you have used [Vuex's mapping helpers][vuex-helpers] the following interface should look familiar to you.

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

In the example above you can see that we have used the [object spread operator][object-spread] to merge multiple calls to `mapRules` onto the component's `computed` props object. We have also omitted the `body` rule from the `component-rules.js` map.

Finally, much like the `mapRule` helper, `optProps` can be passed as the _third argument_ to `mapRules`. Omitting `optProps` will result in the component instance being passed to each of the rules as the `props` argument by default.

### Rendering Styles

To render the styles cached by the Fela Renderer we need to use `fela-dom`.

However, since Fela works on both the [client][fela-client] and the [server][fela-server], the method for rendering the cached styles differs between environments.

To simplify this, `VueFela` includes a `fela` provider component to handle the logic of determining what to do in each environment.

#### Fela Provider

When the `VueFela` plugin is installed it registers a `fela` component in Vue's global scope.

To render the cached styles, you must include the `fela` component _once_ in your application:

```vue
<template>
  <div id="app">
    <fela/>
  </div>
</template>
```

Alternatively you can make the `fela` component the root of your application and nest the rest of your markup within it:

```vue
<template>
  <fela id="app">
    <h1>This will be rendered</h1>
    <h2>So will this</h1>
  </fela>
</template>
```

The `fela` provider component has 4 props that can be optionally set:

Attribute | Type | Default | Description
----------|------|---------|------------
`tag` | `String` | `div` | HTML tag to render
`ssr` | `Boolean` | `true` | Enable/disable SSR
`metaTagId` | `String` | `hid` | Vue Meta `tagIDKeyName` [option][vue-meta-options]<br>This is [configured to work with Nuxt][nuxt-meta] by default
`metaKeyName` | `String` | `head` | Vue Meta `keyName` [option][vue-meta-options]<br>This is [configured to work with Nuxt][nuxt-meta] by default

An example using [Vue Meta's default values][vue-meta-options] while disabling SSR can be seen below:

```vue
<template>
  <fela tag="main"
    meta-tag-id="vmid"
    meta-key-name="metaInfo"
    :ssr="false"/>
</template>
```

#### Server Side Rendering

The easiest way to create universal Vue applications is with [Nuxt][nuxt]. Nuxt takes care of setting up the logic for rendering Vue components on the server and rehydrating them on the client.

Nuxt uses `vue-meta` to render and update tags in the `<head>` of your pages. [Vue Meta][vue-meta] provides the mechanism Vue Fela needs for rendering the cached styles on the server and sending them to the client.

Because of this, the `fela` provider component is configured to work with `vue-meta` using [Nuxt's configuration][nuxt-meta] by default.

To setup Vue Fela with Nuxt you will need to setup the plugin in the `plugins` directory:

```js
// plugins/fela.js
import Vue from 'vue'
import VueFela from 'vue-fela-plugin'
import { createRenderer } from 'fela'

// 1. Install the plugin
Vue.use(VueFela)

// 2. Create a fela renderer
const renderer = createRenderer()

export default ({ app }) => {
  // 3. Assign the renderer to the app on a 'fela' property
  app.fela = createRenderer()
}
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
