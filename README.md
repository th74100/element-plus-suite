# element-plus-suite

基于 Element Plus 的扩展组件库。

> 本项目是非官方社区项目，不是 Element Plus 官方产品或官方成员。

## 组件

- `ElTablePro`：保留 `ElTable` 全部 props、事件和实例 API，并提供列配置、本地分页和远程请求能力。

## 安装

```bash
pnpm add element-plus-suite element-plus vue
```

## 使用

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElementPlusSuite from 'element-plus-suite'

const app = createApp(App)
app.use(ElementPlus)
app.use(ElementPlusSuite)
```

按需导入：

```ts
import { ElTablePro } from 'element-plus-suite'
```

## 设计原则

- 表格排序、筛选和查询条件由使用者自行处理。
- `request` 只接收 `page`、`pageSize`、`signal`。
- `request` 返回 `{ data, total }`。
- `ElTable` 的原生 props、事件和实例方法保持可用。

## 开发

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm build
pnpm docs:dev
```

## License

MIT
