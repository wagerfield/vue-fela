import { createRenderer } from 'fela'
import FelaProvider from '../lib/provider'
import {
  MetaInfo,
  testSnapshot,
  installPlugin,
  wrapComponent,
  createComponent
} from './test-helpers'
import component from './component.vue'

const setVueEnv = (localVue, env) => {
  Object.defineProperty(localVue.prototype, '$isServer', {
    get: () => env === 'server'
  })
}

const createApp = (tag, data, children) => ({
  render(createElement) {
    const nodes = children ? children : [ component ]
    return createElement(tag, data, nodes.map(createElement))
  }
})

const wrapApp = (tag, localVue, fela, data, children) => {
  const app = createApp(tag, data, children)
  return wrapComponent(app, localVue, fela)
}

describe('Provider', () => {

  it('provides fela renderer to children via inject', () => {
    const fela = createRenderer()
    const localVue = installPlugin()
    const inject = () => ({ inject: [ 'fela' ] })

    const child1 = createComponent('div')
    const child2 = createComponent('div', null, null, inject())
    const provider = createComponent(FelaProvider, null, [ child1, child2 ])

    const providerWrapper = wrapComponent(provider, localVue, fela)
    const childWrapper1 = providerWrapper.find(child1)
    const childWrapper2 = providerWrapper.find(child2)

    expect(providerWrapper.vm.fela).toBeUndefined()
    expect(childWrapper1.vm.fela).toBeUndefined()
    expect(childWrapper2.vm.fela).toBe(fela)
  })

  it('renders expected snapshots', () => {
    const fela = createRenderer()
    const localVue = installPlugin()

    localVue.component('foo', component)

    testSnapshot(wrapApp(FelaProvider, localVue, fela))
    testSnapshot(wrapApp(FelaProvider, localVue, fela, {
      props: { tag: 'main' }
    }))

    testSnapshot(wrapApp(FelaProvider, localVue, fela, {
      props: { tag: 'main' },
      attrs: { id: 'main' }
    }))

    testSnapshot(wrapApp(FelaProvider, localVue, fela, {
      props: { tag: 'foo' }
    }))

    testSnapshot(wrapApp(FelaProvider, localVue, fela, {
      props: { tag: 'foo' },
      attrs: { id: 'foo' }
    }))

    testSnapshot(wrapApp(FelaProvider, localVue, fela, {
      props: {
        tag: 'foo',
        props: {
          margin: 1
        }
      }
    }))
  })

  describe('client', () => {

    const localVue = installPlugin()
    const fela = createRenderer()

    setVueEnv(localVue, 'client')
    beforeEach(fela.clear)

    it('adds subscription to fela renderer', () => {
      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)

      wrapApp(FelaProvider, localVue, fela)

      expect(fela.updateSubscription).toBeDefined()
      expect(fela.listeners).toHaveLength(1)
    })

    it('adds meta info to provider instance $options when ssr is true', () => {
      const data = { props: { ssr: false } }
      const wrapper = wrapApp(FelaProvider, localVue, fela, data)
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('adds meta info to provider instance $options when ssr is false', () => {
      const data = { props: { ssr: false } }
      const wrapper = wrapApp(FelaProvider, localVue, fela, data)
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('adds meta info to provider instance $options on custom property', () => {
      const metaKeyName = 'custom'
      const data = { props: { metaKeyName } }
      const wrapper = wrapApp(FelaProvider, localVue, fela, data)
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options[metaKeyName]

      expect(metaInfo).toEqual(MetaInfo)
    })
  })

  describe('server', () => {

    const localVue = installPlugin()
    const fela = createRenderer()

    setVueEnv(localVue, 'server')
    beforeEach(fela.clear)

    it('does not add subscription to fela renderer', () => {
      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)

      wrapApp(FelaProvider, localVue, fela)

      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)
    })

    it('adds meta info to provider instance $options when ssr is true', () => {
      const data = { props: { ssr: true } }
      const wrapper = wrapApp(FelaProvider, localVue, fela, data)
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('does not add meta info to provider instance $options when ssr is false', () => {
      const data = { props: { ssr: false } }
      const wrapper = wrapApp(FelaProvider, localVue, fela, data)
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toBeUndefined()
    })

    it('adds meta info to provider instance $options on custom property', () => {
      const metaKeyName = 'custom'
      const data = { props: { metaKeyName } }
      const wrapper = wrapApp(FelaProvider, localVue, fela, data)
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options[metaKeyName]

      expect(metaInfo).toEqual(MetaInfo)
    })
  })
})
