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

