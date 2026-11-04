import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ElPagination } from 'element-plus'
import { ElTablePro } from '../../index'
import type { TableProRequest } from '../types'

const columns = [{ prop: 'name', label: '姓名' }]

describe('TablePro data source and pagination', () => {
  it('从 request 切换到 data 时显示本地数据，不再保留远程数据', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: '远程用户' }],
      total: 1,
    })
    const requestSource = ref<TableProRequest<any> | undefined>(request)
    const dataSource = ref<any[]>([])
    const pagination = ref<any>(true)

    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request: requestSource.value,
        data: dataSource.value,
        rowKey: 'id',
        pagination: pagination.value,
      }),
    })
    const wrapper = mount(Host)

    await vi.waitFor(() => expect(wrapper.text()).toContain('远程用户'))

    requestSource.value = undefined
    dataSource.value = [{ id: 2, name: '本地用户' }]
    pagination.value = false
    await nextTick()

    await vi.waitFor(() => expect(wrapper.text()).toContain('本地用户'))
    expect(wrapper.text()).not.toContain('远程用户')
  })

  it('从 data 切换到 request 时自动加载', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: '远程用户' }],
      total: 1,
    })
    const requestSource = ref<TableProRequest<any> | undefined>(undefined)
    const dataSource = ref<any[]>([{ id: 2, name: '本地用户' }])

    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request: requestSource.value,
        data: dataSource.value,
        rowKey: 'id',
        pagination: false,
      }),
    })
    const wrapper = mount(Host)

    await vi.waitFor(() => expect(wrapper.text()).toContain('本地用户'))

    requestSource.value = request
    dataSource.value = []
    await nextTick()

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    await vi.waitFor(() => expect(wrapper.text()).toContain('远程用户'))
  })

  it('动态修改 pagination.pageSize 后同步分页和请求参数', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const pageSize = ref(20)

    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        pagination: { pageSize: pageSize.value },
      }),
    })
    const wrapper = mount(Host)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    pageSize.value = 50
    await nextTick()

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2))
    expect(request.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 1,
      pageSize: 50,
    })
  })

  it('翻页一次只触发一次请求', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        pagination: { pageSize: 10 },
      }),
    })
    const wrapper = mount(Host)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    const pagination = wrapper.findComponent(ElPagination)
    await vi.waitFor(() => expect(wrapper.find('.el-pagination__total').text()).toContain('100'))
    const pageTwo = wrapper.findAll('.el-pager li').find(item => item.text() === '2')
    expect(pageTwo).toBeTruthy()
    await pageTwo!.trigger('click')


    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls.at(-1)?.[0]).toMatchObject({ page: 2 })
  })
})
