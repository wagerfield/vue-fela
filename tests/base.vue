<template>
  <div :class="one"/>
</template>

<script>
import rules from './base-rules'

export default {
  props: {
    margin: {
      type: Number
    },
    color: {
      type: String
    }
  },
  computed: {
    one() {
      return this.$fela.renderRule(rules.one, this)
    }
  }
}
</script>
