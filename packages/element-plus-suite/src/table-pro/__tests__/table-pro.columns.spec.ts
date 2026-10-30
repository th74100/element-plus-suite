import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ElTablePro } from '../../index'

describe('TablePro columns', () => {
  it('隐藏 visible=false 的列', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          { prop: 'name', label: '姓名' },
          { prop: 'email', label: '邮箱', visible: false },
        ],
        data: [{ id: 1, name: '张三', email: 'a@b.com' }],
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('姓名'))
    expect(wrapper.text()).not.toContain('邮箱')
  })

  it('支持单元格具名插槽', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            prop: 'status',
            label: '状态',
            slot: 'status',
          },
        ],
        data: [{ id: 1, status: 'active' }],
        rowKey: 'id',
        pagination: false,
      },
      slots: {
        status: '<span class="status-cell">启用</span>',
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.status-cell').exists()).toBe(true),
    )
  })

  it('渲染分组列', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            label: '用户信息',
            children: [
              { prop: 'name', label: '姓名' },
              { prop: 'email', label: '邮箱' },
            ],
          },
        ],
        data: [{ id: 1, name: '张三', email: 'a@b.com' }],
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('用户信息'))
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('邮箱')
  })
})
