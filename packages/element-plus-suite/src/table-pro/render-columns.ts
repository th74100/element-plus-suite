import type { Slots, VNode } from 'vue'
import { h } from 'vue'
import { ElTableColumn } from 'element-plus'
import type { TableProColumn } from './types'

/**
 * 把列配置转换成 ElTableColumn 节点。
 *
 * 注意：ElTable 依赖直接子节点注册列，所以调用方必须把返回值
 * 直接放进 ElTable 的默认插槽，不能再包一层组件。
 */
export function renderTableColumns(
  columns: TableProColumn<any>[],
  slots: Slots,
): VNode[] {
  return columns.flatMap((column) => {
    if (column.visible === false) return []

    const {
      visible: _visible,
      slot,
      headerSlot,
      children,
      formatter,
      ...rest
    } = column

    const columnProps: Record<string, any> = { ...rest }

    // formatter 统一返回字符串，避免和 Element Plus 的 VNode 类型冲突。
    if (formatter) {
      columnProps.formatter = (
        row: any,
        col: any,
        value: any,
        index: number,
      ) => {
        const result = formatter(row, col, value, index)
        return result == null ? '' : String(result)
      }
    }

    // TablePro 的 slot 字段映射成 ElTableColumn 的具名插槽。
    const columnSlots: Record<string, (scope: any) => any> = {}
    const cellSlot = slot ? slots[slot] : undefined
    const header = headerSlot ? slots[headerSlot] : undefined
    if (cellSlot) columnSlots.default = cellSlot as any
    if (header) columnSlots.header = header as any

    if (children?.length) {
      return [
        h(ElTableColumn, columnProps, {
          default: () => renderTableColumns(children, slots),
        }),
      ]
    }

    return [
      h(
        ElTableColumn,
        columnProps,
        Object.keys(columnSlots).length ? columnSlots : undefined,
      ),
    ]
  })
}
