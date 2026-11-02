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