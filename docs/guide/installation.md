# 安装

## 环境要求

- Vue 3.2 或更高版本
- Element Plus 2.0 或更高版本
- 支持 ESM 的现代构建工具

## 安装依赖

::: code-group

```bash [pnpm]
pnpm add element-plus-suite
```

```bash [npm]
npm install element-plus-suite
```

```bash [yarn]
yarn add element-plus-suite
```

:::

## 注册组件

如果项目已经全局注册 Element Plus，可以直接注册组件库

```ts
import { createApp } from 'vue'
import ElementPlusSuite from 'element-plus-suite'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlusSuite)
app.mount('#app')
```

也可以按需导入：

```ts
import { ElTablePro } from 'element-plus-suite'
```