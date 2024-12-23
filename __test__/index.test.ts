import { createGenerator } from 'unocss'
import { describe, expect, it } from 'vitest'
import { presetDarkModeTheme } from '../src/index.ts'

describe('preset-dark-mode-theme', () => {
  it('basic', async () => {
    const uno = await createGenerator({
      presets: [
        presetDarkModeTheme({ theme: { colors: { primary: '#fff' } } })
      ],
    })
    const { css: noPreflightCSS } = await uno.generate('text-primary')
    expect(noPreflightCSS).toMatchInlineSnapshot(`
      "/* layer: theme */
      :root{--un-colors-primary:255 255 255;}
      :root.dark{--un-colors-primary:255 255 255;}"
      `)
  })

  it('media dark mode', async () => {
    const uno = await createGenerator({
      presets: [
        presetDarkModeTheme({ theme: { colors: { primary: '#fff' } }, selector: 'media' })
      ],
    })
    const { css: noPreflightCSS } = await uno.generate('text-primary')
    expect(noPreflightCSS).toMatchInlineSnapshot(`
      "/* layer: theme */
      @media (prefers-color-scheme: light){--un-colors-primary:255 255 255;}
      @media (prefers-color-scheme: dark){--un-colors-primary:255 255 255;}"
      `)
  })
})