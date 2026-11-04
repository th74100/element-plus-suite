import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ElConfigProvider, ElPagination } from 'element-plus'
import de from 'element-plus/es/locale/lang/de'
import { ElTablePro } from '../../index'

const columns = [{ prop: 'name', label: '姓名' }]

describe('TablePro pagination', () => {
  it('pagination=false 时不渲染分页器', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [{ prop: 'name', label: '姓名' }],
        data: Array.from({ length: 25 }, (_, index) => ({
          id: index + 1,
          name: `用户${index + 1}`,
        })),
        rowKey: 'id',
        pagination: false,
      },
    })

    expect(wrapper.find('.el-pagination').exists()).toBe(false)
    await vi.waitFor(() => expect(wrapper.text()).toContain('用户25'))
  })

  it('继承使用方 ElConfigProvider 的 locale', async () => {
    const Host = defineComponent({
      setup: () => () => h(
        ElConfigProvider,
        { locale: de },
        {
          default: () => h(ElTablePro, {
            columns,
            data: [],
            rowKey: 'id',
            pagination: { pageSize: 10 },
          }),
        },
      ),
    })
    const wrapper = mount(Host)

    await vi.waitFor(() =>
      expect(wrapper.find('.el-pagination__total').text()).toBe('Gesamt 0'),
    )
  })
  it('外部更新 pagination.page 时同步分页器', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const page = ref(1)
    const Host = defineComponent({
      setup: () => () => h(ElTablePro, {
        columns,
        request,
        rowKey: 'id',
        pagination: { page: page.value, pageSize: 10 },
      }),
    })
    const wrapper = mount(Host)

    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    page.value = 3
    await nextTick()

    await vi.waitFor(() =>
      expect(wrapper.findComponent(ElPagination).props('currentPage')).toBe(3),
    )
    expect(request.mock.calls.at(-1)?.[0]).toMatchObject({
      page: 3,
      pageSize: 10,
    })
  })
})
