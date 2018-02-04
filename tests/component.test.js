import { createRenderer } from 'fela'
import {
  FelaRenderer,
  testSnapshot,
  installPlugin,
  wrapComponent
} from './test-helpers'
import component from './component.vue'

const localVue = installPlugin()
const fela = createRenderer()

describe('component.vue', () => {

  beforeEach(fela.clear)

  it('has $fela renderer property', () => {
    const wrapper = wrapComponent(component, localVue, fela)
    expect(wrapper.vm.$fela).toEqual(FelaRenderer)
    expect(wrapper.vm.$fela).toBe(fela)
  })

  it('renders expected snapshots', () => {
    const wrapper = wrapComponent(component, localVue, fela)

    testSnapshot(wrapper)

    wrapper.setProps({ active: true })
    testSnapshot(wrapper)

    wrapper.setProps({ margin: 2 })
    testSnapshot(wrapper)

    wrapper.setProps({ innerRadius: 2 })
    testSnapshot(wrapper)

    wrapper.setProps({ outerRadius: 4 })
    testSnapshot(wrapper)
  })
})
