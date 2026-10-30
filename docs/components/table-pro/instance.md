# 实例方法

`TableProInstance` 复用 Element Plus 的 `TableInstance` 类型。

```ts
const tableRef = ref<TableProInstance>()

tableRef.value?.reload()
tableRef.value?.reload({ page: 1 })

tableRef.value?.clearSort()
tableRef.value?.clearSelection()
tableRef.value?.scrollTo({ top: 0 })
```

`reload` 由 `ElTablePro` 提供，其他实例方法直接来自内部 `ElTable`。
