# 快速开始

这一页从一个本地数组开始，先确认表格能正常显示；下一步再接入远程请求。

## 准备列配置

columns 决定表格显示哪些列，以及每一列如何渲染：

```ts
import type { TableProColumn } from 'element-plus-suite'

interface User {
  id: number
  name: string
  email: string
}

const columns: TableProColumn<User>[] = [
  { prop: 'name', label: '姓名', minWidth: 140 },
  { prop: 'email', label: '邮箱', minWidth: 220 },
]
```

## 渲染本地数据

```vue
<script setup lang="ts">
import { ElTablePro } from 'element-plus-suite'

const dataSource = [
  { id: 1, name: '林晓', email: 'linxiao@example.com' },
  { id: 2, name: '陈默', email: 'chenmo@example.com' },
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
```

## 接入远程请求

把 data 换成 request：

```ts
const requestUsers: TableProRequest<User> = async ({ page, pageSize, signal }) => {
  const params = new URLSearchParams({
    page: String(page ?? 1),
    pageSize: String(pageSize ?? 20),
  })
  const response = await fetch(`/api/users?${params}`, { signal })
  const payload = await response.json()

  return {
    data: payload.list,
    total: payload.total,
  }
}
```

`request` 的返回值格式固定，接口原始结构在函数内部适配即可。

## 主动刷新

需要搜索或新增数据后刷新时，通过实例方法调用：

```ts
const tableRef = ref<TableProInstance>()

function search() {
  tableRef.value?.reload({ page: 1 })
}
```
