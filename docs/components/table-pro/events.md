# Events

`ElTable` 原生事件通过 `$attrs` 原样透传。

示例：

```vue
<ElTablePro
  @sort-change="handleSortChange"
  @filter-change="handleFilterChange"
  @cell-click="handleCellClick"
/>
```

`ElTablePro` 自己新增：

| 事件 | 参数 | 说明 |
|---|---|---|
| `loaded` | `{ data, total }` | 远程请求成功 |
| `error` | `unknown` | 远程请求失败 |
