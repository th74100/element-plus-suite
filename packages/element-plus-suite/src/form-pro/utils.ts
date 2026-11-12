import type { FormProSchemaItem, FormProValue } from './types/index'

/** 根据 schema 生成表单初始值。 */
export function getSchemaDefaults(
  schema: FormProSchemaItem[],
): FormProValue {
  const entries = schema.flatMap((item) => {
    const current = item.key && !item.children?.length
      ? [[item.key, item.defaultValue]]
      : []
    const children = getSchemaDefaults(item.children ?? [])
    return [...current, ...Object.entries(children)]
  })
  return Object.fromEntries(entries)
}

/** 判断当前是否由外部传入 model。 */
export function hasModelValue(value: unknown): value is FormProValue {
  return value != null && typeof value === 'object'
}