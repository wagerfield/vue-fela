import { createRenderer } from 'fela'
import { renderRule } from '../index'
import rules from './component-rules'

const renderer = createRenderer()
const rule = rules.border
const props = {
  outerRadius: 0,
  innerRadius: 0,
  active: false
}

describe('renderRule(renderer, rule, props)', () => {

  beforeEach(renderer.clear)

  it('returns a string', () => {
    expect(renderRule(renderer, rule, props)).toEqual(expect.any(String))
  })

  it('renders expected snapshot', () => {
    expect(renderRule(renderer, rule, props)).toMatchSnapshot()
  })
})
