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

