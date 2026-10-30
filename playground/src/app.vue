<script setup lang="ts">
import { reactive, shallowRef, useTemplateRef } from 'vue'
import {
  ElTablePro,
  type TableProColumn,
  type TableProInstance,
  type TableProRequest,
} from 'element-plus-suite'

interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'disabled'
}

const filters = reactive({
  keyword: '',
})

const sorter = shallowRef<{
  prop: string
  order: 'ascending' | 'descending'
} | null>(null)

const columnFilters = shallowRef<Record<string, string[]>>({})
const tableRef = useTemplateRef<TableProInstance>('tableRef')

const columns: TableProColumn<User>[] = [
  { type: 'selection', width: 48 },
  { prop: 'name', label: '姓名', sortable: 'custom', minWidth: 140 },
  { prop: 'email', label: '邮箱', minWidth: 200 },
  {
    prop: 'status',
    label: '状态',
    columnKey: 'status',
    filters: [
      { text: '启用', value: 'active' },
      { text: '禁用', value: 'disabled' },
    ],
    slot: 'status',
  },
  {
    label: '操作',
    width: 160,
    fixed: 'right',
    slot: 'actions',
  },
]

/**
 * request 只负责请求和把接口响应适配成统一结构。
 * 排序、筛选条件由页面自己持有，通过闭包读取。
 */
const requestUsers: TableProRequest<User> = async ({
  page,
  pageSize,
  signal,
}) => {
  const params = new URLSearchParams()

  if (page !== null) params.set('page', String(page))
  if (pageSize !== null) params.set('pageSize', String(pageSize))
  if (filters.keyword.trim()) {
    params.set('keyword', filters.keyword.trim())
  }
  if (sorter.value) {
    params.set('sortField', sorter.value.prop)
    params.set('sortOrder', sorter.value.order)
  }

  const status = columnFilters.value.status
  if (status?.length) params.set('status', status.join(','))

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users?${params}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error('加载用户失败')
  }

  const data = await response.json()

  return {
    data,
    total: data.length,
  }
}

function handleSearch() {
  void tableRef.value?.reload({ page: 1 })
}

function handleSortChange(payload: {
  prop: string | null
  order: 'ascending' | 'descending' | null
}) {
  sorter.value =
    payload.prop && payload.order
      ? { prop: payload.prop, order: payload.order }
      : null
  handleSearch()
}

function handleFilterChange(next: Record<string, string[]>) {
  columnFilters.value = next
  handleSearch()
}
</script>

<template>
  <main class="app">
    <h1>element-plus-suite</h1>
    <p>TablePro 基础示例</p>

    <ElTablePro
      ref="tableRef"
      :columns="columns"
      :request="requestUsers"
      row-key="id"
      border
      :pagination="{ pageSize: 10 }"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <template #toolbar>
        <el-input
          v-model="filters.keyword"
          placeholder="搜索姓名"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </template>

      <template #status="{ row }">
        <el-tag>{{ row.status ?? 'active' }}</el-tag>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary">编辑 {{ row.name }}</el-button>
      </template>
    </ElTablePro>
  </main>
</template>

<style scoped>
.app {
  padding: 24px;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
</style>

