import { mount } from '@vue/test-utils'
import { h } from 'vue'
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
        columns: [{ prop: 'status', label: '状态', slot: 'status' }],
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

  it('支持 render 渲染函数', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            prop: 'status',
            label: '状态',
            render: ({ row, $index }) =>
              h('span', { class: 'render-cell' }, `${row.status}-${$index}`),
          },
        ],
        data: [{ id: 1, status: 'active' }],
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.render-cell').exists()).toBe(true),
    )
    expect(wrapper.find('.render-cell').text()).toBe('active-0')
  })

  it('formatter 返回 VNode 时保留 VNode', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            prop: 'status',
            label: '状态',
            formatter: () => h('span', { class: 'formatter-cell' }, '启用'),
          },
        ],
        data: [{ id: 1, status: 'active' }],
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.formatter-cell').exists()).toBe(true),
    )
    expect(wrapper.find('.formatter-cell').text()).toBe('启用')
    expect(wrapper.text()).not.toContain('[object Object]')
  })

  it('插槽优先于 render', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            prop: 'status',
            label: '状态',
            slot: 'status',
            render: () => h('span', { class: 'render-cell' }, 'render'),
          },
        ],
        data: [{ id: 1, status: 'active' }],
        rowKey: 'id',
        pagination: false,
      },
      slots: {
        status: '<span class="slot-cell">slot</span>',
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.slot-cell').exists()).toBe(true),
    )
    expect(wrapper.find('.render-cell').exists()).toBe(false)
  })

  it('支持 headerRender 渲染函数', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            prop: 'name',
            label: '姓名',
            headerRender: ({ column }) =>
              h('span', { class: 'header-render-cell' }, column.label),
          },
        ],
        data: [{ id: 1, name: '张三' }],
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.header-render-cell').exists()).toBe(true),
    )
    expect(wrapper.find('.header-render-cell').text()).toBe('姓名')
  })

  it('headerSlot 优先于 headerRender', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            prop: 'name',
            label: '姓名',
            headerSlot: 'name-header',
            headerRender: () =>
              h('span', { class: 'header-render-cell' }, 'render'),
          },
        ],
        data: [{ id: 1, name: '张三' }],
        rowKey: 'id',
        pagination: false,
      },
      slots: {
        'name-header': '<span class="header-slot-cell">slot</span>',
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.header-slot-cell').exists()).toBe(true),
    )
    expect(wrapper.find('.header-render-cell').exists()).toBe(false)
  })

  it('分组列支持父级 headerSlot', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          {
            label: '用户信息',
            headerSlot: 'group-header',
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
      slots: {
        'group-header': '<span class="group-header-cell">自定义用户信息</span>',
      },
    })

    await vi.waitFor(() =>
      expect(wrapper.find('.group-header-cell').exists()).toBe(true),
    )
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('邮箱')
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
