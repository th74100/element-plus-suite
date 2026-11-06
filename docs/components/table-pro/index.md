---
title: Table 表格 | Element Plus Suite
description: 基于 Element Plus 的表格组件，支持列定义、分页和远程请求。
---
<script setup lang="ts">
import BasicDemo from './demos/basic.vue'
import FilteredDemo from './demos/filtered.vue'
import FilterSlotDemo from './demos/filter-slot.vue'
import RemoteDemo from './demos/remote.vue'
import SlotDemo from './demos/slots.vue'
import HeaderDemo from './demos/header.vue'
import HeaderRenderDemo from './demos/header-render.vue'
import GroupedHeaderDemo from './demos/grouped-header.vue'
import MergeDemo from './demos/merge.vue'
import MergeDemoNoBorder from './demos/merge-noborder.vue'
import ColumnMergeDemo from './demos/column-merge.vue'
import RenderDemo from './demos/render.vue'
import EventsDemo from './demos/events.vue'
</script>

# Table 表格

ElTablePro 的诞生是为了解决项目中需要写很多 Table 的样板代码的问题，所以在其中封装了很多常用的逻辑。这些封装可以简单的分类为预设行为与预设逻辑。

## 基础用法
通过配置快速生成表格

<Demo>
  <BasicDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
  status: '在线' | '离开'
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 140 },
  { prop: 'status', label: '状态', width: 100 },
]

const dataSource: Member[] = [
  { id: 1, name: '林晓', role: '产品设计', status: '在线' },
  { id: 2, name: '陈默', role: '前端开发', status: '离开' },
  { id: 3, name: '周宁', role: '数据分析', status: '在线' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    :pagination="false"
  />
</template>
```
  </template>
</Demo>


## 请求数据源

`request` 是 ElTablePro 最重要的 API。它接收 `page`、`pageSize` 和 `signal`，返回值必须包含 `data` 与 `total`。

<Demo>
  <RemoteDemo />
  <template #code>

```vue
<template>
  <ElTablePro
    :columns="columns"
    :request="requestUsers"
    row-key="id"
    :pagination="{ pageSize: 10, layout: 'total, prev, pager, next' }"
  />
</template>

<script setup lang="ts">
import {
  ElTablePro,
  type TableProColumn,
  type TableProRequest,
} from 'element-plus-suite'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  company: {
    name: string
    department: string
  }
}

const USER_API = 'https://dummyjson.com/users'

const columns: TableProColumn<User>[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'firstName', label: '名', minWidth: 120 },
  { prop: 'lastName', label: '姓', minWidth: 120 },
  { prop: 'email', label: '邮箱', minWidth: 240, showOverflowTooltip: true },
  { prop: 'age', label: '年龄', width: 90 },
  { prop: 'company.name', label: '公司', minWidth: 220 },
  { prop: 'company.department', label: '部门', minWidth: 140 },
]

const requestUsers: TableProRequest<User> = async ({
  page,
  pageSize,
  signal,
}) => {
  const limit = pageSize ?? 10
  const skip = ((page ?? 1) - 1) * limit
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: 'id,firstName,lastName,email,age,company',
  })

  const response = await fetch(`${USER_API}?${params}`, { signal })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  const payload = await response.json()

  return {
    data: payload.users,
    total: payload.total,
  }
}
</script>
```

  </template>
</Demo>

## 高级筛选

通过 `filter` 配置开启

<Demo>
  <FilteredDemo />
  <template #code>

```vue
<template>
  <ElTablePro
    :columns="columns"
    :request="requestProducts"
    :filter="filter"
    row-key="id"
    :pagination="{ pageSize: 10, layout: 'total, prev, pager, next' }"
  />
</template>

<script setup lang="ts">
import {
  ElTablePro,
  type TableProColumn,
  type TableProFilterConfig,
  type TableProRequest,
} from 'element-plus-suite'

interface Product {
  id: number
  title: string
  category: string
  brand: string
  price: number
  rating: number
  stock: number
  meta: {
    updatedAt: string
  }
}

interface ProductQuery {
  keyword: string
  category: string
  modifiedAfter: string
}

interface ProductResponse {
  products: Product[]
  total: number
}

