import { describe, expect, test } from 'vitest'
import { convertToHSL, convertToRGB, recursiveTheme } from './helpers.ts'
import type { Colors, ColorsTheme } from '../types.ts'

describe('convertToRGB', () => {
  test('should be define', () => {
    expect(convertToRGB).toBeDefined()
  })

  describe('HEX colors', () => {
    test('should convert 3-digit hex colors', () => {
      const result = convertToRGB('#fff')
      expect(result).toHaveProperty('type', 'rgb')
      expect(result?.components).toEqual(['255', '255', '255'])
    })

    test('should convert 6-digit hex colors', () => {
      const result = convertToRGB('#f0f0f0')
      expect(result).toHaveProperty('type', 'rgb')
      expect(result?.components).toEqual(['240', '240', '240'])
    })

    test('should convert black hex color', () => {
      const result = convertToRGB('#000000')
      expect(result).toHaveProperty('type', 'rgb')
      expect(result?.components).toEqual(['0', '0', '0'])
    })
  })

  describe('RGB colors', () => {
    test('should handle rgb format', () => {
      const result = convertToRGB('rgb(128, 128, 128)')
      expect(result).toHaveProperty('type', 'rgb')
      expect(result?.components).toEqual(['128', '128', '128'])
    })

    test('should handle rgba format with alpha', () => {
      const result = convertToRGB('rgba(0, 255, 255, 0.5)')
      expect(result).toHaveProperty('type', 'rgba')
      expect(result?.components).toEqual(['0', '255', '255'])
      expect(result?.alpha).toBe('0.5')
    })
  })

  describe('HSL colors', () => {
    test('should convert hsl to rgb', () => {
      const result = convertToRGB('hsl(0, 100%, 50%)')
      expect(result).toHaveProperty('type', 'rgb')
      expect(result?.components).toEqual(['255', '0', '0'])
    })

    test('should convert hsla to rgba', () => {
      const result = convertToRGB('hsla(180, 100%, 50%, 0.5)')
      expect(result).toHaveProperty('type', 'rgba')
      expect(result?.alpha).toBe('0.5')
    })
  })

  describe('Named colors', () => {
    test('should convert red', () => {
      const result = convertToRGB('red')
      expect(result).toHaveProperty('type', 'rgb')
      expect(result?.components).toEqual(['255', '0', '0'])
    })

    test('should convert blue', () => {
      const result = convertToRGB('blue')
      expect(result).toHaveProperty('type', 'rgb')
      expect(result?.components).toEqual(['0', '0', '255'])
    })
  })

  describe('Invalid inputs', () => {
    test('should handle null', () => {
      const result = convertToRGB(null as any)
      expect(result).toBeUndefined()
    })

    test('should handle undefined', () => {
      const result = convertToRGB(undefined)
      expect(result).toBeUndefined()
    })

    test('should handle empty string', () => {
      const result = convertToRGB('')
      expect(result).toBeUndefined()
    })

    test('should handle invalid color string', () => {
      const result = convertToRGB('not-a-color')
      expect(result).toBeUndefined()
    })
  })
})

describe('convertToHSL', () => {
  test('should be define', () => {
    expect(convertToHSL).toBeDefined()
  })

  describe('HEX colors', () => {
    test('should convert 3-digit hex colors', () => {
      const result = convertToHSL('#fff')
      expect(result).toHaveProperty('type', 'hsl')
      expect(result?.components).toEqual(['0', '0%', '100%'])
    })

    test('should convert 6-digit hex colors', () => {
      const result = convertToHSL('#f0f0f0')
      expect(result).toHaveProperty('type', 'hsl')
      expect(result?.components).toEqual(['0', '0%', '94%'])
    })

    test('should convert black hex color', () => {
      const result = convertToHSL('#000000')
      expect(result).toHaveProperty('type', 'hsl')
      expect(result?.components).toEqual(['0', '0%', '0%'])
    })
  })

  describe('RGB colors', () => {
    test('should convert rgb to hsl', () => {
      const result = convertToHSL('rgb(128, 128, 128)')
      expect(result).toHaveProperty('type', 'hsl')
      expect(result?.components).toEqual(['0', '0%', '50%'])
    })

    test('should convert rgba to hsla', () => {
      const result = convertToHSL('rgba(0, 255, 255, 0.5)')
      expect(result).toHaveProperty('type', 'hsla')
      expect(result?.components).toEqual(['180', '100%', '50%'])
      expect(result?.alpha).toBe('0.5')
    })
  })

  describe('HSL colors', () => {
    test('should preserve hsl values', () => {
      const result = convertToHSL('hsl(120, 100%, 50%)')
      expect(result).toHaveProperty('type', 'hsl')
      expect(result?.components).toEqual(['120', '100%', '50%'])
    })

    test('should preserve hsla values and alpha', () => {
      const result = convertToHSL('hsla(240, 100%, 50%, 0.5)')
      expect(result).toHaveProperty('type', 'hsla')
      expect(result?.components).toEqual(['240', '100%', '50%'])
      expect(result?.alpha).toBe('0.5')
    })
  })

  describe('Named colors', () => {
    test('should convert red', () => {
      const result = convertToHSL('red')
      expect(result).toHaveProperty('type', 'hsl')
      expect(result?.components).toEqual(['0', '100%', '50%'])
    })

    test('should convert blue', () => {
      const result = convertToHSL('blue')
      expect(result).toHaveProperty('type', 'hsl')
      expect(result?.components).toEqual(['240', '100%', '50%'])
    })
  })

  describe('Invalid inputs', () => {
    test('should handle null', () => {
      const result = convertToHSL(null as any)
      expect(result).toBeUndefined()
    })

    test('should handle undefined', () => {
      const result = convertToHSL(undefined)
      expect(result).toBeUndefined()
    })

    test('should handle empty string', () => {
      const result = convertToHSL('')
      expect(result).toBeUndefined()
    })

    test('should handle invalid color string', () => {
      const result = convertToHSL('not-a-color')
      expect(result).toBeUndefined()
    })
  })
})

