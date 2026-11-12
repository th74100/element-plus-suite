<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import {
    ElFormPro,
    type TableProColumn,
    type TableProRequest
} from 'element-plus-suite'

interface Task {
  id: number
  title: string
  date: string
}

const columns: TableProColumn<Member>[] = [
  { prop: 'title', label: '任务', minWidth: 140 },
  { prop: 'date', label: '部署时间', minWidth: 140 },
]

const dataSource: Task[] = [
  { id: 1, title: '部署测试环境', date: '2026-11-12' },
  { id: 2, title: '发布正式版本', date: '2026-11-14' },
]

const requestTasks: TableProRequest<Task> = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: dataSource,
        total: dataSource.length,
      })
    }, 1000)
  })
}
</script>

<template>
  <ElTablePro
    headerTitle="任务"
    :columns="columns"
    :request="requestTasks"
    :options="{
      reload: true,
      density: true,
      fullscreen: true,
    }"
    row-key="id"
    :pagination="false"
    border
  >
    <template #toolbar>
      <ElButtonPro type="primary" :icon="Plus">新增</ElButtonPro>
    </template>
  </ElTablePro>
</template>
