import { createRenderer } from 'fela'
import {
  mapStyle,
  renderServerStyles,
  renderClientStyles
} from '../lib/renderer'
import { MetaInfo } from './test-helpers'

const fela = createRenderer()

const tagId = 'hid'

const createTag = mapStyle(tagId)
const renderTag = (type, css, media, support) =>
  createTag({ type, css, media, support })

const rule1 = ({ width }) => ({ width })
const rule2 = ({ color }) => ({ color })
const rule3 = ({ width, color = 'red' }) => ({
  [`@media (min-width: ${width})`]: { color }
})

describe('Renderer', () => {

  beforeEach(fela.clear)

  describe('mapStyle(style)', () => {

    it('renders expected snapshots', () => {
      const css = '.a{color:black}'
      const media = '(min-width: 300px)'
      expect(renderTag()).toMatchSnapshot()
      expect(renderTag('RULE', css)).toMatchSnapshot()
      expect(renderTag('STATIC', css)).toMatchSnapshot()
      expect(renderTag('RULE', css, media)).toMatchSnapshot()
      expect(renderTag('RULE', css, media, true)).toMatchSnapshot()
      expect(renderTag('RULE', css, false, true)).toMatchSnapshot()
    })
  })

  describe('renderServerStyles(renderer)', () => {

    it('renders expected snapshot', () => {

      fela.renderRule(rule1, { width: '8px' })
      fela.renderRule(rule2, { color: 'red' })
      fela.renderRule(rule3, { width: '8px' })

      fela.renderFont('Lato', [
        '../fonts/Lato.ttf',
        '../fonts/Lato.eot'
      ], { fontWeight: 300 })

      fela.renderStatic('body{margin:0}')
      fela.renderStatic({
        boxSizing: 'border-box'
      }, '*')

      const metaInfo = renderServerStyles(fela, tagId)
      expect(metaInfo).toEqual(MetaInfo)
      expect(metaInfo).toMatchSnapshot()
    })
  })

  describe('renderClientStyles(renderer)', () => {

    it('calls fela dom rehydrate and render methods', () => {
      expect(fela.updateSubscription).toBeUndefined()
      expect(fela.listeners).toHaveLength(0)

      renderClientStyles(fela)

      expect(fela.updateSubscription).toBeDefined()
      expect(fela.listeners).toHaveLength(1)
    })
  })
})
