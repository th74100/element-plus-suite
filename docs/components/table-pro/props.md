# Props

`ElTablePro` 继承全部 `ElTable` props。

自有 props：

| 属性 | 类型 | 说明 |
|---|---|---|
| `columns` | `TableProColumn[]` | 列配置 |
| `data` | `Row[]` | 本地数据 |
| `request` | `TableProRequest` | 远程请求 |
| `pagination` | `false \| TableProPagination` | 分页配置，省略时开启 |
| `loading` | `boolean` | 外部 loading |
| `rowKey` | `string \| function` | 行唯一标识 |
