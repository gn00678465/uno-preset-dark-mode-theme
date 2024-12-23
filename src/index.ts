import { definePreset, type Postprocessor } from 'unocss'
import type { PresetBuildVariableOptions } from './types.ts'
import { generateTheme } from './theme/index.ts'
import { preflights } from './preflights/index.ts'

export const presetDarkModeTheme = definePreset(
  (options: PresetBuildVariableOptions = {}) => {
    options.selector = options.selector ?? 'dark'
    options.variablePrefix = options.variablePrefix ?? 'un-'

    const { theme, lightBase, darkBase } = generateTheme(options)

    return {
      name: 'unocss-preset-dark-mode-theme',
      layers: {
        theme: 0,
        default: 1,
      },
      theme,
      preflights: preflights(options, lightBase, darkBase),
      postprocess: VarPrefixPostprocessor(options.variablePrefix),
    }
  },
)

export function VarPrefixPostprocessor(
  prefix: string,
): Postprocessor | undefined {
  if (prefix !== 'un-') {
    return (obj) => {
      obj.entries.forEach((i) => {
        i[0] = i[0].replace(/^--un-/, `--${prefix}`)
        if (typeof i[1] === 'string') {
          i[1] = i[1].replace(/var\(--un-/g, `var(--${prefix}`)
        }
      })
    }
  }
}
