import { mount } from '@vue/test-utils'
import { defineComponent, h, reactive, ref, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ElTablePro, type TableProInstance } from '../index'

const columns = [{ prop: 'name', label: '姓名' }]

function mountTable(filter: any) {
  const request = vi.fn().mockResolvedValue({ data: [], total: 100 })
  const Host = defineComponent({
    setup: () => () => h(ElTablePro, {
      columns,
      request,
      rowKey: 'id',
      filter,
      pagination: { pageSize: 10 },
    }),
  })
  const wrapper = mount(Host)
  return { wrapper, request }
}

describe('TablePro filter', () => {
  it('渲染筛选表单', async () => {
    const { wrapper } = mountTable({
      schema: [
        { key: 'keyword', label: '关键词', type: 'input', col: { span: 8 } },         { key: 'status', label: '状态', type: 'input', col: { span: 8 } },       ],
      model: { keyword: 'old' },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.eps-table-pro').exists()).toBe(true)
    expect(wrapper.find('.el-form').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('未点击查询时，分页请求仍使用已应用条件', async () => {
    const model = { keyword: 'old' }
    const { wrapper, request } = mountTable({
      schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
      model,
    })

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    expect(request.mock.calls[0][0]).toMatchObject({
      query: { keyword: 'old' },
    })

    const input = wrapper.find('input')
    await input.setValue('draft')

    const pageTwo = wrapper.findAll('.el-pager li').find(item => item.text() === '2')
    await pageTwo!.trigger('click')

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2))
    expect(request.mock.calls[1][0]).toMatchObject({
      page: 2,
      query: { keyword: 'old' },
    })
  })

  it('search 使用当前筛选条件并回到第一页', async () => {
    const { wrapper, request } = mountTable({
      schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
      model: { keyword: '' },
    })

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    await wrapper.find('input').setValue('new')
    await (wrapper.findComponent(ElTablePro).vm as unknown as TableProInstance).search()

    expect(request.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 1,
      query: { keyword: 'new' },
    })
  })
})
describe('TablePro filter buttons', () => {
  it('筛选表单默认使用查询文案', async () => {
    const { wrapper } = mountTable({
      schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.el-form button').map(button => button.text())).toEqual([
      '查询',
      '重置',
    ])
  })
})

describe('TablePro filter collapse', () => {
  it('只对筛选表单启用展开和收起', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        filter: {
          schema: [
            { key: 'a', label: 'A', type: 'input', col: { span: 8 } },
            { key: 'b', label: 'B', type: 'input', col: { span: 8 } },
            { key: 'c', label: 'C', type: 'input', col: { span: 8 } },
            { key: 'd', label: 'D', type: 'input', col: { span: 8 } },
            { key: 'e', label: 'E', type: 'input', col: { span: 8 } },
          ],
          formConfig: {
            showCollapseButton: true,
            collapseRows: 1,
          },
        },
      }),
    })
    const wrapper = mount(Host)

    await wrapper.vm.$nextTick()
    const visibleInputs = () => wrapper.findAll('.el-form-item__content input').length
    expect(visibleInputs()).toBe(2)

    const expandButton = wrapper.findAll('button').find(button => button.text() === '展开')
    expect(expandButton).toBeTruthy()
    await expandButton!.trigger('click')
    expect(visibleInputs()).toBe(5)

    const collapseButton = wrapper.findAll('button').find(button => button.text() === '收起')
    expect(collapseButton).toBeTruthy()
    await collapseButton!.trigger('click')
    expect(visibleInputs()).toBe(2)
  })
})

describe('TablePro filter collapsed default', () => {
  it('启用折叠按钮后默认收起', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
    const { wrapper } = mountTable({
      schema: [
        { key: 'a', label: 'A', type: 'input', col: { span: 8 } },
        { key: 'b', label: 'B', type: 'input', col: { span: 8 } },
        { key: 'c', label: 'C', type: 'input', col: { span: 8 } },
      ],
      formConfig: {
        showCollapseButton: true,
        collapseRows: 1,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.el-form-item__content input')).toHaveLength(2)
  })
})

describe('TablePro query prop', () => {
  it('外部 query 变化后同步检索条件并重新请求', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const query = reactive({ keyword: 'old' })
    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        query,
      }),
    })
    mount(Host)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    query.keyword = 'new'
    await nextTick()
    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    expect(request.mock.calls[1][0]).toMatchObject({
      query: { keyword: 'new' },
    })
  })
})

describe('TablePro external state reset', () => {
  it('外部 query 取消后清空已应用条件', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const query = ref<Record<string, any> | undefined>({ keyword: 'old' })
    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        query: query.value,
      }),
    })
    mount(Host)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    query.value = undefined
    await nextTick()
    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    expect(request.mock.calls[1][0]).toMatchObject({ query: {} })
  })

  it('外部 filter.model 取消后恢复筛选默认值', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const filter = ref<any>({
      schema: [{ key: 'keyword', label: '关键词', defaultValue: 'default' }],
      model: { keyword: 'old' },
    })
    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        filter: filter.value,
      }),
    })
    const wrapper = mount(Host)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    expect((wrapper.find('.el-form input').element as HTMLInputElement).value).toBe('old')

    filter.value = {
      schema: [{ key: 'keyword', label: '关键词', defaultValue: 'default' }],
      model: undefined,
    }
    await nextTick()
    await vi.waitFor(() => {
      expect((wrapper.find('.el-form input').element as HTMLInputElement).value).toBe('default')
    })
  })
})
describe('TablePro auto filter model', () => {
  it('filter 只传 schema 时自动生成查询条件', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        filter: {
          schema: [
            { key: 'keyword', label: '关键词', type: 'input', defaultValue: 'phone' },
            { key: 'status', label: '状态', type: 'input', defaultValue: 'active' },
          ],
        },
      }),
    })
    mount(Host)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    expect(request.mock.calls[0][0]).toMatchObject({
      query: {
        keyword: 'phone',
        status: 'active',
      },
    })
  })
})
describe('TablePro filter slots', () => {
  it('forwards filter-* slots to the filter form', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const Host = defineComponent({
      setup: () => () => h(
        ElTablePro,
        {
          columns,
          request,
          rowKey: 'id',
          filter: {
            schema: [
              { key: 'keyword', label: 'Keyword', type: 'input' },
            ],
          },
        },
        {
          'filter-keyword': ({ model }: any) => h('span', { class: 'custom-filter' }, model.keyword),
          'filter-buttons': () => h('button', { class: 'custom-buttons' }, 'Custom search'),
        },
      ),
    })
    const wrapper = mount(Host)

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.custom-filter').exists()).toBe(true)
    expect(wrapper.find('.custom-buttons').text()).toBe('Custom search')
  })
})
