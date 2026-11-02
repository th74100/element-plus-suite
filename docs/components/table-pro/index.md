---
title: Table 表格 | Element Plus Suite
description: 基于 Element Plus 的表格组件，支持列定义、分页和远程请求。
---
<script setup lang="ts">
import BasicDemo from './demos/basic.vue'
import RemoteDemo from './demos/remote.vue'
import SlotDemo from './demos/slots.vue'
import HeaderDemo from './demos/header.vue'
import GroupedHeaderDemo from './demos/grouped-header.vue'
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


## 远程数据
`request` 是 ElTablePro 最重要的 API, `request` 会接收一个对象，对象中必须要有 `data` 和 `total` 属性，其中 `total` 不会使用 data 的长度。
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
const rows: Order[] = [
  { id: 1, number: 'SO-2026-001', amount: 1280, status: '正常' },
  { id: 2, number: 'SO-2026-002', amount: 760, status: '待确认' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
    :pagination="false"
    border
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

### 自定义表头

通过 `headerSlot` 替换表头内容：

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

const rows: Task[] = [
  { id: 1, title: '整理接口文档', score: 86 },
  { id: 2, title: '补充单元测试', score: 92 },
  { id: 3, title: '优化表格性能', score: 78 },
]
</script>

<template>
  <ElTablePro :columns="columns" :data="rows" row-key="id" :pagination="false" border>
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

### 分组表头

通过 `children` 配置多级表头：

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
      { prop: 'phone', label: '电话', minWidth: 160 },
    ],
  },
]

const rows: Member[] = [
  { id: 1, name: '林晓', email: 'linxiao@example.com', phone: '13800000001' },
  { id: 2, name: '陈默', email: 'chenmo@example.com', phone: '13800000002' },
  { id: 3, name: '周宁', email: 'zhouning@example.com', phone: '13800000003' },
]
</script>

<template>
  <ElTablePro :columns="columns" :data="rows" row-key="id" :pagination="false" border />
</template>
```

  </template>
</Demo>

### 隐藏列

设置 `visible: false` 可以保留列配置，但不在表格中渲染：

```vue
<script setup lang="ts">
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Member {
  id: number
  name: string
  email: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '成员', minWidth: 140 },
  { prop: 'email', label: '邮箱', minWidth: 220, visible: false },
]
const rows: Member[] = [
  { id: 1, name: '林晓', email: 'linxiao@example.com' },
]
</script>

<template>
  <ElTablePro :columns="columns" :data="rows" row-key="id" />
</template>
```
