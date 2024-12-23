import type { PresetOptions } from 'unocss'
import type { Theme } from 'unocss/preset-mini'

type UnoCssThemeKeys = 'colors' | 'accentColor' | 'textColor' | 'backgroundColor' | 'borderColor' | 'shadowColor'

export interface Colors {
  [key: string]: Colors & {
      DEFAULT?: string;
  } | string;
}

export type ColorsTheme = Pick<Theme, UnoCssThemeKeys>

export interface PresetBuildVariableOptions {
  /**
   * 將黑暗模式主題綁定的 class name or media
   * @default 'dark'
   */
  selector?: 'media' | string
  /**
   * Prefix for CSS variables.
   *
   * @default 'un-'
   */
  variablePrefix?: string
  /**
   * 主題顏色設定
   */
  theme?: ColorsTheme | { light: ColorsTheme; dark: ColorsTheme }
}
