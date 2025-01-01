import { describe, expect, test } from 'vitest'
import { convertToHSL, convertToRGB, recursiveTheme } from './helpers.ts'
import type { ColorsTheme } from '../types.ts'

describe('convertToRGB', () => {
  test('should be define', () => {
    expect(convertToRGB).toBeDefined()
  })

  test('should return type rgb', () => {
    const fromHEX = convertToRGB('#ff0000')
    expect(fromHEX).toHaveProperty('type', 'rgb')
    expect(fromHEX).toHaveProperty('alpha', undefined)

    const fromRGB = convertToRGB('rgba(0, 255, 255, 0.5)')
    expect(fromRGB).toHaveProperty('type', 'rgb')
    expect(fromRGB).toHaveProperty('alpha', undefined)

    const fromHSL = convertToRGB('hsl(60, 100%, 50%)')
    expect(fromHSL).toHaveProperty('type', 'rgb')
    expect(fromHSL).toHaveProperty('alpha', undefined)
  })
})

describe('convertToHSL', () => {
  test('should be define', () => {
    expect(convertToHSL).toBeDefined()
  })

  test('should return type hsl', () => {
    const fromHEX = convertToHSL('#ff0000')
    expect(fromHEX).toHaveProperty('type', 'hsl')
    expect(fromHEX).toHaveProperty('alpha', undefined)

    const fromRGB = convertToHSL('rgba(0, 255, 255, 0.5)')
    expect(fromRGB).toHaveProperty('type', 'hsl')
    expect(fromRGB).toHaveProperty('alpha', undefined)

    const fromHSL = convertToHSL('hsl(60, 100%, 50%)')
    expect(fromHSL).toHaveProperty('type', 'hsl')
    expect(fromHSL).toHaveProperty('alpha', undefined)
  })
})

describe('recursiveTheme', () => {
  test('should be defined', () => {
    expect(recursiveTheme).toBeDefined()
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

  test('非 objet 回傳原值', () => {
    const notObj = 'test' as ColorsTheme
    expect(recursiveTheme(notObj)).toBe(notObj)

    const fakeObj = null as unknown as ColorsTheme
    expect(recursiveTheme(fakeObj)).toBe(null)
  })
})
