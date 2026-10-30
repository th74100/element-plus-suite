---
title: ElTablePro 实例方法
description: ElTablePro 的 reload 方法以及内部 ElTable 的实例方法。
---
# 实例方法

ElTablePro 的实例类型同时包含自己的 reload 和内部 ElTable 的全部方法。

```ts
import { useTemplateRef } from 'vue'
import type { TableProInstance } from 'element-plus-suite'

const tableRef = useTemplateRef<TableProInstance>('tableRef')
```

## reload

```ts
await tableRef.value?.reload()
await tableRef.value?.reload({ page: 1 })
```

不传参数时，使用当前分页状态重新请求。传入 page 时，先把页码切换到指定值，再重新请求。搜索后回到第一页是常见用法：

```ts
function search() {
  void tableRef.value?.reload({ page: 1 })
}
```

## ElTable 方法

其余方法直接来自 ElTable，调用方式不变：

```ts
tableRef.value?.scrollTo({ top: 0 })
tableRef.value?.setScrollTop(0)
tableRef.value?.clearSort()
tableRef.value?.clearSelection()
tableRef.value?.toggleAllSelection()
tableRef.value?.doLayout()
```

如果 TypeScript 能识别 ElTable 对应的方法，ElTablePro 实例上也会有同样的类型提示。
