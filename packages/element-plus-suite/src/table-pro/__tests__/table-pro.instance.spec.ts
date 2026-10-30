import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ElTablePro, type TableProInstance } from '../../index'

const columns = [{ prop: 'name', label: '姓名' }]

function getInstance(wrapper: ReturnType<typeof mount>) {
  return wrapper.vm as unknown as TableProInstance
}

describe('TablePro instance API', () => {
  it('reload 不带参数时刷新当前页', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: '张三' }],
      total: 1,
    })

    const wrapper = mount(ElTablePro, {
      props: { columns, request, rowKey: 'id' },
    })

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    await getInstance(wrapper).reload()
    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls[1][0]).toMatchObject({
      page: 1,
      pageSize: 20,
    })
  })

  it('reload 支持指定页码', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [],
      total: 0,
    })

    const wrapper = mount(ElTablePro, {
      props: { columns, request, rowKey: 'id' },
    })

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    await getInstance(wrapper).reload({ page: 3 })

    expect(request.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 3,
      pageSize: 20,
    })
  })

  it('原生实例方法可以从 TablePro 直接调用', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          { type: 'selection' },
          { prop: 'name', label: '姓名' },
        ],
        data: [{ id: 1, name: '张三' }],
        rowKey: 'id',
      },
    })

    await vi.waitFor(() =>
      expect(typeof getInstance(wrapper).clearSelection).toBe('function'),
    )

    expect(() => getInstance(wrapper).clearSelection()).not.toThrow()
  })
})
