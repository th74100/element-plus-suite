import type { Ref, VNode, VNodeChild } from 'vue'
import type { FormProConfig, FormProSchemaItem } from '../form-pro/types'

/**
 * 表格列在运行时由 Element Plus 提供。
 * 这里只声明组件库会用到的公共字段，其余字段保持开放
 */
export interface TableProColumnContext<Row = any> {
  id?: string
  realWidth?: number | null
  type?: string
  label?: string
  className?: string
  labelClassName?: string
  property?: string
  prop?: string
  width?: string | number
  minWidth?: string | number
  renderHeader?: (data: any) => VNode
  sortable?: boolean | string
  sortMethod?: (a: Row, b: Row) => number
  sortBy?: string | ((row: Row, index: number, array?: Row[]) => string) | string[]
  formatter?: (row: Row, column: TableProColumnContext<Row>, cellValue: any, index: number) => string | VNode
  filters?: { text: string; value: string }[]
  filteredValue?: string[]
  children?: TableProColumnContext<Row>[]
  [key: string]: any
}

export interface TableProTableStore {
  states?: {
    data?: Ref<any[]>
    columns?: Ref<TableProColumnContext<any>[]>
  }
  [key: string]: any
}

/**
 * 使用 Proxy 暴露 ElTable 实例能力。
 */
export interface TableProTableInstance {
  store: TableProTableStore
  setCurrentRow: (row: any) => void
  getSelectionRows?: () => any
  toggleRowSelection: (row: any, selected?: boolean) => void
  clearSelection: () => void
  clearFilter: (columnKeys?: string | string[]) => void
  toggleAllSelection: () => void
  toggleRowExpansion: (row: any, expanded?: boolean) => void
  clearSort: () => void
  doLayout: () => void
  sort: (prop: string, order: string) => void
  [key: string]: any
}

export interface TableProTreeProps {
  hasChildren?: string
  children?: string
  [key: string]: any
}

export interface TableProSpanMethodParams<Row = any> {
  row: Row
  rowIndex: number
  column: TableProColumnContext<Row>
  columnIndex: number
}

export type TableProSpanMethodResult =
  | number[]
  | { rowspan: number; colspan: number }
  | undefined

export type TableProSpanMethod<Row = any> = (
  params: TableProSpanMethodParams<Row>,
) => TableProSpanMethodResult

/** TablePro 使用的 ElTable 公共属性；其余原生属性通过开放索引接收。 */
export interface TableProTableProps {
  spanMethod?: TableProSpanMethod
  treeProps?: TableProTreeProps
  [key: string]: any
}
export interface TableProRequestParams<Query = Record<string, any>> {
  page: number | null
  pageSize: number | null
  query: Query
  signal: AbortSignal
}

export interface TableProRequestResult<Row> {
  data: Row[]
  total: number
}


export interface TableProColumnHeaderRenderScope<Row extends Record<string, any>> {
  column: TableProColumnContext<Row>
  $index: number
  store: TableProTableInstance['store']
  _self: unknown
}
export interface TableProColumnRenderScope<Row> {
  row: Row
  column: TableProColumnContext<any>
  $index: number
}

export type TableProRequest<
  Row,
  Query = Record<string, any>,
> = (
  params: TableProRequestParams<Query>,
) => Promise<TableProRequestResult<Row>>

type ElTableColumnProps = {
  type?: string
  label?: string
  className?: string
  labelClassName?: string
  property?: string
  prop?: string
  width?: string | number
  minWidth?: string | number
  renderHeader?: (data: any) => VNode
  sortable?: boolean | string
  sortMethod?: (a: any, b: any) => number
  sortBy?: string | ((row: any, index: number, array?: any[]) => string) | string[]
  resizable?: boolean
  columnKey?: string
  align?: string
  headerAlign?: string
  showOverflowTooltip?: boolean | Record<string, any>
  tooltipFormatter?: (data: any) => string
  fixed?: boolean | string
  formatter?: (row: any, column: TableProColumnContext<any>, cellValue: any, index: number) => string | VNode
  selectable?: (row: any, index: number) => boolean
  reserveSelection?: boolean
  filterMethod?: (value: string, row: any, column: TableProColumnContext<any>) => void
  filteredValue?: string[]
  filters?: { text: string; value: string }[]
  filterPlacement?: string
  filterMultiple?: boolean
  filterClassName?: string
  index?: number | ((index: number) => number)
  sortOrders?: ('ascending' | 'descending' | null)[]
  [key: string]: any
}

