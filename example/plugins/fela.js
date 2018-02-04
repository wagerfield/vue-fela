import Vue from 'vue'
import VueFela from '../../index'
import renderer from '../styles'

Vue.use(VueFela)

export default ({ app }) => {
  app.fela = renderer
}
