import { createRenderer } from 'fela'
import { renderRule } from '../index'
import rules from './component-rules'

const fela = createRenderer()
const rule = rules.border
const props = {
  outerRadius: 0,
  innerRadius: 0,
  active: false
}

describe('renderRule(renderer, rule, props)', () => {

  beforeEach(fela.clear)

  it('returns a string', () => {
    expect(renderRule(fela, rule, props)).toEqual(expect.any(String))
  })

  it('renders expected snapshot', () => {
    expect(renderRule(fela, rule, props)).toMatchSnapshot()
  })
})
