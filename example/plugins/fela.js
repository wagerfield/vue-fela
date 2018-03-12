import Vue from 'vue'
import VueFela from '../../index'
import renderer from '../fela'

Vue.use(VueFela)

export default ({ app }, inject) => {
  inject('fela', renderer)
  app.provide = Object.assign({
    fela: renderer
  }, app.provide)
}
