<template>
  <div class="demo-toolbar">
    <ElInput
      v-model="keyword"
      placeholder="搜索姓名或邮箱"
      clearable
      @keyup.enter="search"
    />
    <ElButton type="primary" @click="search">
      查询
    </ElButton>
  </div>

  <ElTablePro
    ref="tableRef"
    :columns="columns"
    :request="requestUsers"
    row-key="id"
    :pagination="{ pageSize: 10, layout: 'total, prev, pager, next' }"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import {
  ElTablePro,
  type TableProColumn,
  type TableProInstance,
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

interface UserResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

const USER_API = 'https://dummyjson.com/users'

const keyword = ref('')
const tableRef = shallowRef<TableProInstance>()

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
  const query = keyword.value.trim()
  const limit = pageSize ?? 5
  const skip = ((page ?? 1) - 1) * limit
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: 'id,firstName,lastName,email,age,company',
  })

  const url = new URL(query ? `${USER_API}/search` : USER_API)
  if (query) url.searchParams.set('q', query)

  for (const [key, value] of params) url.searchParams.set(key, value)

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  const payload = await response.json() as UserResponse

  return {
    data: payload.users,
    total: payload.total,
  }
}

function search() {
  void tableRef.value?.reload({ page: 1 })
}
</script>
