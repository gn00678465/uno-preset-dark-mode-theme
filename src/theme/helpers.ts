import { parseCssColor } from '@unocss/rule-utils'
import { wrapRGB, wrapVar } from '../utility/index.ts'
import { colord, extend } from 'colord'
import namesPlugin from "colord/plugins/names"
import type {
  Colors,
  ColorsTheme,
  PresetDarkModeThemeOptions,
} from '../types.ts'

extend([namesPlugin])

/**
 * 取得傳入的 theme 設定
 * @param theme
 * @returns
 */
export function getTheme(theme: PresetDarkModeThemeOptions['theme']) {
  if (!theme) return { light: {}, dark: {} }
  if ('light' in theme && 'dark' in theme) return theme
  return { light: theme, dark: theme }
}

/**
 * 轉換為 rgba 格式,支援透明度
 * @param color 輸入顏色(支援 hex, rgb, rgba, hsl, hsla, named colors)
 * @returns 解析後的 CSS 顏色物件
 */
export const convertToRGB = (color?: string) => {
  if (color && colord(color).isValid()) {
    const { r, g, b, a } = colord(color).toRgb()
    return parseCssColor(a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`)
  }
}

/**
 * 轉換為 hsla 格式,支援透明度
 * @param color 輸入顏色(支援 hex, rgb, rgba, hsl, hsla, named colors)
 * @returns 解析後的 CSS 顏色物件
 */
export const convertToHSL = (color?: string) => {
  if (color && colord(color).isValid()) {
    const { h, s, l, a } = colord(color).toHsl()
    return parseCssColor(a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`)
  }
}

/**
 * 遞迴處理傳入的 theme
 * @param curTheme
 * @param prefix
 * @param map
 * @returns
 */
export const recursiveTheme = (
  curTheme: ColorsTheme,
  prefix?: string,
  base: Record<string, string | number> = {},
) => {
  // Early return for empty object
  if (!curTheme || typeof curTheme !== 'object') return curTheme

  const transformedTheme: ColorsTheme = {} as ColorsTheme

  // Optimize: Use Object.entries for direct key-value iteration
  Object.entries(curTheme).forEach(([themeKey, currentColors]) => {
    // Closure to avoid recreating function in each recursion
    const transformColors = (
      colors: Colors,
      currentKeys: string[] = [],
    ): Colors => {
      // Avoid creating new object if not necessary
      if (typeof colors !== 'object') return colors

      const transformedColors: Colors = {}

      for (const [colorKey, colorValue] of Object.entries(colors)) {
        // Optimize: Combine key generation
        const fullKeys = [...currentKeys, colorKey]

        if (typeof colorValue === 'string') {
          // Generate CSS variable key - NOW INCLUDING THEME KEY
          const cssVarKey = `--${prefix}${[themeKey, ...fullKeys].join('-')}`

          // Mutate map more efficiently
          base[cssVarKey] = colorValue

          // Assign CSS variable to transformed colors
          transformedColors[colorKey] = wrapRGB(wrapVar(cssVarKey))
        } else if (typeof colorValue === 'object' && colorValue !== null) {
          // Recursive call with accumulated keys
          transformedColors[colorKey] = transformColors(colorValue, fullKeys)
        }
      }

      return transformedColors
    }

    // Transform and assign to transformed theme
    transformedTheme[themeKey as keyof ColorsTheme] = transformColors(
      currentColors,
    )
  })

  return transformedTheme
}
