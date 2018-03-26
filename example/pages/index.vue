<template>
  <div :class="styles.container">
    <h1 v-text="view.text" @click="cycle" :class="styles.text"/>
  </div>
</template>

<script>
import { mapStyles } from '../../index'

const views = [{
  text: 'Nuxt',
  textColor: '#35495E',
  bgColor: '#5BB984'
}, {
  text: 'Fela',
  textColor: '#5246E7',
  bgColor: '#73DCFC'
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
    styles: mapStyles(rules),
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
