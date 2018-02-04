import { createRenderer } from 'fela'
import Provider from '../lib/provider'
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

const createApp = (props, attrs) => ({
  render(createElement) {
    const data = { props, attrs }
    const child = createElement(component)
    return createElement('fela', data, [ child ])
  }
})

const wrapApp = (localVue, fela, props, attrs) => {
  const app = createApp(props, attrs)
  return wrapComponent(app, localVue, fela)
}

describe('Provider', () => {

  it('renders expected snapshots', () => {
    const fela = createRenderer()
    const localVue = installPlugin()
    testSnapshot(wrapApp(localVue, fela))
    testSnapshot(wrapApp(localVue, fela, { tag: 'main' }))
  })

  describe('client', () => {

    const localVue = installPlugin()
    const fela = createRenderer()

    setVueEnv(localVue, 'client')
    beforeEach(fela.clear)

    it('adds subscription to fela renderer', () => {
      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)

      wrapApp(localVue, fela)

      expect(fela.updateSubscription).toBeDefined()
      expect(fela.listeners).toHaveLength(1)
    })

    it('adds meta info to provider instance $options when ssr is true', () => {
      const wrapper = wrapApp(localVue, fela, { ssr: true })
      const provider = wrapper.find(Provider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('adds meta info to provider instance $options when ssr is false', () => {
      const wrapper = wrapApp(localVue, fela, { ssr: false })
      const provider = wrapper.find(Provider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('adds meta info to provider instance $options on custom property', () => {
      const metaKeyName = 'custom'
      const wrapper = wrapApp(localVue, fela, { metaKeyName })
      const provider = wrapper.find(Provider)
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

      wrapApp(localVue, fela)

      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)
    })

    it('adds meta info to provider instance $options when ssr is true', () => {
      const wrapper = wrapApp(localVue, fela, { ssr: true })
      const provider = wrapper.find(Provider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toEqual(MetaInfo)
    })

    it('does not add meta info to provider instance $options when ssr is false', () => {
      const wrapper = wrapApp(localVue, fela, { ssr: false })
      const provider = wrapper.find(Provider)
      const metaInfo = provider.vm.$options.head

      expect(metaInfo).toBeUndefined()
    })

    it('adds meta info to provider instance $options on custom property', () => {
      const metaKeyName = 'custom'
      const wrapper = wrapApp(localVue, fela, { metaKeyName })
      const provider = wrapper.find(Provider)
      const metaInfo = provider.vm.$options[metaKeyName]

      expect(metaInfo).toEqual(MetaInfo)
    })
  })
})
