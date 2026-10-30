# 安装

## 环境要求

- Vue 3.4 或更高版本
- Element Plus 2.6 或更高版本
- 支持 ESM 的现代构建工具

## 安装依赖

::: code-group

```bash [pnpm]
pnpm add element-plus element-plus-suite
```

```bash [npm]
npm install element-plus element-plus-suite
```

```bash [yarn]
yarn add element-plus element-plus-suite
```

:::

`element-plus` 和 `vue` 是 peer dependencies，需要由项目安装。这样不会把 Element Plus 重复打进组件库。

## 注册组件

如果项目已经全局注册 Element Plus，可以直接注册组件库：

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElementPlusSuite from 'element-plus-suite'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(ElementPlusSuite)
app.mount('#app')
```

也可以按需导入：

```ts
import { ElTablePro } from 'element-plus-suite'
```

## 样式

组件依赖 Element Plus 的样式。请确保项目已经引入：

```ts
import 'element-plus/dist/index.css'
```

如果项目使用按需样式插件，保持原来的 Element Plus 样式配置即可，不需要额外引入组件库样式。
