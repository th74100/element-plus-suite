import type { VNode } from 'vue'
import type {
  ElTable,
  TableColumnCtx,
  TableInstance,
  TableProps,
} from 'element-plus'

export interface TableProRequestParams {
  page: number | null
  pageSize: number | null
  signal: AbortSignal
}

export interface TableProRequestResult<Row> {
  data: Row[]
  total: number
}

export type TableProRequest<Row> = (
  params: TableProRequestParams,
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
  formatter?: (row: any, column: TableColumnCtx<any>, cellValue: any, index: number) => string | VNode
  selectable?: (row: any, index: number) => boolean
  reserveSelection?: boolean
  filterMethod?: (value: string, row: any, column: TableColumnCtx<any>) => void
  filteredValue?: string[]
  filters?: { text: string; value: string }[]
  filterPlacement?: string
  filterMultiple?: boolean
  filterClassName?: string
  index?: number | ((index: number) => number)
  sortOrders?: ('ascending' | 'descending' | null)[]
}

export interface TableProColumnExtra<Row> {
  visible?: boolean
  slot?: string
  headerSlot?: string
  children?: TableProColumn<Row>[]
}

export type TableProColumn<Row> =
  Omit<
    ElTableColumnProps,
    'prop' | 'children' | 'formatter'
  > &
    TableProColumnExtra<Row> & {
      prop?: Extract<keyof Row, string>
      formatter?: (
        row: Row,
        column: TableColumnCtx<any>,
        cellValue: unknown,
        index: number,
      ) => string | VNode | undefined
    }

export interface TableProPagination {
  page?: number
  pageSize?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
}

export interface TableProOwnProps<Row> {
  columns?: TableProColumn<Row>[]
  request?: TableProRequest<Row>
  pagination?: false | TableProPagination
  loading?: boolean
}

type ElTableProps = Partial<TableProps>

export type TableProProps<
  Row extends Record<string, any>,
> = Omit<ElTableProps, 'data' | 'rowKey'> &
  TableProOwnProps<Row> & {
    data?: Row[]
    rowKey:
      | (keyof Row & string)
      | ((row: Row) => string | number)
  }

export interface TableProOwnInstance {
  reload: (options?: { page?: number }) => Promise<void>
}

export type TableProInstance =
  TableProOwnInstance & TableInstance

export const TABLE_PRO_DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
} as const

export type ResolvedTableProPagination = {
  page: number
  pageSize: number
  pageSizes: readonly number[]
  layout: string
  background: boolean
}

export function normalizePagination(
  pagination: false | TableProPagination | undefined,
): ResolvedTableProPagination | null {
  if (pagination === false) return null

  return {
    ...TABLE_PRO_DEFAULT_PAGINATION,
    ...(pagination ?? {}),
  }
}




