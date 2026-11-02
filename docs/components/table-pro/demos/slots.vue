<template>
  <ElTablePro
    :columns="columns"
    :data="dataSource"
    row-key="id"
    :pagination="false"
  >
    <template #status="{ row }">
      <ElTag :type="row.status === '正常' ? 'success' : 'warning'" effect="light">
        {{ row.status }}
      </ElTag>
    </template>
    <template #actions="{ row }">
      <ElButton link type="primary">查看 {{ row.name }}</ElButton>
    </template>
  </ElTablePro>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElTablePro, type TableProColumn } from 'element-plus-suite'

interface Order {
  id: number
  number: string
  amount: number
  status: '正常' | '待确认'
}

const columns: TableProColumn<Order>[] = [
  { prop: 'number', label: '订单号', minWidth: 150 },
  { prop: 'amount', label: '金额', width: 120, align: 'right' },
  { prop: 'status', label: '状态', width: 110, slot: 'status' },
  { label: '操作', width: 140, fixed: 'right', slot: 'actions' },
]

const dataSource: Order[] = [
  { id: 1, number: 'SO-2026-001', amount: 1280, status: '正常' },
  { id: 2, number: 'SO-2026-002', amount: 760, status: '待确认' },
]
</script>
