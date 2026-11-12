import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ElTablePro } from '../../index'

const columns = [{ prop: 'name', label: '姓名' }]
const data = [{ id: 1, name: '张三' }]

function mountTablePro(
  props: Record<string, any>,
  slots?: Record<string, () => any>,
) {
  return mount({
    setup() {
      return () => h(ElTablePro as any, props, slots)
    },
  })
}

describe('TablePro title bar', () => {
  it('未配置标题栏时不渲染 header', () => {
    const wrapper = mountTablePro({
      columns,
      data,
      rowKey: 'id',
      pagination: false,
    })

    expect(wrapper.find('.eps-table-pro__header').exists()).toBe(false)
  })

  it('headerTitle 渲染内置标题', () => {
    const wrapper = mountTablePro({
      columns,
      data,
      rowKey: 'id',
      pagination: false,
      headerTitle: '高级表格',
    })

    expect(wrapper.find('.eps-table-pro__header-title').text()).toBe('高级表格')
  })

  it('headerTitle 插槽完全替换 headerTitle 属性', () => {
    const wrapper = mountTablePro(
      {
        columns,
        data,
        rowKey: 'id',
        pagination: false,
        headerTitle: '高级表格',
      },
      {
        'headerTitle': () => h('button', { class: 'slot-title' }, '新增'),
      },
    )

    expect(wrapper.find('.slot-title').text()).toBe('新增')
    expect(wrapper.text()).not.toContain('高级表格')
  })

  it('自定义 toolbar 位于内置工具之前', () => {
    const wrapper = mountTablePro(
      {
        columns,
        data,
        rowKey: 'id',
        pagination: false,
        headerTitle: '高级表格',
        options: { reload: true },
      },
      {
        toolbar: () => h('button', { class: 'custom-tool' }, '自定义工具'),
      },
    )

    const toolbar = wrapper.get('.eps-table-pro__toolbar')
    const children = Array.from(toolbar.element.children)
    expect(children[0].classList.contains('eps-table-pro__toolbar-actions')).toBe(true)
    expect(children[1].classList.contains('eps-table-pro__toolbar-options')).toBe(true)
    expect(wrapper.find('.custom-tool').exists()).toBe(true)
    expect(wrapper.find('[aria-label="刷新"]').exists()).toBe(true)
  })

  it('密度使用 Dropdown 并更新 ElTable size', async () => {
    const wrapper = mountTablePro({
      columns,
      data,
      rowKey: 'id',
      pagination: false,
      options: { density: true },
      size: 'large',
    })

    expect(wrapper.findComponent({ name: 'ElDropdown' }).exists()).toBe(true)
    expect(wrapper.find('.el-table').classes()).toContain('el-table--large')

    wrapper.findComponent({ name: 'ElDropdown' }).vm.$emit('command', 'small')
    await nextTick()

    expect(wrapper.find('.el-table').classes()).toContain('el-table--small')
  })

  it('点击刷新按钮重新执行 request', async () => {
    const request = vi.fn().mockResolvedValue({
      data,
      total: data.length,
    })
    const wrapper = mountTablePro({
      columns,
      request,
      rowKey: 'id',
      headerTitle: '高级表格',
      options: { reload: true },
    })

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    await wrapper.get('[aria-label="刷新"]').trigger('click')
    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2))
  })

  it('全屏按钮切换根节点状态，Escape 可退出', async () => {
    const wrapper = mountTablePro({
      columns,
      data,
      rowKey: 'id',
      pagination: false,
      headerTitle: '高级表格',
      options: { fullscreen: true },
    })

    await wrapper.get('[aria-label="全屏"]').trigger('click')
    await nextTick()
    expect(wrapper.get('.eps-table-pro').classes()).toContain('is-fullscreen')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.get('.eps-table-pro').classes()).not.toContain('is-fullscreen')

    wrapper.unmount()
  })
})
