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
      render,
      headerRender,
      autoMerge: _autoMerge,
      children,
      ...rest
    } = column
    const columnProps: Record<string, any> = { ...rest }

    // 把 TablePro 的 slot 字段映射成 ElTableColumn 的具名插槽。
    const columnSlots: Record<string, (scope: any) => any> = {}
    const cellSlot = slot ? slots[slot] : undefined
    const header = headerSlot ? slots[headerSlot] : undefined
    if (cellSlot) {
      columnSlots.default = cellSlot as any
    }
    else if (render) {
      columnSlots.default = (scope: any) =>
        render({
          row: scope.row,
          column: scope.column,
          $index: scope.$index,
        })
    }
    if (header) {
      columnSlots.header = header as any
    }
    else if (headerRender) {
      columnSlots.header = (scope: any) =>
        headerRender({
          column: scope.column,
          $index: scope.$index,
          store: scope.store,
          _self: scope._self,
        })
    }

    if (children?.length) {
      const groupSlots: Record<string, (scope: any) => any> = {
        default: () => renderTableColumns(children, slots),
      }
      if (columnSlots.header) groupSlots.header = columnSlots.header

      return [h(ElTableColumn, columnProps, groupSlots)]
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
