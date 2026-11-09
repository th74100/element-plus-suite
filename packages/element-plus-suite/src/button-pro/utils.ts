import type { ButtonProGradientValue } from './types'

export function normalizeGradient(
  gradient: ButtonProGradientValue,
): string {
  if (typeof gradient === 'string')
    return gradient.trim()

  const { from, to, angle = 135 } = gradient
  return `linear-gradient(${angle}deg, ${from}, ${to})`
}
/**
 * 延迟读取源对象属性，使包装组件在内部实例挂载后仍能自动转发实例能力。
 */
export function exposeFrom<T extends object>(
  getSource: () => T | undefined,
): T {
  return new Proxy({} as T, {
    get(_target, key) {
      return getSource()?.[key as keyof T]
    },
    has(_target, key) {
      const source = getSource()
      return Boolean(source && key in source)
    },
  })
}
