---
title: ElTablePro 事件
description: ElTablePro 的 loaded、error 事件以及 ElTable 原生事件透传。
---
# Events

ElTable 的原生事件都会透传到内部表格：

```vue
<ElTablePro
  :columns="columns"
  :data="dataSource"
  row-key="id"
  @row-click="handleRowClick"
  @selection-change="handleSelectionChange"
  @sort-change="handleSortChange"
  @filter-change="handleFilterChange"
/>
```

ElTablePro 另外提供两个与远程请求有关的事件：

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| loaded | { data, total } | request 成功，并且结果没有被后续请求替代 |
| error | unknown | request 抛出错误，并且不是已取消的请求 |

```vue
<ElTablePro
  :columns="columns"
  :request="requestUsers"
  row-key="id"
  @loaded="handleLoaded"
  @error="handleError"
/>
```

被 abort 取消的请求不会触发 error。这样切换页码或重复查询时，不会出现无意义的错误提示。
