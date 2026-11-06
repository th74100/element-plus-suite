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

interface UserResponse {
  users: User[]
  total: number
  skip: number
  limit: number
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

  const payload = await response.json() as UserResponse

  return {
    data: payload.users,
    total: payload.total,
  }
}
</script>