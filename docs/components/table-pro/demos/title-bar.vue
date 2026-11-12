<script setup lang="ts">
import type {
  TableProColumn,
  TableProRequest,
} from 'element-plus-suite'

interface Member {
  id: number
  name: string
  role: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'name', label: '姓名', minWidth: 140 },
  { prop: 'role', label: '角色', minWidth: 140 },
]

const dataSource: Member[] = [
  { id: 1, name: '林晓', role: '产品设计' },
  { id: 2, name: '陈默', role: '前端开发' },
  { id: 3, name: '周宁', role: '数据分析' },
]

const requestMembers: TableProRequest<Member> = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: dataSource,
        total: dataSource.length,
      })
    }, 1500)
  })
}
</script>

<template>
  <ElTablePro
    headerTitle="成员列表"
    :columns="columns"
    :request="requestMembers"
    :options="{
      reload: true,
      density: true,
      fullscreen: true,
    }"
    row-key="id"
    :pagination="false"
    border
  />
</template>
