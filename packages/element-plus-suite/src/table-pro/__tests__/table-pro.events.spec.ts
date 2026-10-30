import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ElTablePro } from '../../index'

const columns = [{ prop: 'name', label: '姓名' }]

describe('TablePro events', () => {
  it('透传原生 cell-click 事件', async () => {
    const handler = vi.fn()
    const wrapper = mount(ElTablePro, {
      props: {
        columns,
        data: [{ id: 1, name: '张三' }],
        rowKey: 'id',
        pagination: false,
      },
      attrs: {
        onCellClick: handler,
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.el-table__body tbody tr td').exists()).toBe(true),
    )
    await wrapper.find('.el-table__body tbody tr td').trigger('click')
    expect(handler).toHaveBeenCalled()
  })

  it('加载成功后触发 loaded', async () => {
    const loaded = vi.fn()
    const request = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: '张三' }],
      total: 1,
    })

    mount(ElTablePro, {
      props: {
        columns,
        request,
        rowKey: 'id',
      },
      attrs: {
        onLoaded: loaded,
      },
    })

    await vi.waitFor(() =>
      expect(loaded).toHaveBeenCalledTimes(1),
    )
  })
})
