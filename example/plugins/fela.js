import Vue from 'vue'
import VueFela from '../../index'
import renderer from '../fela'

Vue.use(VueFela)

export default ({ app }) => {
  app.fela = renderer
}
