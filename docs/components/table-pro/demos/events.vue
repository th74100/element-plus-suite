<template>
  <ElTablePro
    :columns="columns"
    :data="rows"
    row-key="id"
    :pagination="false"
    border
    @sort-change="onSortChange"
    @row-click="onRowClick"
  />
  <p class="demo-note">{{ message }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Task { id: number, title: string, score: number }
const message = ref('点击表头排序，或点击任意一行。')
const columns: TableProColumn<Task>[] = [
  { prop: 'title', label: '任务', minWidth: 180 },
  { prop: 'score', label: '评分', width: 100, sortable: 'custom' },
]
const rows: Task[] = [
  { id: 1, title: '整理接口文档', score: 86 },
  { id: 2, title: '补充单元测试', score: 92 },
]
function onSortChange({ prop, order }: { prop: string | null, order: string | null }) {
  message.value = prop ? `排序字段：${prop}，方向：${order}` : '已取消排序'
}
function onRowClick(row: Task) {
  message.value = `点击了「${row.title}」`
}
</script>
