import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ElTablePro } from '../../index'

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
})