const PRODUCT_API = 'https://dummyjson.com/products'

const columns: TableProColumn<Product>[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'title', label: '商品名称', minWidth: 240, showOverflowTooltip: true },
  { prop: 'category', label: '分类', minWidth: 150 },
  { prop: 'brand', label: '品牌', minWidth: 130 },
  {
    prop: 'price',
    label: '价格',
    width: 100,
    formatter: (_row, _column, value) => `$${value}`,
  },
  { prop: 'rating', label: '评分', width: 90 },
  {
    prop: 'meta.updatedAt',
    label: '最后修改',
    minWidth: 180,
    formatter: (_row, _column, value) => new Date(value).toLocaleString(),
  },
]

const filter: TableProFilterConfig<ProductQuery> = {
  schema: [
    {
      key: 'keyword',
      label: '商品名称',
      defaultValue: '',
      col: { span: 8 },
      fieldProps: { placeholder: '搜索商品名称' },
    },
    {
      key: 'category',
      label: '分类',
      type: 'select',
      defaultValue: '',
      col: { span: 8 },
      fieldProps: {
        options: [
          { name: '美妆', id: 'beauty' },
          { name: '香水', id: 'fragrances' },
          { name: '家具', id: 'furniture' },
          { name: '食品', id: 'groceries' },
        ],
        props: {
          label: 'name',
          value: 'id',
        },
      },
    },
    {
      key: 'modifiedAfter',
      label: '修改日期',
      type: 'date',
      defaultValue: '',
      col: { span: 8 },
      fieldProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
        placeholder: '选择开始日期',
        style: {
          width: '100%',
        },
      },
    },
  ],
  formConfig: {
    showCollapseButton: true,
    collapseRows: 1,
  },
}

const requestProducts: TableProRequest<Product, ProductQuery> = async ({
  page,
  pageSize,
  query,
  signal,
}) => {
  const limit = pageSize ?? 10
  const skip = ((page ?? 1) - 1) * limit
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: 'id,title,category,brand,price,rating,stock,meta',
  })

  let url = PRODUCT_API

  if (query.keyword.trim()) {
    url = `${PRODUCT_API}/search`
    params.set('q', query.keyword.trim())
  }
  else if (query.category) {
    url = `${PRODUCT_API}/category/${query.category}`
  }

  if (query.modifiedAfter) {
    params.set('modifiedAfter', query.modifiedAfter)
  }

  const response = await fetch(`${url}?${params}`, { signal })
  if (!response.ok) throw new Error(`请求失败：${response.status}`)

  const payload = await response.json() as ProductResponse

  return {
    data: payload.products,
    total: payload.total,
  }
}
</script>
```

  </template>
</Demo>

### 自定义筛选字段

ElTablePro 会将 `filter-*`（* 代表 schema 中的 key）前缀的插槽转发给内部 ElFormPro。下面示例使用插槽自定义搜索项。

<Demo>
  <FilterSlotDemo />
  <template #code>

```vue
<template>
  <ElTablePro
    ref="tableRef"
    :columns="columns"
    :request="requestOrders"
    :filter="filter"
    row-key="id"
    :pagination="false"
  >
    <template #filter-customer="{ model }">
      <ElSelect
        v-model="model.customer"
        placeholder="请选择客户"
        clearable
        style="width: 100%"
      >
        <ElOption label="全部客户" value="" />
        <ElOption label="林晓" value="林晓" />
        <ElOption label="陈默" value="陈默" />
        <ElOption label="周宁" value="周宁" />
        <ElOption label="许知远" value="许知远" />
        <ElOption label="李夏" value="李夏" />
      </ElSelect>
    </template>

    <template #filter-status="{ model }">
      <ElSelect
        v-model="model.status"
        placeholder="请选择状态"
        clearable
        style="width: 100%"
      >
        <ElOption label="全部状态" value="" />
        <ElOption label="正常" value="正常" />
        <ElOption label="待确认" value="待确认" />
        <ElOption label="已取消" value="已取消" />
      </ElSelect>
    </template>

    <template #filter-buttons>
      <ElButton @click="tableRef?.resetFilter()">重置</ElButton>
      <ElButton type="primary" @click="tableRef?.search()">查询</ElButton>
    </template>

    <template #status="{ row }">
      <ElTag :type="statusType(row.status)" effect="light">
        {{ row.status }}
      </ElTag>
    </template>
  </ElTablePro>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElButton,
  ElOption,
  ElSelect,
  ElTag,
} from 'element-plus'
import {
  ElTablePro,
  type TableProColumn,
  type TableProFilterConfig,
  type TableProInstance,
  type TableProRequest,
} from 'element-plus-suite'