describe('recursiveTheme', () => {
  test('should be defined', () => {
    expect(recursiveTheme).toBeDefined()
  })

  describe('Variable prefix handling', () => {
    test('should handle default un- prefix', () => {
      const theme = { colors: { primary: '#fff' } } as ColorsTheme
      const result = recursiveTheme(theme, 'un-')
      expect(result?.colors?.primary).toBe('rgb(var(--un-colors-primary))')
    })

    test('should handle custom prefix', () => {
      const theme = { colors: { primary: '#fff' } } as ColorsTheme
      const result = recursiveTheme(theme, 'custom-')
      expect(result?.colors?.primary).toBe('rgb(var(--custom-colors-primary))')
    })

    test('should handle empty prefix', () => {
      const theme = { colors: { primary: '#fff' } } as ColorsTheme
      const result = recursiveTheme(theme, '')
      expect(result?.colors?.primary).toBe('rgb(var(--colors-primary))')
    })
  })

  describe('Theme configuration', () => {
    test('should handle empty theme object', () => {
      const theme = {} as ColorsTheme
      const result = recursiveTheme(theme, 'theme-')
      expect(result).toEqual({})
    })

    test('should handle numeric color keys', () => {
      const theme = {
        colors: {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0'
        }
      } as ColorsTheme
      const result = recursiveTheme(theme, 'theme-')
      expect(result?.colors).toEqual({
        '50': 'rgb(var(--theme-colors-50))',
        '100': 'rgb(var(--theme-colors-100))',
        '200': 'rgb(var(--theme-colors-200))'
      })
    })

    test('should create CSS variables for simple theme object', () => {
      const theme = {
        colors: {
          neutral: '#FFF',
        },
        textColor: {
          'text-1': '#000000',
        },
      }

      const expectedBase = {
        '--theme-colors-neutral': '#FFF',
        '--theme-textColor-text-1': '#000000',
      }

      const expectTheme = {
        colors: {
          neutral: 'rgb(var(--theme-colors-neutral))',
        },
        textColor: {
          'text-1': 'rgb(var(--theme-textColor-text-1))',
        },
      }

      const externalBase: Record<string, string> = {}

      const result = recursiveTheme(theme, 'theme-', externalBase)
      expect(result).toEqual(expectTheme)
      expect(externalBase).toEqual(expectedBase)
    })

    test('should create CSS variables for nested theme object', () => {
      const originalTheme = {
        colors: {
          primary: {
            DEFAULT: '#3B82F6',
            light: '#60A5FA',
            dark: '#1D4ED8',
          },
          secondary: '#FF4500',
        },
        accentColor: {
          DEFAULT: '#10B981',
        },
        textColor: {
          DEFAULT: '#111827',
          muted: '#6B7280',
        },
        backgroundColor: {
          DEFAULT: '#FFFFFF',
          dark: '#1F2937',
        },
        borderColor: {
          DEFAULT: '#E5E7EB',
        },
        shadowColor: {
          DEFAULT: '#000000',
        },
      }

      const expected = {
        colors: {
          primary: {
            DEFAULT: 'rgb(var(--theme-colors-primary-DEFAULT))',
            light: 'rgb(var(--theme-colors-primary-light))',
            dark: 'rgb(var(--theme-colors-primary-dark))',
          },
          secondary: 'rgb(var(--theme-colors-secondary))',
        },
        accentColor: { DEFAULT: 'rgb(var(--theme-accentColor-DEFAULT))' },
        textColor: {
          DEFAULT: 'rgb(var(--theme-textColor-DEFAULT))',
          muted: 'rgb(var(--theme-textColor-muted))',
        },
        backgroundColor: {
          DEFAULT: 'rgb(var(--theme-backgroundColor-DEFAULT))',
          dark: 'rgb(var(--theme-backgroundColor-dark))',
        },
        borderColor: { DEFAULT: 'rgb(var(--theme-borderColor-DEFAULT))' },
        shadowColor: { DEFAULT: 'rgb(var(--theme-shadowColor-DEFAULT))' },
      }

      const result = recursiveTheme(originalTheme, 'theme-')
      expect(result).toEqual(expected)
    })
  })

  describe('Error handling', () => {
    test('非 object 回傳原值', () => {
      const notObj = 'test' as ColorsTheme
      expect(recursiveTheme(notObj)).toBe(notObj)

      const fakeObj = null as unknown as ColorsTheme
      expect(recursiveTheme(fakeObj)).toBe(null)
    })

    test('should handle missing values', () => {
      const theme = {
        colors: {} as Colors
      } as ColorsTheme
      const result = recursiveTheme(theme, 'theme-')
      expect(result?.colors).toEqual({})
    })

    test('should handle empty string values', () => {
      const theme = {
        colors: {
          primary: ''
        }
      } as ColorsTheme
      const result = recursiveTheme(theme, 'theme-')
      expect(result?.colors?.primary).toBe('rgb(var(--theme-colors-primary))')
    })
  })
})
