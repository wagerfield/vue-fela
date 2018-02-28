import Vue from 'vue'
import VueFela from '../../index'
import renderer from '../fela'

Vue.use(VueFela)

export default (context, inject) => {
  inject('fela', renderer)
}
