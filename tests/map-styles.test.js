import isArray from 'isarray'
import isObject from 'isobject'
import { createRenderer } from 'fela'
import { mapStyles } from '../index'
import {
  testSnapshot,
  installPlugin,
  wrapComponent
} from './test-helpers'
import props from './component-props'
import rules from './component-rules'

const renderer = createRenderer()
const localVue = installPlugin({ renderer })

const props1 = { outerRadius: 0, innerRadius: 0, active: false }
const props2 = { outerRadius: 4, innerRadius: 2, active: true }

const createComponent = (optMap, optProps) => ({
  props,
  render(createElement) {
    const keys = isArray(optMap)
      ? optMap
      : isObject(optMap)
        ? Object.keys(optMap)
        : Object.keys(rules)
    return createElement('div', {
      class: keys.map((key) => this.styles[key])
    })
  },
  computed: {
    styles: mapStyles(rules, optMap, optProps)
  }
})

const testShape = (optMap, shape) => {
  it('returns expected shape', () => {
    const styles = mapStyles(rules, optMap)
    expect(styles.call({
      $fela: renderer
    })).toEqual(shape)
  })
}

const testPropsData = (optMap, propsData) => {
  it('renders expected snapshots from propsData', () => {
    const component = createComponent(optMap)
    const wrapper = wrapComponent(component, localVue, { propsData })
    testSnapshot(wrapper)
  })
}

const testOptProps = (optMap, optProps) => {
  it('renders expected snapshots from optProps', () => {
    const component = createComponent(optMap, optProps)
    const wrapper = wrapComponent(component, localVue)
    testSnapshot(wrapper)
  })
}

const testPrecedence = (optMap, optProps, propsData) => {
  it('optProps takes precedence over propsData', () => {
    const component = createComponent(optMap, optProps)
    const wrapper1 = wrapComponent(component, localVue)
    const wrapper2 = wrapComponent(component, localVue, { propsData })
    expect(wrapper1.vm.className).toBe(wrapper2.vm.className)
  })
}

const testSuite = (shape, optMap) => {
  describe(`optMap = ${JSON.stringify(optMap)}`, () => {
    testShape(optMap, shape)
    testOptProps(optMap, props1)
    testPropsData(optMap, props1)
    testPrecedence(optMap, props1, props2)
  })
}

describe('mapRules(rule, optMap, optProps)', () => {

  beforeEach(renderer.clear)

  it('returns a function', () => {
    expect(mapStyles(rules)).toEqual(expect.any(Function))
  })

  testSuite({
    border: expect.any(String),
    layout: expect.any(String)
  })

  testSuite({
    border: expect.any(String)
  }, [
    'border'
  ])

  testSuite({
    borderAlias: expect.any(String)
  }, {
    borderAlias: 'border'
  })
})
