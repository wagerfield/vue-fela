import isArray from 'isarray'
import { createRenderer } from 'vue-server-renderer'
import { createLocalVue, mount } from 'vue-test-utils'
import VueFela from '../index'

export const VueRenderer = createRenderer()

export const FelaRenderer = expect.objectContaining({
  renderKeyframe: expect.any(Function),
  renderStatic: expect.any(Function),
  renderFont: expect.any(Function),
  renderRule: expect.any(Function),
  plugins: expect.any(Array)
})

export const installPlugin = (options) => {
  const localVue = createLocalVue()
  localVue.use(VueFela, options)
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

export const wrapComponent = (component, localVue, options) => {
  return mount(component, Object.assign({ localVue }, options))
}

export const testSnapshot = (wrapper) => {
  VueRenderer.renderToString(wrapper.vm, (err, str) => {
    expect(str).toMatchSnapshot()
    expect(err).toBeNull()
  })
}
