import { createLocalVue } from 'vue-test-utils'
import { createRenderer } from 'fela'
import VueFela from '../index'
import {
  FelaRenderer,
  installPlugin,
  wrapComponent,
  createComponent
} from './test-helpers'

describe('Plugin', () => {

  it('calls plugin install method', () => {
    const localVue = createLocalVue()
    const spy = jest.spyOn(VueFela, 'install')
    expect(spy).toHaveBeenCalledTimes(0)
    localVue.use(VueFela)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  it('throws error when install is called more than once', () => {
    const localVue = createLocalVue()
    const spy = jest.spyOn(VueFela, 'install')
    VueFela.install(localVue)
    expect(() => {
      VueFela.install(localVue)
    }).toThrow()
    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })

  it('does not set $fela property on component instances', () => {
    const localVue = installPlugin()
    const component = createComponent('div')
    const wrapper = wrapComponent(component, localVue)
    expect(wrapper.vm.$fela).toBeUndefined()
  })

  it('sets $fela property on component instances', () => {
    const localVue = installPlugin()
    const fela = createRenderer()
    const inner = createComponent('div')
    const outer = createComponent('div', null, [ inner ])

    const wrapper = wrapComponent(outer, localVue, fela)
    expect(wrapper.vm.$options.fela).toBe(fela)
    expect(wrapper.vm.$fela).toEqual(FelaRenderer)
    expect(wrapper.vm.$fela).toBe(fela)

    const child = wrapper.find(inner)
    expect(child.vm.$options.parent.$fela).toBe(fela)
    expect(child.vm.$fela).toEqual(FelaRenderer)
    expect(child.vm.$fela).toBe(fela)
  })

  it('provides fela renderer to children via inject', () => {
    const fela = createRenderer()
    const localVue = installPlugin()

    const child1 = createComponent('div')
    const child2 = createComponent('div', null, null, { inject: [ 'fela' ] })
    const parent = createComponent('div', null, [ child1, child2 ])

    const parentWrapper = wrapComponent(parent, localVue, fela)
    const childWrapper1 = parentWrapper.find(child1)
    const childWrapper2 = parentWrapper.find(child2)

    expect(parentWrapper.vm.fela).toBeUndefined()
    expect(childWrapper1.vm.fela).toBeUndefined()
    expect(childWrapper2.vm.fela).toBe(fela)
  })

  it('registers a fela component in the global scope', () => {
    const localVue = installPlugin()
    expect(localVue.options.components.fela).toBeDefined()
  })
})
