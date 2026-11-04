import type { TableProColumn } from '../types'

export interface TableProMergeField<Row> {
  key: string
  getValue: (row: Row) => unknown
}

function getColumnField(column: TableProColumn<any>): string | undefined {
  return column.prop ?? column.property
}

function getFieldValue(row: unknown, field: string): unknown {
  if (row === null || typeof row !== 'object') return undefined

  const record = row as Record<string, unknown>
  if (Object.prototype.hasOwnProperty.call(record, field)) {
    return record[field]
  }

  if (!field.includes('.')) return undefined

  let value: unknown = record
  for (const segment of field.split('.')) {
    if (value === null || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[segment]
  }
  return value
}

function flattenColumns<Row>(
  columns: TableProColumn<Row>[],
): TableProColumn<Row>[] {
  return columns.flatMap((column) => {
    if (column.visible === false) return []
    return column.children?.length
      ? flattenColumns(column.children)
      : [column]
  })
}

/**
 * mergeFields 的顺序决定多级合并层级；autoMerge 列按列顺序补充。
 */
export function resolveMergeFields<Row>(
  columns: TableProColumn<Row>[],
  mergeFields: string[] = [],
): TableProMergeField<Row>[] {
  const leafColumns = flattenColumns(columns)
  const fieldMap = new Map<string, TableProColumn<Row>>()

  for (const column of leafColumns) {
    const field = getColumnField(column)
    if (field && !fieldMap.has(field)) fieldMap.set(field, column)
  }

  const seen = new Set<string>()
  const fields: TableProMergeField<Row>[] = []

  const append = (field: string | undefined) => {
    if (!field || seen.has(field) || !fieldMap.has(field)) return
    seen.add(field)
    fields.push({
      key: field,
      getValue: row => getFieldValue(row, field),
    })
  }

  mergeFields.forEach(append)
  leafColumns.forEach((column) => {
    if (column.autoMerge) append(getColumnField(column))
  })

  return fields
}

/**
 * 只合并连续同值。后一个字段必须处在前一个字段的同一组内。
 */
export function calculateRowSpans<Row>(
  dataSource: readonly Row[],
  fields: TableProMergeField<Row>[],
): Map<string, number[]> {
  const rowCount = dataSource.length
  const spanMap = new Map(
    fields.map(field => [field.key, Array.from({ length: rowCount }, () => 1)]),
  )

  if (!rowCount || !fields.length) return spanMap

  const values = dataSource.map(row => fields.map(field => field.getValue(row)))
  const groupStart = fields.map(() => 0)

  for (let rowIndex = 1; rowIndex <= rowCount; rowIndex += 1) {
    let parentContinues = true

    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex += 1) {
      const continues: boolean
        = rowIndex < rowCount
          && parentContinues
          && values[rowIndex][fieldIndex] === values[rowIndex - 1][fieldIndex]

      if (!continues) {
        const spans = spanMap.get(fields[fieldIndex].key)!
        const start = groupStart[fieldIndex]
        const length = rowIndex - start

        spans[start] = length
        for (let index = start + 1; index < rowIndex; index += 1) {
          spans[index] = 0
        }
        groupStart[fieldIndex] = rowIndex
      }

      parentContinues = continues
    }
  }

  return spanMap
}

export function hasTreeRows(
  dataSource: readonly unknown[],
  childrenField = 'children',
): boolean {
  return dataSource.some((row) => {
    if (row === null || typeof row !== 'object') return false
    const children = (row as Record<string, unknown>)[childrenField]
    return Array.isArray(children) && children.length > 0
  })
}

