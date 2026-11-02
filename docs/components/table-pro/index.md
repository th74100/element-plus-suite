---
title: Table 表格 | Element Plus Suite
description: 基于 Element Plus 的表格组件，支持列定义、分页和远程请求。
---
<script setup lang="ts">
import BasicDemo from './demos/basic.vue'
import RemoteDemo from './demos/remote.vue'
import SlotDemo from './demos/slots.vue'
import EventsDemo from './demos/events.vue'
</script>

# Table 表格

高级表格组件，支持多级表头，自定义列、分页和远程请求。

## 基础用法
通过配置快速生成表格。

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

const rows: Member[] = [
  { id: 1, name: '林晓', role: '产品设计', status: '在线' },
  { id: 2, name: '陈默', role: '前端开发', status: '离开' },
  { id: 3, name: '周宁', role: '数据分析', status: '在线' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
    :pagination="false"
    border
  />
</template>
```

  </template>
</Demo>

## 远程数据

远程模式由 `request` 开启。请求参数中只有页码、每页条数和取消信号，业务查询条件通过页面闭包自行组合。

<Demo>
  <RemoteDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import {
  ElTablePro,
  type TableProColumn,
  type TableProInstance,
  type TableProRequest,
} from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
}

const keyword = ref('')
const tableRef = shallowRef<TableProInstance>()

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 180 },
]

const requestMembers: TableProRequest<Member> = async ({
  page,
  pageSize,
  signal,
}) => {
  const params = new URLSearchParams({
    page: String(page ?? 1),
    pageSize: String(pageSize ?? 20),
    keyword: keyword.value.trim(),
  })

  const response = await fetch(`/api/members?${params}`, { signal })

  if (!response.ok) {
    throw new Error('加载成员失败')
  }

  const payload = await response.json()

  return {
    data: payload.data.list as Member[],
    total: payload.data.count as number,
  }
}

</script>

<template>
  <div class="toolbar">
    <ElInput
      v-model="keyword"
      placeholder="搜索成员或角色"
      clearable
      @keyup.enter="tableRef?.reload({ page: 1 })"
    />
    <ElButton type="primary" @click="tableRef?.reload({ page: 1 })">查询</ElButton>
  </div>

  <ElTablePro
    ref="tableRef"
    :columns="columns"
    :request="requestMembers"
    row-key="id"
    border
    :pagination="{ pageSize: 10 }"
  />
</template>
```

  </template>
</Demo>

## 分页

`pagination` 默认是 `true`，会启用默认分页。传入对象可以覆盖默认配置，传入 `false` 可以关闭分页。

### 使用默认分页

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 180 },
]

const rows: Member[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  name: `成员 ${index + 1}`,
  role: index % 2 === 0 ? '产品设计' : '前端开发',
}))
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
  />
</template>
```

### 修改每页条数

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 180 },
]

const rows: Member[] = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  name: `成员 ${index + 1}`,
  role: index % 2 === 0 ? '产品设计' : '前端开发',
}))
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
    :pagination="{ pageSize: 10 }"
  />
</template>
```

### 关闭分页

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 180 },
]

const rows: Member[] = [
  { id: 1, name: '林晓', role: '产品设计' },
  { id: 2, name: '陈默', role: '前端开发' },
  { id: 3, name: '周宁', role: '数据分析' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
    :pagination="false"
  />
</template>
```

本地数据启用分页时，组件会对 `data` 做前端切片；远程数据则由 `request` 返回当前页的数据和总数。

## 自定义单元格

需要标签、按钮或业务组件时，在 `columns` 中写 `slot`，再在模板里提供同名插槽。

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

const selected = ref('')

const rows: Order[] = [
  { id: 1, number: 'SO-2026-001', amount: 1280, status: '正常' },
  { id: 2, number: 'SO-2026-002', amount: 760, status: '待确认' },
]

function view(row: Order) {
  selected.value = row.number
}
</script>

<template>
  <ElTablePro :columns="columns" :data="rows" row-key="id">
    <template #status="{ row }">
      <ElTag>{{ row.status }}</ElTag>
    </template>

    <template #actions="{ row }">
      <ElButton link type="primary" @click="view(row)">
        查看
      </ElButton>
    </template>
  </ElTablePro>

  <p v-if="selected">已选择：{{ selected }}</p>
</template>
```

  </template>
</Demo>

## 排序与筛选

排序和筛选不进入 `request` 参数。业务页面通过事件更新自己的查询条件，再决定何时重新加载数据。

<Demo>
  <EventsDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Task {
  id: number
  title: string
  status: '进行中' | '已完成'
  score: number
}

const message = ref('点击表头排序，或筛选任务状态。')

const columns: TableProColumn<Task>[] = [
  { prop: 'title', label: '任务', minWidth: 180 },
  {
    prop: 'status',
    label: '状态',
    width: 120,
    filters: [
      { text: '进行中', value: '进行中' },
      { text: '已完成', value: '已完成' },
    ],
    filterMethod: (value, row) => row.status === value,
  },
  { prop: 'score', label: '评分', width: 100, sortable: 'custom' },
]

const rows: Task[] = [
  { id: 1, title: '整理接口文档', status: '进行中', score: 86 },
  { id: 2, title: '补充单元测试', status: '已完成', score: 92 },
  { id: 3, title: '优化表格性能', status: '进行中', score: 78 },
]

function handleSortChange(payload: {
  prop: string | null
  order: string | null
}) {
  message.value = payload.prop
    ? `排序字段：${payload.prop}，方向：${payload.order}`
    : '已取消排序'
}

function handleFilterChange(filters: Record<string, string[]>) {
  const status = filters.status?.[0]
  message.value = status ? `筛选状态：${status}` : '已清除筛选'
}
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
    :pagination="false"
    border
    @sort-change="handleSortChange"
    @filter-change="handleFilterChange"
  />

  <p>{{ message }}</p>
</template>
```

  </template>
</Demo>

## 保留原生能力

除了 `columns`、`request` 和 `pagination`，其余属性与事件都会交给内部 `ElTable`：

```vue
<script setup lang="ts">
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 180 },
]

const rows: Member[] = [
  { id: 1, name: '林晓', role: '产品设计' },
  { id: 2, name: '陈默', role: '前端开发' },
]

function handleRowClick(row: Member) {
  console.log('点击行', row.name)
}

function handleSelectionChange(rows: Member[]) {
  console.log('选中行', rows)
}
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
    border
    stripe
    height="420"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
  />
</template>
```

实例方法也直接代理到 `ElTable`。比如滚动、清除排序、清空选择都可以照常调用：

```ts
tableRef.value?.scrollTo({ top: 0 })
tableRef.value?.clearSort()
tableRef.value?.clearSelection()
```

想继续查看完整属性、事件和实例方法，可以阅读 [Props](/components/table-pro/props)、[Events](/components/table-pro/events) 和[实例方法](/components/table-pro/instance)。

## API

除了本页介绍和示例，完整参考按类型拆分为：

- [Props](/components/table-pro/props)：组件自有属性和 ElTable 原生属性
- [事件](/components/table-pro/events)：loaded、error 与原生事件透传
- [实例方法](/components/table-pro/instance)：reload 与 ElTable 实例 API
