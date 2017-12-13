import { createLocalVue } from 'vue-test-utils'
import { createRenderer } from 'fela'
import VueFela from '../index'
import { setup, DummyPlugin, FelaRenderer } from './helpers'

describe('VueFela plugin setup', () => {

  it('calls plugin install method', () => {
    const localVue = createLocalVue()
    const spy = jest.spyOn(VueFela, 'install')
    expect(spy).toHaveBeenCalledTimes(0)
    localVue.use(VueFela)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  it('adds a $fela renderer to Vue prototype', () => {
    const localVue = setup()
    expect(localVue.prototype.$fela).toEqual(FelaRenderer)
  })

  it('allows a renderer to be passed via plugin options', () => {
    const renderer = createRenderer()
    const localVue = setup({ renderer })
    expect(localVue.prototype.$fela).toBe(renderer)
    expect(localVue.prototype.$fela).toEqual(FelaRenderer)
  })

  it('passes plugin options to createRenderer', () => {
    const localVue = setup({ plugins: [ DummyPlugin ] })
    expect(localVue.prototype.$fela.plugins).toEqual([ DummyPlugin ])
  })

  it('registers a fela-provider component on the global scope', () => {
    const localVue = setup()
    expect(localVue.options.components['fela-provider']).toBeDefined()
  })

  it('renames the fela-provider component via plugin options', () => {
    const provider = 'custom-fela-provider'
    const localVue = setup({ provider })
    expect(localVue.options.components[provider]).toBeDefined()
  })

  it('disables global registration of the fela-provider component via plugin options', () => {
    const localVue = setup({ provider: false })
    expect(localVue.options.components['fela-provider']).toBeUndefined()
  })
})