export interface TableProColumnExtra<Row> {
  visible?: boolean
  slot?: string
  headerSlot?: string
  /** 使用渲染函数生成单元格内容 */
  render?: (scope: TableProColumnRenderScope<Row>) => VNodeChild
  /** 使用渲染函数生成表头内容 */
  headerRender?: (scope: TableProColumnHeaderRenderScope<Row & Record<string, any>>) => VNodeChild
  /** 当前页内连续相同值时自动合并单元格 */
  autoMerge?: boolean
  children?: TableProColumn<Row>[]
}

export type TableProColumn<Row> =
  Omit<
    ElTableColumnProps,
    'prop' | 'children' | 'formatter'
  > &
    TableProColumnExtra<Row> & {
      prop?: string
      formatter?: (
        row: Row,
        column: TableProColumnContext<any>,
        cellValue: unknown,
        index: number,
      ) => string | VNode | undefined
    }

export interface TableProPagination {
  page?: number
  pageSize?: number
  pageSizes?: number[]
  pagerCount?: number
  layout?: string
  background?: boolean
}

export interface TableProFilterConfigExtension extends FormProConfig {
  /** 是否显示筛选表单的展开/收起按钮 */
  showCollapseButton?: boolean
  /** 收起时显示的行数，默认 1 */
  collapseRows?: number
  /** 收起时显示的字段数量；设置后优先于 collapseRows */
  collapseCount?: number
  /** 是否默认收起；显示折叠按钮时默认 true */
  collapsed?: boolean
}

export interface TableProFilterConfig<Query = Record<string, any>> {
  schema: FormProSchemaItem[]
  formConfig?: TableProFilterConfigExtension
  model?: Query
  defaultValue?: Query
}

export interface TableProOwnProps<Row, Query = Record<string, any>> {
  columns?: TableProColumn<Row>[]
  request?: TableProRequest<Row, Query>
  pagination?: boolean | TableProPagination
  /** 按数组顺序依次合并连续同值字段 */
  mergeFields?: string[]
  /** 已应用的检索条件对象 */
  query?: Query
  /** 可选的筛选表单配置 */
  filter?: TableProFilterConfig<Query>
}

type ElTableProps = Partial<TableProTableProps>

export type TableProProps<
  Row extends Record<string, any>,
  Query = Record<string, any>,
> = Omit<ElTableProps, 'data' | 'rowKey'> &
  TableProOwnProps<Row, Query> & {
    data?: Row[]
    rowKey:
      | (keyof Row & string)
      | ((row: Row) => string | number)
  }

export interface TableProOwnInstance {
  reload: (options?: { page?: number }) => Promise<void>
  search: () => Promise<void>
  resetFilter: () => Promise<void>
}

export type TableProInstance =
  TableProOwnInstance & TableProTableInstance

export const TABLE_PRO_DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
  pageSizes: [10, 20, 50, 100],
  pagerCount: 5,
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
} as const

export type ResolvedTableProPagination = {
  page: number
  pageSize: number
  pageSizes: readonly number[]
  pagerCount: number
  layout: string
  background: boolean
}

export function normalizePagination(
  pagination: boolean | TableProPagination | undefined,
): ResolvedTableProPagination | null {
  if (pagination === false) return null

  const config = pagination === true ? {} : (pagination ?? {})

  return {
    ...TABLE_PRO_DEFAULT_PAGINATION,
    ...config,
  }
}
