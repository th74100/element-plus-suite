import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ElementPlusSuite, {
  ElTablePro,
} from '../../index'

interface User {
  id: number
  name: string
}

const columns = [{ prop: 'name', label: '姓名' }] as const
const rows: User[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
]

describe('TablePro', () => {
  it('渲染本地数据', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: columns as any,
        data: rows,
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('张三'))
    expect(wrapper.text()).toContain('李四')
  })

  it('不传 columns 时使用空数组渲染', () => {
    const wrapper = mount(ElTablePro, {
      props: {
        rowKey: 'id',
        pagination: false,
      },
    })

    expect(wrapper.find('.el-table').exists()).toBe(true)
  })

  it('不传 data 时使用空数组渲染', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: columns as any,
        rowKey: 'id',
        pagination: false,
      },
    })

    expect(wrapper.find('.el-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('No Data')
  })

  it('不传 pagination 时使用默认分页配置', async () => {
    const manyRows = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
    }))

    const wrapper = mount(ElTablePro, {
      props: {
        columns: columns as any,
        data: manyRows,
        rowKey: 'id',
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.text()).toContain('用户20'),
    )
    expect(wrapper.text()).not.toContain('用户21')
  })

  it('本地数据只显示当前页', async () => {
    const manyRows = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
    }))

    const wrapper = mount(ElTablePro, {
      props: {
        columns: columns as any,
        data: manyRows,
        rowKey: 'id',
        pagination: { pageSize: 10 },
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('用户10'))
    expect(wrapper.text()).not.toContain('用户11')
  })

  it('远程模式首次加载并请求第一页', async () => {
    const request = vi.fn().mockResolvedValue({
      data: rows,
      total: 2,
    })

    const wrapper = mount(ElTablePro, {
      props: {
        columns: columns as any,
        request,
        rowKey: 'id',
      },
    })

    await vi.waitFor(() => {
      expect(request).toHaveBeenCalledTimes(1)
    })

    expect(request.mock.calls[0][0]).toMatchObject({
      page: 1,
      pageSize: 20,
    })
    await vi.waitFor(() => expect(wrapper.text()).toContain('张三'))
  })

  it('通过 $attrs 透传 ElTable 属性', () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: columns as any,
        data: rows,
        rowKey: 'id',
        pagination: false,
      },
      attrs: {
        border: true,
        stripe: true,
      },
    })

    expect(
      wrapper.find('.el-table').classes(),
    ).toContain('el-table--border')
    expect(
      wrapper.find('.el-table').classes(),
    ).toContain('el-table--striped')
  })

  it('支持全局安装', () => {
    expect(typeof ElementPlusSuite.install).toBe('function')
  })
})





