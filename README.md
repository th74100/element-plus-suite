# element-plus-suite

基于 Element Plus 二次封装的组件库。

## 组件

`ElTablePro` 的诞生是为了解决项目中需要写很多 Table 的样板代码的问题，所以在其中封装了很多常用的逻辑。这些封装可以简单的分类为预设行为与预设逻辑。

## 安装

```bash
pnpm add element-plus-suite
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
