<template>
  <fela id="app" tag="main" :class="container">
    <h1 v-text="view.text" @click="cycle" :class="text"/>
  </fela>
</template>

<script>
import { mapRules } from '../../index'

const views = [{
  text: 'Nuxt',
  textColor: '#FCEADE',
  bgColor: '#EA526F'
}, {
  text: 'Fela',
  textColor: '#3D315B',
  bgColor: '#F8F991'
}]

const rules = {
  container: ({ view }) => ({
    backgroundColor: view.bgColor,
    userSelect: 'none',
    cursor: 'pointer',
    height: '100vh',
    width: '100vw'
  }),
  text: ({ view }) => ({
    color: view.textColor,
    textAlign: 'center',
    lineHeight: '100vh',
    fontWeight: 400,
    fontSize: '20vw'
  })
}

export default {
  data() {
    return {
      index: 0
    }
  },
  computed: {
    ...mapRules(rules),
    view() {
      return views[this.index]
    }
  },
  methods: {
    cycle() {
      if (++this.index >= views.length) this.index = 0
    }
  }
}
</script>
