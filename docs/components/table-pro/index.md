# ElTablePro

增强表格组件。

## 基础用法

```vue
<script setup lang="ts">
import { ElTablePro } from 'element-plus-suite'

const columns = [
  { prop: 'name', label: '姓名' },
]

const data = [
  { id: 1, name: '张三' },
]
</script>

<template>
  <ElTablePro
    :columns="columns"
    :data="data"
    row-key="id"
    :pagination="false"
  />
</template>
```

## 远程数据

```ts
const request = async ({ page, pageSize, signal }) => {
  const response = await fetch(
    `/api/users?page=${page}&pageSize=${pageSize}`,
    { signal },
  )
  const payload = await response.json()

  return {
    data: payload.data.list,
    total: payload.data.count,
  }
}
```

`request` 必须返回：

```ts
{
  data: [],
  total: 0,
}
```

排序和筛选不进入 `request` 参数，由页面自己维护并通过闭包读取。
