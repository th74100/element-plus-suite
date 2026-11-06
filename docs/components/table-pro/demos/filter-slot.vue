<template>
  <ElTablePro
    ref="tableRef"
    :columns="columns"
    :request="requestOrders"
    :filter="filter"
    row-key="id"
    :pagination="false"
  >
    <template #filter-customer="{ model }">
      <ElSelect
        v-model="model.customer"
        placeholder="请选择客户"
        clearable
        style="width: 100%"
      >
        <ElOption label="全部客户" value="" />
        <ElOption label="林晓" value="林晓" />
        <ElOption label="陈默" value="陈默" />
        <ElOption label="周宁" value="周宁" />
        <ElOption label="许知远" value="许知远" />
        <ElOption label="李夏" value="李夏" />
      </ElSelect>
    </template>

    <template #filter-status="{ model }">
      <ElSelect
        v-model="model.status"
        placeholder="请选择状态"
        clearable
        style="width: 100%"
      >
        <ElOption label="全部状态" value="" />
        <ElOption label="正常" value="正常" />
        <ElOption label="待确认" value="待确认" />
        <ElOption label="已取消" value="已取消" />
      </ElSelect>
    </template>

    <template #filter-buttons>
      <ElButton @click="tableRef?.resetFilter()">重置</ElButton>
      <ElButton type="primary" @click="tableRef?.search()">查询</ElButton>
    </template>

    <template #status="{ row }">
      <ElTag :type="statusType(row.status)" effect="light">
        {{ row.status }}
      </ElTag>
    </template>
  </ElTablePro>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElButton,
  ElOption,
  ElSelect,
  ElTag,
} from 'element-plus'
import {
  ElTablePro,
  type TableProColumn,
  type TableProFilterConfig,
  type TableProInstance,
  type TableProRequest,
} from 'element-plus-suite'

interface Order {
  id: number
  number: string
  customer: string
  amount: number
  status: '正常' | '待确认' | '已取消'
}

interface OrderFilter {
  number: string
  customer: string
  status: string
}

const tableRef = ref<TableProInstance>()

const columns: TableProColumn<Order>[] = [
  { prop: 'number', label: '订单号', minWidth: 150 },
  { prop: 'customer', label: '客户', minWidth: 140 },
  {
    prop: 'amount',
    label: '金额',
    width: 120,
    align: 'right',
    formatter: (_row, _column, value) => `¥${Number(value).toLocaleString()}`,
  },
  { prop: 'status', label: '状态', width: 110, slot: 'status' },
]

const dataSource: Order[] = [
  { id: 1, number: 'SO-2026-001', customer: '林晓', amount: 1280, status: '正常' },
  { id: 2, number: 'SO-2026-002', customer: '陈默', amount: 760, status: '待确认' },
  { id: 3, number: 'SO-2026-003', customer: '周宁', amount: 2300, status: '正常' },
  { id: 4, number: 'SO-2026-004', customer: '许知远', amount: 420, status: '已取消' },
  { id: 5, number: 'SO-2026-005', customer: '李夏', amount: 1680, status: '待确认' },
]

const filter: TableProFilterConfig<OrderFilter> = {
  schema: [
    {
      key: 'number',
      label: '订单号',
      type: 'input',
      defaultValue: '',
      fieldProps: { placeholder: '请输入订单号' },
    },
    {
      key: 'customer',
      label: '客户',
      type: 'select',
      defaultValue: '',
    },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      defaultValue: '',
    },
  ],
  formConfig: {
    // 一行 1 / 2 / 3 / 4 列随屏幕变化，与 el-col 的断点保持一致
    col: { span: 24, sm: 12, md: 8, xl: 6 },
    collapseRows: 1,
    showCollapseButton: true,
  },
}

const requestOrders: TableProRequest<Order, OrderFilter> = async ({ query }) => {
  const data = dataSource.filter((item) => {
    const numberMatched = !query.number || item.number.includes(query.number)
    const customerMatched = !query.customer || item.customer === query.customer
    const statusMatched = !query.status || item.status === query.status

    return numberMatched && customerMatched && statusMatched
  })

  return {
    data,
    total: data.length,
  }
}

function statusType(status: Order['status']): 'success' | 'warning' | 'info' {
  return status === '正常' ? 'success' : status === '待确认' ? 'warning' : 'info'
}
</script>
