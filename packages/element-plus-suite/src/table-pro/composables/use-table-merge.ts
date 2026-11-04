import {
  computed,
  type ComputedRef,
  type ShallowRef,
} from 'vue'
import type {
  TableProColumn,
  TableProSpanMethodParams,
  TableProTableInstance,
  TableProTableProps,
} from '../types'
import {
  calculateRowSpans,
  hasTreeRows,
  resolveMergeFields,
} from '../utils/merge-cells'

interface UseTableMergeOptions<Row> {
  tableRef: ShallowRef<TableProTableInstance | null>
  columns: () => TableProColumn<Row>[]
  data: ComputedRef<Row[]>
  mergeFields: () => string[]
  userSpanMethod: () => TableProTableProps['spanMethod']
  treeProps: () => TableProTableProps['treeProps']
  lazy: () => boolean
}

export function useTableMerge<Row>(options: UseTableMergeOptions<Row>) {
  const mergeFields = computed(() =>
    resolveMergeFields(options.columns(), options.mergeFields()),
  )
  const renderedData = computed(() => {
    if (!mergeFields.value.length) return options.data.value
    const tableData = options.tableRef.value?.store?.states?.data?.value
    return (tableData ?? options.data.value) as Row[]
  })

  const spanMap = computed(() => {
    if (!mergeFields.value.length || options.lazy()) {
      return new Map<string, number[]>()
    }

    const childrenField = options.treeProps()?.children ?? 'children'
    const dataSource = renderedData.value
    if (hasTreeRows(dataSource, childrenField)) {
      return new Map<string, number[]>()
    }

    return calculateRowSpans(dataSource, mergeFields.value)
  })

  const spanMethod = computed(() => {
    const userSpanMethod = options.userSpanMethod()
    if (!mergeFields.value.length) return userSpanMethod

    return (params: TableProSpanMethodParams<Row>) => {
      const customResult = userSpanMethod?.(params)
      if (customResult !== undefined) return customResult

      const property = params.column.property
      const rowSpan = property
        ? spanMap.value.get(property)?.[params.rowIndex]
        : undefined

      if (rowSpan === undefined || rowSpan === 1) return undefined
      return { rowspan: rowSpan, colspan: 1 }
    }
  })

  return {
    spanMethod,
    spanMap,
  }
}