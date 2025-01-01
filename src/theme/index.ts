import { convertToRGB, getTheme, recursiveTheme } from './helpers.ts'
import type { PresetDarkModeThemeOptions } from '../types.ts'

export function generateTheme(options: PresetDarkModeThemeOptions) {
  const { light, dark } = getTheme(options.theme)

  const lightBase = {}, darkBase = {}

  const lightTheme = recursiveTheme(light, options.variablePrefix, lightBase)
  recursiveTheme(dark, options.variablePrefix, darkBase)

  function handler(base: Record<string, string>) {
    return Object.fromEntries(
      Object.entries(base).map((
        [k, v],
      ) => [k, convertToRGB(v)?.components.join(' ')]).filter(([, v]) => !!v),
    )
  }

  return {
    theme: lightTheme,
    lightBase: handler(lightBase),
    darkBase: handler(darkBase),
  }
}
