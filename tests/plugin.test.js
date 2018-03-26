import { createLocalVue } from 'vue-test-utils'
import { createRenderer } from 'fela'
import VueFela from '../index'
import DOM from '../lib/dom'
import {
  FelaRenderer,
  installPlugin,
  wrapComponent,
  createComponent
} from './test-helpers'

const rule1 = ({ width }) => ({ width })
const rule2 = ({ color }) => ({ color })

describe('Plugin', () => {

  it('throws error if a renderer is not passed as an option', () => {
    const localVue = createLocalVue()
    expect(() => {
      localVue.use(VueFela)
    }).toThrowErrorMatchingSnapshot()
  })

  it('calls plugin install method', () => {
    const localVue = createLocalVue()
    const renderer = createRenderer()
    const spy = jest.spyOn(VueFela, 'install')
    expect(spy).toHaveBeenCalledTimes(0)
    localVue.use(VueFela, { renderer })
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  it('throws error when install is called more than once', () => {
    const localVue = createLocalVue()
    const renderer = createRenderer()
    const spy = jest.spyOn(VueFela, 'install')
    VueFela.install(localVue, { renderer })
    expect(() => {
      VueFela.install(localVue, { renderer })
    }).toThrowErrorMatchingSnapshot()
    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })

  it('assigns $fela renderer to component instances', () => {
    const renderer = createRenderer()
    const localVue = installPlugin({ renderer })

    const inner = createComponent('div')
    const outer = createComponent('div', null, [ inner ])

    const wrapper = wrapComponent(outer, localVue)
    expect(wrapper.vm.$fela).toEqual(FelaRenderer)
    expect(wrapper.vm.$fela).toBe(renderer)

    const child = wrapper.find(inner)
    expect(child.vm.$fela).toEqual(FelaRenderer)
    expect(child.vm.$fela).toBe(renderer)
  })

  it('provides fela renderer from root component instance', () => {
    const renderer = createRenderer()
    const localVue = installPlugin({ renderer })

    const vmChild = createComponent('div', null, null, {
      provide: { foo: 'bar' }
    })

    const fnChild = {
      functional: true,
      inject: [ 'fela' ],
      render(h, ctx) {
        expect(ctx.injections.fela).toEqual(FelaRenderer)
        expect(ctx.injections.fela).toBe(renderer)
      }
    }

    const parent = createComponent('div', null, [ vmChild, fnChild ])
    const wrapper = wrapComponent(parent, localVue)
    const child = wrapper.find(vmChild)

    const wrapperProvide = wrapper.vm.$options.provide()
    expect(wrapperProvide.fela).toEqual(FelaRenderer)
    expect(wrapperProvide.fela).toBe(renderer)

    const childProvide = child.vm.$options.provide()
    expect(childProvide.fela).toBeUndefined()
    expect(childProvide.foo).toBe('bar')
  })

  it('calls renderClientStyles from root component when created', () => {
    const renderer = createRenderer()
    const localVue = installPlugin({ renderer })
    const spy = jest.spyOn(DOM, 'renderClientStyles')

    expect(spy).toHaveBeenCalledTimes(0)
    wrapComponent(createComponent('div'), localVue)
    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockRestore()
  })

  it('adds meta function to all component instances', () => {
    const renderer = createRenderer()
    const localVue = installPlugin({ renderer })

    renderer.renderRule(rule1, { width: '8px' })
    renderer.renderRule(rule2, { color: 'red' })

    const child1 = createComponent('div')
    const child2 = createComponent('div')
    const parent = createComponent('div', null, [ child1, child2 ])

    const parentWrapper = wrapComponent(parent, localVue)
    const childWrapper1 = parentWrapper.find(child1)
    const childWrapper2 = parentWrapper.find(child2)

    const parentMetaFn = parentWrapper.vm.$options.head
    const childMetaFn1 = childWrapper1.vm.$options.head
    const childMetaFn2 = childWrapper2.vm.$options.head

    expect(parentMetaFn).toEqual(expect.any(Function))
    expect(childMetaFn1).toEqual(expect.any(Function))
    expect(childMetaFn2).toEqual(expect.any(Function))

    expect(parentMetaFn).toBe(childMetaFn1)
    expect(parentMetaFn).toBe(childMetaFn2)

    expect(parentMetaFn()).toMatchSnapshot()
  })

  it('does not add meta function when ssr option is false', () => {
    const renderer = createRenderer()
    const localVue = installPlugin({ renderer, ssr: false })

    const parent = createComponent('div')
    const wrapper = wrapComponent(parent, localVue)

    const metaFn = wrapper.vm.$options.head
    expect(metaFn).toBeUndefined()
  })

  it('uses metaKey and metaTagId options', () => {
    const metaTagId = 'vmid'
    const metaKeyName = 'metaInfo'
    const renderer = createRenderer()
    const localVue = installPlugin({ renderer, metaTagId, metaKeyName })

    renderer.renderRule(rule1, { width: '8px' })
    renderer.renderRule(rule2, { color: 'red' })

    const parent = createComponent('div')
    const wrapper = wrapComponent(parent, localVue)

    const metaFn = wrapper.vm.$options[metaKeyName]
    expect(metaFn).toEqual(expect.any(Function))

    expect(metaFn()).toMatchSnapshot()
  })

  it('does not call render functions when autoRender option is false', () => {
    const renderer = createRenderer()
    const localVue = installPlugin({ renderer, autoRender: false })

    const clientSpy = jest.spyOn(DOM, 'renderClientStyles')
    const serverSpy = jest.spyOn(DOM, 'renderClientStyles')

    expect(clientSpy).toHaveBeenCalledTimes(0)
    expect(serverSpy).toHaveBeenCalledTimes(0)

    wrapComponent(createComponent('div'), localVue)

    expect(clientSpy).toHaveBeenCalledTimes(0)
    expect(serverSpy).toHaveBeenCalledTimes(0)

    clientSpy.mockRestore()
    serverSpy.mockRestore()
  })
})
