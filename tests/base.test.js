import { setup, wrap, snapshot, FelaRenderer } from './helpers'
import Base from './base.vue'

describe('Base component', () => {

  const localVue = setup()

  beforeEach(localVue.prototype.$fela.clear)

  it('has a $fela renderer on the component instance', () => {
    const wrapper = wrap(Base, localVue)
    expect(wrapper.vm.$fela).toEqual(FelaRenderer)
  })

  it('computed prop returns empty string when no rule props value is set', () => {
    const wrapper = wrap(Base, localVue)
    expect(wrapper.vm.one).toBe('')
  })

  it('computed prop returns expected class names when rule props are set', () => {
    const margin = 0
    const color = 'red'
    const w1 = wrap(Base, localVue, { color })
    const w2 = wrap(Base, localVue, { margin })
    const w3 = wrap(Base, localVue, { margin, color })
    expect(w1.vm.one).toBe('a')
    expect(w2.vm.one).toBe('b')
    expect(w3.vm.one).toBe('a b')
  })

  it('renders expected snapshot', () => {
    const margin = 0
    const color = 'red'
    snapshot(wrap(Base, localVue, { color }))
    snapshot(wrap(Base, localVue, { margin }))
    snapshot(wrap(Base, localVue, { margin, color }))
  })
})
