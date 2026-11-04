<script setup lang="ts">
import { h } from 'vue'
import { ElTooltip } from 'element-plus'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Task {
  id: number
  title: string
  score: number
}

const columns: TableProColumn<Task>[] = [
  { prop: 'title', label: '任务', minWidth: 180 },
  {
    prop: 'score',
    width: 140,
    headerRender: () => h('span', { class: 'header-render' }, [
      '评分',
      h(ElTooltip, { content: '按百分制评分' }, {
        default: () => h('span', { class: 'header-render__tip' }, '?'),
      }),
    ]),
  },
]

const dataSource: Task[] = [
  { id: 1, title: '整理接口文档', score: 86 },
  { id: 2, title: '补充单元测试', score: 92 },
  { id: 3, title: '优化表格性能', score: 78 },
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
.header-render {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.header-render__tip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: 50%;
  color: var(--el-text-color-secondary);
  font-size: 11px;
  line-height: 1;
  cursor: help;
}
</style>

