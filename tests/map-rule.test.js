import { createRenderer } from 'fela'
import { mapRule } from '../index'
import {
  testSnapshot,
  installPlugin,
  wrapComponent
} from './test-helpers'
import props from './component-props'
import rules from './component-rules'

const localVue = installPlugin()
const fela = createRenderer()
const rule = rules.border

const props1 = { outerRadius: 0, innerRadius: 0, active: false }
const props2 = { outerRadius: 4, innerRadius: 2, active: true }

const createComponent = (optProps) => ({
  props,
  render(createElement) {
    return createElement('div', {
      class: this.className
    })
  },
  computed: {
    className: mapRule(rule, optProps)
  }
})

describe('mapRule(rule, optProps)', () => {

  beforeEach(fela.clear)

  it('returns a function', () => {
    expect(mapRule(rule)).toEqual(expect.any(Function))
  })

  it('renders expected snapshots from propsData', () => {
    const component = createComponent()
    const wrapper = wrapComponent(component, localVue, fela)

    testSnapshot(wrapper)

    wrapper.setProps({ active: true })
    testSnapshot(wrapper)

    wrapper.setProps({ outerRadius: 4 })
    testSnapshot(wrapper)

    wrapper.setProps({ innerRadius: 2 })
    testSnapshot(wrapper)
  })

  it('renders expected snapshots from optProps', () => {
    testSnapshot(wrapComponent(createComponent(props1), localVue, fela))
    testSnapshot(wrapComponent(createComponent(props2), localVue, fela))
  })

  it('optProps takes precedence over propsData', () => {
    const component = createComponent(props1)
    const wrapper1 = wrapComponent(component, localVue, fela)
    const wrapper2 = wrapComponent(component, localVue, fela, props2)
    expect(wrapper1.vm.className).toBe(wrapper2.vm.className)
  })
})
