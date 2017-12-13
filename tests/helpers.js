import { mount, createLocalVue } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
import VueFela from '../index'

export const VueRenderer = createRenderer()
export const DummyPlugin = (style) => style

export const FelaRenderer = expect.objectContaining({
  renderKeyframe: expect.any(Function),
  renderStatic: expect.any(Function),
  renderFont: expect.any(Function),
  renderRule: expect.any(Function),
  plugins: expect.any(Array)
})

export const setup = (options) => {
  const localVue = createLocalVue()
  localVue.use(VueFela, options)
  return localVue
}

export const wrap = (component, localVue, propsData) =>
  mount(component, { localVue, propsData })

export const snapshot = (wrapper) => {
  VueRenderer.renderToString(wrapper.vm, (err, str) => {
    expect(str).toMatchSnapshot()
    expect(err).toBeNull()
  })
}
