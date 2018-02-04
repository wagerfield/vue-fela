<template>
  <div :class="[ border, layout ]"/>
</template>

<script>
import props from './component-props'
import rules from './component-rules'

export default {
  props,
  computed: {
    border() {
      return this.$fela.renderRule(rules.border, this)
    },
    layout() {
      return this.$fela.renderRule(rules.layout, this)
    }
  }
}
</script>