interface Order {
  id: number
  number: string
  customer: string
  amount: number
  status: '正常' | '待确认' | '已取消'
}

interface OrderFilter {
  number: string
  customer: string
  status: string
}

const tableRef = ref<TableProInstance>()

const columns: TableProColumn<Order>[] = [
  { prop: 'number', label: '订单号', minWidth: 150 },
  { prop: 'customer', label: '客户', minWidth: 140 },
  {
    prop: 'amount',
    label: '金额',
    width: 120,
    align: 'right',
    formatter: (_row, _column, value) => `¥${Number(value).toLocaleString()}`,
  },
  { prop: 'status', label: '状态', width: 110, slot: 'status' },
]

const dataSource: Order[] = [
  { id: 1, number: 'SO-2026-001', customer: '林晓', amount: 1280, status: '正常' },
  { id: 2, number: 'SO-2026-002', customer: '陈默', amount: 760, status: '待确认' },
  { id: 3, number: 'SO-2026-003', customer: '周宁', amount: 2300, status: '正常' },
  { id: 4, number: 'SO-2026-004', customer: '许知远', amount: 420, status: '已取消' },
  { id: 5, number: 'SO-2026-005', customer: '李夏', amount: 1680, status: '待确认' },
]

const filter: TableProFilterConfig<OrderFilter> = {
  schema: [
    {
      key: 'number',
      label: '订单号',
      type: 'input',
      defaultValue: '',
      fieldProps: { placeholder: '请输入订单号' },
    },
    {
      key: 'customer',
      label: '客户',
      type: 'select',
      defaultValue: '',
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      defaultValue: '',
    },
  ],
  formConfig: {
    // 一行 1 / 2 / 3 / 4 列随屏幕变化
    col: { span: 24, sm: 12, md: 8, xl: 6 },
    collapseRows: 1,
    showCollapseButton: true,
  },
}

const requestOrders: TableProRequest<Order, OrderFilter> = async ({ query }) => {
  const data = dataSource.filter((item) => {
    const numberMatched = !query.number || item.number.includes(query.number)
    const customerMatched = !query.customer || item.customer === query.customer
    const statusMatched = !query.status || item.status === query.status

    return numberMatched && customerMatched && statusMatched
  })

  return {
    data,
    total: data.length,
  }
}

function statusType(status: Order['status']): 'success' | 'warning' | 'info' {
  return status === '正常' ? 'success' : status === '待确认' ? 'warning' : 'info'
}
</script>
```

  </template>
</Demo>

## 自定义列

### 自定义单元格

在 `columns` 中配置 `slot`，然后在组件上提供同名插槽：

<Demo>
  <SlotDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Order {
  id: number
  number: string
  amount: number
  status: '正常' | '待确认'
}

const columns: TableProColumn<Order>[] = [
  { prop: 'number', label: '订单号', minWidth: 150 },
  { prop: 'amount', label: '金额', width: 120, align: 'right' },
  { prop: 'status', label: '状态', width: 110, slot: 'status' },
  { label: '操作', width: 140, fixed: 'right', slot: 'actions' },
]
const dataSource: Order[] = [
  { id: 1, number: 'SO-2026-001', amount: 1280, status: '正常' },
  { id: 2, number: 'SO-2026-002', amount: 760, status: '待确认' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    row-key="id"
    :pagination="false"
  >
    <template #status="{ row }">
      <ElTag :type="row.status === '正常' ? 'success' : 'warning'">
        {{ row.status }}
      </ElTag>
    </template>
    <template #actions="{ row }">
      <ElButton link type="primary">
        查看
      </ElButton>
    </template>
  </ElTablePro>
</template>
```

  </template>
