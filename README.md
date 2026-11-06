# element-plus-suite

基于 Element Plus 二次封装的组件库。

## 组件

- `ElTablePro`：在 Element Plus Table 基础上封装分页、远程请求、筛选、单元格合并等常用能力，减少表格页面的样板代码。
- `ElFormPro`：基于 schema 配置生成表单，内置栅格布局、组合字段、校验、按钮和自定义插槽能力，适合快速搭建查询表单和业务表单。

## 安装

```bash
npm install element-plus-suite
```

## 使用

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElementPlusSuite from 'element-plus-suite'
import 'element-plus-suite/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(ElementPlusSuite)
app.mount('#app')
```

按需导入：

```ts
import { ElFormPro, ElTablePro } from 'element-plus-suite'
import 'element-plus-suite/dist/index.css'
```

两个组件都支持通过 `v-model` 绑定数据，详细 API 和示例请查看[组件文档](https://th74100.github.io/element-plus-suite/)。

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
