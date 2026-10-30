---
title: ElTablePro Props
description: ElTablePro 的 columns、data、request、pagination 和 ElTable 原生属性。
---
# Props

ElTablePro 继承 ElTable 的全部属性，并新增以下四项。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| columns | `TableProColumn<Row>[]` | 必填 | 列配置，支持 ElTableColumn 属性和插槽字段 |
| data | Row[] | [] | 表数据 |
| request | `TableProRequest<Row>` | undefined | 远程请求函数 |
| pagination | false \| TableProPagination | {} | 省略时启用默认分页，false 时关闭 |
| loading | boolean | false | 外部加载状态，与内部请求状态合并 |

## columns

columns 中除 slot、headerSlot、visible 和 children 外的字段，会作为 ElTableColumn 属性传入。

```ts
const columns: TableProColumn<User>[] = [
  { prop: 'name', label: '姓名', minWidth: 140 },
  {
    prop: 'status',
    label: '状态',
    filters: [{ text: '启用', value: 'active' }],
    slot: 'status',
  },
  {
    label: '联系方式',
    children: [
      { prop: 'email', label: '邮箱', minWidth: 220 },
      { prop: 'phone', label: '电话', minWidth: 160 },
    ],
  },
]
```

设置 visible: false 可以隐藏列，但保留配置。

## request

```ts
type `TableProRequest<Row>` = (params: {
  page: number | null
  pageSize: number | null
  signal: AbortSignal
}) => Promise<{
  data: Row[]
  total: number
}>
```

- page 和 pageSize 在关闭分页时为 null。
- signal 用于取消已经过期的请求，是否传入请求库由使用者决定。
- 返回值必须是 data 和 total，接口原始结构请在函数内部转换。

## pagination

```ts
interface TableProPagination {
  page?: number
  pageSize?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
}
```

默认配置为：

```ts
{
  page: 1,
  pageSize: 20,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
}
```