</Demo>

### 渲染函数

除了 `slot`，也可以在列配置中使用 `render`， 接收 `{ row, column, $index }`，返回 VNode 或文本内容

<Demo>
  <RenderDemo />
  <template #code>

```vue
<script setup lang="ts">
import { h } from 'vue'
import { ElAvatar } from 'element-plus'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
  color: string
}

const columns: TableProColumn<Member>[] = [
  {
    prop: 'name',
    label: '成员',
    minWidth: 220,
    render: ({ row }) => h('div', { class: 'member-cell' }, [
      h(ElAvatar, {
        size: 28,
        style: { backgroundColor: row.color },
      }, { default: () => row.name.slice(0, 1) }),
      h('span', row.name),
    ]),
  },
  { prop: 'role', label: '角色', minWidth: 160 },
]

const dataSource: Member[] = [
  { id: 1, name: '林晓', role: '产品设计', color: '#409eff' },
  { id: 2, name: '陈默', role: '前端开发', color: '#67c23a' },
  { id: 3, name: '周宁', role: '数据分析', color: '#e6a23c' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    row-key="id"
    :pagination="false"
  />
</template>

<style>
.member-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
```
  </template>
</Demo>

### 自定义表头

通过 `headerSlot` 自定义表头内容

<Demo>
  <HeaderDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Task {
  id: number
  title: string
  score: number
}

const columns: TableProColumn<Task>[] = [
  { prop: 'title', label: '任务', minWidth: 180 },
  { prop: 'score', label: '评分', width: 140, headerSlot: 'score-header' },
]

const dataSource: Task[] = [
  { id: 1, title: '整理接口文档', score: 86 },
  { id: 2, title: '补充单元测试', score: 92 },
  { id: 3, title: '优化表格性能', score: 78 },
]
</script>

<template>
  <ElTablePro :columns="columns" :data="dataSource" row-key="id" :pagination="false">
    <template #score-header>
      <span class="custom-header">
        <span>评分</span>
        <small>百分制</small>
      </span>
    </template>
  </ElTablePro>
</template>

<style scoped>
.custom-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.custom-header small {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  font-weight: 400;
}
</style>
```

  </template>
</Demo>

### 表头渲染函数

表头也可以使用 `headerRender`。它接收 `{ column, $index }`，返回 VNode 或文本内容

<Demo>
  <HeaderRenderDemo />
  <template #code>

```vue
<script setup lang="ts">
import { h } from 'vue'
import { ElTooltip } from 'element-plus'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Task {
  id: number
  title: string
  score: number
}

const columns: TableProColumn<Task>[] = [
  { prop: 'title', label: '任务', minWidth: 180 },
  {
    prop: 'score',
    width: 140,
    headerRender: () => h('span', { class: 'header-render' }, [
      '评分',
      h(ElTooltip, { content: '按百分制评分' }, {
        default: () => h('span', { class: 'header-render__tip' }, '?'),
      }),
    ]),
  },
]

