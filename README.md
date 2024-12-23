# preset-dark-mode-theme

## Usages

```ts
import { presetDarkModeTheme } from '@uno-preset/preset-dark-mode-theme'

Unocss<Theme>({
  // Configure light themes
  theme: {
  },
  presets: [
    presetUno<Theme>(),
    presetDarkModeTheme({
      theme: {
        // Configure dark themes
        dark: {
        },
        // Configure light themes
        light: {
        }
      }
    })
  ]
})

```

## Options

### selector

預設為 'dark'
1. 使用 media - `@media (prefers-color-scheme: dark or light){}`
2. 使用自定義 class 名稱或使用預設值 - `:root{} :root.dark{}`

### variablePrefix

The prefix of the generated css variables, default is `un-`

### theme

Your different theme. like `{} or { dark: {}, other: {} }`