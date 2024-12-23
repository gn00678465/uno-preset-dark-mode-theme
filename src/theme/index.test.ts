import { describe, expect, it } from 'vitest'
import { generateTheme } from './index.ts'
import { darkLightTheme } from '../../__test__/assets/test-theme-light-dark.ts'

describe('generateTheme', () => {
  it('should be defined', () => {
    expect(generateTheme).toBeDefined()
  })

  it('should return object', () => {
    const res = generateTheme({ theme: darkLightTheme, variablePrefix: 'un-' })
    expect(res).toBeTypeOf('object')
  })
})