const dataSource: Task[] = [
  { id: 1, title: '整理接口文档', score: 86 },
  { id: 2, title: '补充单元测试', score: 92 },
  { id: 3, title: '优化表格性能', score: 78 },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    row-key="id"
    :pagination="false"
  />
</template>

<style>
.header-render {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.header-render__tip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: 50%;
  color: var(--el-text-color-secondary);
  font-size: 11px;
  line-height: 1;
  cursor: help;
}
</style>
```

  </template>
</Demo>

### 分组表头

通过 `children` 配置多级表头

<Demo>
  <GroupedHeaderDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  email: string
  phone: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  {
    label: '联系方式',
    children: [
      { prop: 'email', label: '邮箱', minWidth: 220 },
      { prop: 'phone', label: '电话', minWidth: 160, sortable: true },
    ],
  },
]

const dataSource: Member[] = [
  { id: 1, name: '林晓', email: 'linxiao@example.com', phone: '13800000001' },
  { id: 2, name: '陈默', email: 'chenmo@example.com', phone: '13800000002' },
  { id: 3, name: '周宁', email: 'zhouning@example.com', phone: '13800000003' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    :default-sort="{
      prop: 'phone',
      order: 'descending'
    }"
    row-key="id"
    :pagination="false"
  />
</template>
```

  </template>
</Demo>

## 表格功能

### 列配置 autoMerge（建议开启全边框）

通过 `autoMerge` 自动合并单元格

<Demo>
  <ColumnMergeDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Project {
  id: number
  department: string
  group: string
  owner: string
}

const columns: TableProColumn<Project>[] = [
  { prop: 'department', label: '部门', minWidth: 140, autoMerge: true },
  { prop: 'group', label: '小组', minWidth: 150 },
  { prop: 'owner', label: '负责人', minWidth: 140 },
]

const dataSource: Project[] = [
  { id: 1, department: '产品中心', group: '体验设计', owner: '林晓' },
  { id: 2, department: '产品中心', group: '体验设计', owner: '陈默' },
  { id: 3, department: '产品中心', group: '产品策划', owner: '周宁' },
  { id: 4, department: '研发中心', group: '前端开发', owner: '赵启' },
  { id: 5, department: '研发中心', group: '前端开发', owner: '许言' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    border
    row-key="id"
    :pagination="false"
  />
</template>
```

  </template>
</Demo>

### mergeFields 多级合并（建议开启全边框）

通过 `mergeFields` 配置多级合并：

<Demo>
  <MergeDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Project {
  id: number
  department: string
  group: string
  owner: string
}

const columns: TableProColumn<Project>[] = [
  { prop: 'department', label: '部门', minWidth: 140 },
  { prop: 'group', label: '小组', minWidth: 150 },
  { prop: 'owner', label: '负责人', minWidth: 140 },
]

const dataSource: Project[] = [
  { id: 1, department: '产品中心', group: '体验设计', owner: '林晓' },
  { id: 2, department: '产品中心', group: '体验设计', owner: '陈默' },
  { id: 3, department: '产品中心', group: '产品策划', owner: '周宁' },
  { id: 4, department: '研发中心', group: '前端开发', owner: '赵启' },
  { id: 5, department: '研发中心', group: '前端开发', owner: '许言' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    border
    :merge-fields="['department', 'group']"
    row-key="id"
    :pagination="false"
  />
</template>
```

  </template>
</Demo>

### 未开启 border 的合并（Element Plus 默认无边框）
<Demo>
  <MergeDemoNoBorder />
  <template #code>

```vue
<script setup lang="ts">
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Project {
  id: number
  department: string
  group: string
  owner: string
}

const columns: TableProColumn<Project>[] = [
  { prop: 'department', label: '部门', minWidth: 140 },
  { prop: 'group', label: '小组', minWidth: 150 },
  { prop: 'owner', label: '负责人', minWidth: 140 },
]

const dataSource: Project[] = [
  { id: 1, department: '产品中心', group: '体验设计', owner: '林晓' },
  { id: 2, department: '产品中心', group: '体验设计', owner: '陈默' },
  { id: 3, department: '产品中心', group: '产品策划', owner: '周宁' },
  { id: 4, department: '研发中心', group: '前端开发', owner: '赵启' },
  { id: 5, department: '研发中心', group: '前端开发', owner: '许言' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    :merge-fields="['department', 'group']"
    row-key="id"
    :pagination="false"
  />
</template>
```

  </template>
</Demo>



## API

ElTablePro 在 Element Plus 的 Table 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 Element Plus Table 不同和部分原始的 API。

### Props

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | Table 的数据，ElTablePro 推荐使用 request 来加载 | `Row[]` | [] |
| request | 远程表数据请求函数 | `TableProRequest<Row, Query>`/ `undefined` |
| query | 已应用的检索条件对象 | `Query` | &#123;&#125; |
| filter | 筛选表单配置 | `TableProFilterConfig<Query>` | `undefined` |
| columns | 列配置 | `TableProColumn<Row>[]` | [] |
| rowKey | 行唯一标识 | `string` / `(row) => string` / `number` | - |
| pagination | 分页配置，`false` 时隐藏分页 | `boolean` \\| `TableProPagination` | true |
| mergeFields | 按顺序逐级合并连续同值的字段 | `string[]` | [] |

更多属性请参考 [**Element Plus Table**](https://element-plus.org/zh-CN/component/table#table-%E5%B1%9E%E6%80%A7)。

### TableProFilterConfig

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| schema | 筛选表单的字段配置 | `FormProSchemaItem[]` | - |
| model | 筛选表单的当前值 | `Query` | &#123;&#125; |
| defaultValue | 筛选表单的初始值 | `Query` | &#123;&#125; |
| formConfig | 筛选表单的布局和折叠配置 | `TableProFilterConfigExtension` | - |

TableProFilterConfigExtension 在 FormProConfig 基础上增加以下筛选配置：

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| showCollapseButton | 是否显示展开/收起按钮 | `boolean` | false |
| collapseRows | 收起时显示的行数 | `number` | 1 |
| collapseCount | 收起时显示的字段数量；优先级高于 collapseRows | `number` | - |
| collapsed | 是否默认收起 | `boolean` | true |

### TableProColumn

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 字段名| `string` | - |
| label | 列标题 | `string` | - |
| visible | 是否显示列 | `boolean` | true |
| slot | 自定义单元格插槽名 | `string` | - |
| headerSlot | 自定义表头插槽名 | `string` | - |
| render | 使用渲染函数生成单元格内容 | `(scope) => VNodeChild` | - |
| headerRender | 使用渲染函数生成表头内容 | `(scope) => VNodeChild` | - |
| autoMerge | 当前列是否合并连续同值 | `boolean` | false |
| children | 分组表头的子列 | `TableProColumn<Row>[]` | - |

更多属性请参考 [**Element Plus Table-column API**](https://element-plus.org/zh-CN/component/table#table-column-api)。

### TableProRequest

组件会在初始化、分页变化或调用 `reload` 时执行它，并使用返回值更新表格与分页总数。

```ts
type TableProRequest<Row, Query = Record<string, any>> = (params: {
  page: number | null
  pageSize: number | null
  query: Query
  signal: AbortSignal
}) => Promise<{
  data: Row[]
  total: number
}>
```

#### 请求参数

| 参数名 | 说明 | 类型 |
| --- | --- | --- |
| page | 当前页码 | `number` / `null` |
| pageSize | 每页条数 | `number` / `null` |
| signal | 用于取消请求的信号 | `AbortSignal` |

`signal` 由组件自动提供。请求函数不需要取消能力时，可以不解构这个参数。

#### 返回值

| 字段名 | 说明 | 类型 |
| --- | --- | --- |
| data | 表数据 | `Row[]` |
| total | 数据总条数 | `number` |

### TableProPagination

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| page | 当前页码 | `number` | 1 |
| pageSize | 每页条数 | `number` | 20 |
| pageSizes | 每页条数选项 | `number[]` | [10, 20, 50, 100] |
| pagerCount | 页码按钮数量 | `number` | 5 |
| layout | 分页布局 | `string` | total, sizes, prev, pager, next, jumper |
| background | 是否为页码添加背景色 | `boolean` | true |

更多分页配置请参考 [**Element Plus Pagination**](https://element-plus.org/zh-CN/component/pagination.html)。

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| loaded | 请求成功时触发的事件 | <ApiType type="Function" signature="(result: &#123; data: unknown[], total: number &#125;) =&gt; void" /> |
| error | 请求失败时触发的事件 | <ApiType type="Function" signature="(error: unknown) =&gt; void" /> |

更多事件请参考 [**Element Plus Table 事件**](https://element-plus.org/zh-CN/component/table#table-%E4%BA%8B%E4%BB%B6)。

### Table Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| reload | 重新执行请求；不传参数时刷新当前页 | <ApiType type="Function" signature="(options?: &#123; page?: number &#125; &#124; undefined) =&gt; Promise&lt;void&gt;" /> |
| search | 应用当前筛选条件并回到第一页 | <ApiType type="Function" signature="() =&gt; Promise&lt;void&gt;" /> |
| resetFilter | 重置筛选条件并重新请求 | <ApiType type="Function" signature="() =&gt; Promise&lt;void&gt;" /> |

更多方法请参考 [**Element Plus Table Exposes**](https://element-plus.org/zh-CN/component/table#table-exposes)。
