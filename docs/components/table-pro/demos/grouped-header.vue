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
  <ElTablePro :columns="columns" :data="dataSource" row-key="id" :default-sort="{prop: 'phone', order: 'descending'}" :pagination="false" />
</template>