import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ElTablePro } from '../../index'
import type { TableProColumn } from '../types'
import {
  calculateRowSpans,
  resolveMergeFields,
} from '../utils/merge-cells'

interface Member {
  id: number
  city: string
  area: string
  name: string
}

const dataSource: Member[] = [
  { id: 1, city: '上海', area: '浦东', name: '张三' },
  { id: 2, city: '上海', area: '浦东', name: '李四' },
  { id: 3, city: '北京', area: '浦东', name: '王五' },
]

const columns: TableProColumn<Member>[] = [
  { prop: 'city', label: '城市' },
  { prop: 'area', label: '区域' },
  { prop: 'name', label: '姓名' },
]

describe('TablePro auto merge', () => {
  it('mergeFields 按层级合并连续同值', () => {
    const fields = resolveMergeFields(columns, ['city', 'area'])
    const spans = calculateRowSpans(dataSource, fields)

    expect(spans.get('city')).toEqual([2, 0, 1])
    expect(spans.get('area')).toEqual([2, 0, 1])
  })

  it('列配置 autoMerge 会被解析，非连续同值不合并', () => {
    const fields = resolveMergeFields(
      [
        { prop: 'city', label: '城市', autoMerge: true },
        { prop: 'name', label: '姓名' },
      ],
      [],
    )
    const spans = calculateRowSpans(
      [dataSource[0], dataSource[2], dataSource[1]],
      fields,
    )

    expect(spans.get('city')).toEqual([1, 1, 1])
  })

  it('组件渲染生成的单元格 rowspan', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns,
        data: dataSource,
        rowKey: 'id',
        pagination: false,
        mergeFields: ['city', 'area'],
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('张三'))

    const rows = wrapper.findAll('.el-table__body tbody tr')
    const firstCells = rows[0].findAll('td')
    expect(firstCells[0].attributes('rowspan')).toBe('2')
    expect(firstCells[1].attributes('rowspan')).toBe('2')
    expect(rows[1].findAll('td')).toHaveLength(1)
  })

  it('autoMerge 列可单独开启合并', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [{ prop: 'city', label: '城市', autoMerge: true }],
        data: dataSource,
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('上海'))
    const rows = wrapper.findAll('.el-table__body tbody tr')
    expect(rows[0].find('td').attributes('rowspan')).toBe('2')
  })

  it('用户 span-method 返回 undefined 时回退自动合并', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [{ prop: 'city', label: '城市', autoMerge: true }],
        data: dataSource,
        rowKey: 'id',
        pagination: false,
      },
      attrs: {
        spanMethod: () => undefined,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('上海'))
    expect(
      wrapper.findAll('.el-table__body tbody tr')[0]
        .find('td')
        .attributes('rowspan'),
    ).toBe('2')
  })
  it('用户 span-method 明确返回时优先', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [{ prop: 'city', label: '城市', autoMerge: true }],
        data: dataSource,
        rowKey: 'id',
        pagination: false,
      },
      attrs: {
        spanMethod: () => ({ rowspan: 1, colspan: 1 }),
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('上海'))
    expect(
      wrapper.findAll('.el-table__body tbody tr')[0]
        .find('td')
        .attributes('rowspan'),
    ).toBe('1')
  })

  it('开启合并不会自动添加表格边框', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [{ prop: 'city', label: '城市', autoMerge: true }],
        data: dataSource,
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('上海'))
    expect(wrapper.find('.el-table').classes()).not.toContain('el-table--border')
  })

  it('树形数据跳过自动合并', async () => {
    const wrapper = mount(ElTablePro, {
      props: {
        columns: [{ prop: 'city', label: '城市', autoMerge: true }],
        data: [
          {
            id: 1,
            city: '上海',
            children: [{ id: 2, city: '上海' }],
          },
        ],
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('上海'))
    const rows = wrapper.findAll('.el-table__body tbody tr')
    expect(rows.every(row => row.find('td').attributes('rowspan') === '1')).toBe(true)
  })

  it('本地排序后按最终展示顺序重新计算', async () => {
    const unsortedData: Member[] = [
      { id: 1, city: '上海', area: '浦东', name: 'banana' },
      { id: 2, city: '北京', area: '海淀', name: 'apple' },
      { id: 3, city: '上海', area: '浦东', name: 'cherry' },
    ]

    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          { prop: 'city', label: '城市', autoMerge: true },
          {
            prop: 'name',
            label: '姓名',
            sortable: true,
            sortMethod: (left: Member, right: Member) =>
              left.name.localeCompare(right.name),
          },
        ],
        data: unsortedData,
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('banana'))
    await wrapper.find('.caret-wrapper .sort-caret.ascending').trigger('click')

    await vi.waitFor(() => {
      const rows = wrapper.findAll('.el-table__body tbody tr')
      expect(rows[1].find('td').text()).toContain('上海')
      expect(rows[1].find('td').attributes('rowspan')).toBe('2')
      expect(rows[2].findAll('td')).toHaveLength(1)
    })
  })

  it('本地筛选后不保留失效的合并', async () => {
    const filterData: Member[] = [
      { id: 1, city: '上海', area: '浦东', name: 'apple' },
      { id: 2, city: '上海', area: '浦东', name: 'banana' },
      { id: 3, city: '北京', area: '海淀', name: 'cherry' },
    ]

    const wrapper = mount(ElTablePro, {
      props: {
        columns: [
          { prop: 'city', label: '城市', autoMerge: true },
          {
            prop: 'name',
            label: '姓名',
            filters: [{ text: 'banana', value: 'banana' }],
            filterMethod: (value: string, row: Member) => row.name === value,
          },
        ],
        data: filterData,
        rowKey: 'id',
        pagination: false,
      },
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('apple'))
    const tableStore = (wrapper.findComponent({ name: 'ElTable' }).vm as any).store
    const nameColumn = tableStore.states.columns.value.find(
      (column: any) => column.property === 'name',
    )

    tableStore.commit('filterChange', {
      column: nameColumn,
      values: ['banana'],
    })

    await vi.waitFor(() => {
      const rows = wrapper.findAll('.el-table__body tbody tr')
      expect(rows).toHaveLength(1)
      expect(rows[0].findAll('td')).toHaveLength(2)
      expect(rows[0].find('td').attributes('rowspan')).toBe('1')
    })
  })
})


