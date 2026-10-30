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

function search() {
  void tableRef.value?.reload({ page: 1 })
}
</script>

<template>
  <div class="toolbar">
    <ElInput
      v-model="keyword"
      placeholder="搜索成员或角色"
      clearable
      @keyup.enter="search"
    />
    <ElButton type="primary" @click="search">查询</ElButton>
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

页码和每页条数会随分页变化自动传入。组件同时用 requestId 丢弃过期响应；如果请求库支持 signal，也可以把它继续传给 fetch 或 axios。

## 分页

省略 pagination 时会启用默认分页，默认每页 20 条，并提供页码、每页条数和跳页控件。

```vue
<!-- 使用默认分页 -->
<ElTablePro :columns="columns" :request="requestUsers" row-key="id" />

<!-- 修改每页条数 -->
<ElTablePro
  :columns="columns"
  :request="requestUsers"
  row-key="id"
  :pagination="{ pageSize: 10 }"
/>

<!-- 关闭分页 -->
<ElTablePro
  :columns="columns"
  :data="rows"
  row-key="id"
  :pagination="false"
/>
```

本地数据启用分页时，组件会对 data 做前端切片；远程数据则由 request 返回当前页的数据和总数。

## 自定义单元格

需要标签、按钮或业务组件时，在 columns 中写 slot，再在模板里提供同名插槽。

<Demo>
  <SlotDemo />
  <template #code>

```vue
const columns: TableProColumn<Order>[] = [
  { prop: 'number', label: '订单号' },
  { prop: 'status', label: '状态', slot: 'status' },
  { label: '操作', width: 140, fixed: 'right', slot: 'actions' },
]
```

```vue
<ElTablePro :columns="columns" :data="rows" row-key="id">
  <template #status="{ row }">
    <ElTag>{{ row.status }}</ElTag>
  </template>
  <template #actions="{ row }">
    <ElButton link type="primary" @click="edit(row)">编辑</ElButton>
  </template>
</ElTablePro>
```

  </template>
</Demo>

## 排序与筛选

排序和筛选不进入 request 参数。这样可以避免组件假设后端字段名，也能让页面按自己的方式组合查询条件。

<Demo>
  <EventsDemo />
  <template #code>

```vue
<ElTablePro
  :columns="columns"
  :data="rows"
  row-key="id"
  @sort-change="handleSortChange"
  @filter-change="handleFilterChange"
/>
```

```ts
function handleSortChange({ prop, order }) {
  sorter.value = prop ? { prop, order } : null
  tableRef.value?.reload({ page: 1 })
}
```

  </template>
</Demo>

ElTable 的原生事件会直接透传。常见做法是先更新页面里的查询状态，再调用 reload；是否重新请求、是否回到第一页，都由页面决定。

## 保留原生能力

除了 columns、request 和 pagination，其余属性与事件都会交给内部 ElTable：

```vue
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
```

实例方法也直接代理到 ElTable。比如滚动、清除排序、清空选择都可以照常调用：

```ts
tableRef.value?.scrollTo({ top: 0 })
tableRef.value?.clearSort()
tableRef.value?.clearSelection()
```

想继续查看完整属性、事件和实例方法，可以阅读 [Props](/components/table-pro/props)、[Events](/components/table-pro/events) 和[实例方法](/components/table-pro/instance)。

## API

除了本页介绍和示例，ElTablePro 的完整参考按类型拆分为：

- [Props](/components/table-pro/props)：组件自有属性和 ElTable 原生属性
- [事件](/components/table-pro/events)：loaded、error 与原生事件透传
- [实例方法](/components/table-pro/instance)：reload 与 ElTable 实例 API
