import { createLocalVue, mount } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
import { isArray } from '../lib/utils'
import VueFela from '../index'

export const VueRenderer = createRenderer()

export const MetaInfo = expect.objectContaining({
  style: expect.any(Array)
})

export const FelaRenderer = expect.objectContaining({
  renderKeyframe: expect.any(Function),
  renderStatic: expect.any(Function),
  renderFont: expect.any(Function),
  renderRule: expect.any(Function),
  plugins: expect.any(Array)
})

export const installPlugin = () => {
  const localVue = createLocalVue()
  localVue.use(VueFela)
  return localVue
}

export const createComponent = (tag, data, children, options = {}) => {
  return Object.assign(options, {
    render(createElement) {
      const vnodes = isArray(children) ?
        children.map(createElement) : null
      return createElement(tag, data, vnodes)
    }
  })
}

export const wrapComponent = (component, localVue, fela, propsData) => {
  return mount(component, { localVue, fela, propsData })
}

export const testSnapshot = (wrapper) => {
  VueRenderer.renderToString(wrapper.vm, (err, str) => {
    expect(str).toMatchSnapshot()
    expect(err).toBeNull()
  })
}
