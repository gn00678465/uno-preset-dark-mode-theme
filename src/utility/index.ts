import type { PresetBuildVariableOptions } from '../types'

/**
 * 包裝成 css variable 格式
 * @param name 
 * @param fallback 
 * @returns 
 */
export function wrapVar(name: string, fallback?: string) {
  if (/var\(.*\)/.test(name)) return name
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`
}

/**
 * 包裝成 css rgb 格式
 * @param str
 * @returns 
 */
export function wrapRGB(str: string) {
  if (str.startsWith('rgb')) return str
  return `rgb(${str})`
}

/**
 * 包裝成 css hsl 格式
 * @param str
 * @returns 
 */
export function wrapHSL(str: string) {
  if (str.startsWith('hsl')) return str
  return `hsl(${str})`
}
