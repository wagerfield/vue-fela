import { createRenderer } from 'fela'
import FelaProvider from '../lib/provider'
import {
  MetaInfo,
  testSnapshot,
  installPlugin,
  wrapComponent
} from './test-helpers'
import component from './component.vue'

const setVueEnv = (localVue, env) => {
  Object.defineProperty(localVue.prototype, '$isServer', {
    get: () => env === 'server'
  })
}

const createApp = (tag, props, attrs) => ({
  render(createElement) {
    const data = { props, attrs }
    const child = createElement(component)
    return createElement(tag, data, [ child ])
  }
})

const wrapApp = (tag, localVue, fela, props, attrs) => {
  const app = createApp(tag, props, attrs)
  return wrapComponent(app, localVue, fela)
}

describe('Provider', () => {

  it('renders expected snapshots', () => {
    const fela = createRenderer()
    const localVue = installPlugin()
    localVue.component('foo', component)
    testSnapshot(wrapApp('fela', localVue, fela))
    testSnapshot(wrapApp('fela', localVue, fela, { tag: 'main' }))
    testSnapshot(wrapApp('fela', localVue, fela, { tag: 'foo' }))
    testSnapshot(wrapApp('fela', localVue, fela, { tag: 'foo', props: { margin: 1 } }))
  })

  describe('client', () => {

    const localVue = installPlugin()
    const fela = createRenderer()

    setVueEnv(localVue, 'client')
    beforeEach(fela.clear)

    it('adds subscription to fela renderer', () => {
      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)

      wrapApp('fela', localVue, fela)

      expect(fela.updateSubscription).toBeDefined()
      expect(fela.listeners).toHaveLength(1)
    })

    it('adds meta info to provider instance $options when ssr is true', () => {
      const wrapper = wrapApp('fela', localVue, fela, { ssr: true })
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('adds meta info to provider instance $options when ssr is false', () => {
      const wrapper = wrapApp('fela', localVue, fela, { ssr: false })
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('adds meta info to provider instance $options on custom property', () => {
      const metaKeyName = 'custom'
      const wrapper = wrapApp('fela', localVue, fela, { metaKeyName })
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

      wrapApp('fela', localVue, fela)

      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)
    })

    it('adds meta info to provider instance $options when ssr is true', () => {
      const wrapper = wrapApp('fela', localVue, fela, { ssr: true })
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('does not add meta info to provider instance $options when ssr is false', () => {
      const wrapper = wrapApp('fela', localVue, fela, { ssr: false })
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toBeUndefined()
    })

    it('adds meta info to provider instance $options on custom property', () => {
      const metaKeyName = 'custom'
      const wrapper = wrapApp('fela', localVue, fela, { metaKeyName })
      const provider = wrapper.find(FelaProvider)
      const metaInfo = provider.vm.$options[metaKeyName]

      expect(metaInfo).toEqual(MetaInfo)
    })
  })
})
