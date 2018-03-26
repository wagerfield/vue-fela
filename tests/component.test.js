import { createRenderer } from 'fela'
import {
  FelaRenderer,
  testSnapshot,
  installPlugin,
  wrapComponent
} from './test-helpers'
import component from './component.vue'

const renderer = createRenderer()
const localVue = installPlugin({ renderer })

describe('component.vue', () => {

  beforeEach(renderer.clear)

  it('has $fela renderer property', () => {
    const wrapper = wrapComponent(component, localVue)
    expect(wrapper.vm.$fela).toEqual(FelaRenderer)
    expect(wrapper.vm.$fela).toBe(renderer)
  })

  it('renders expected snapshots', () => {
    const wrapper = wrapComponent(component, localVue)

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
