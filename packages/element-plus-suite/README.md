# Element Plus Suite

Element Plus Suite 是基于 Element Plus 二次封装的组件库，开箱即用。可以显著地提升中台页面的效率，轻松搬砖。

[文档](https://th74100.github.io/element-plus-suite/) · [GitHub](https://github.com/th74100/element-plus-suite)

## 特性

- **🚀 高效开发**：提供常用业务组件，减少重复代码
- **🎯 灵活配置**：支持 JSON 配置式和模板式，满足不同场景需求
- **💪 TypeScript**：提供完整的类型定义，更好的开发体验
- **🔥 Element Plus**：基于 Element Plus，支持主题定制

## 环境要求

- Vue 3.2 或更高版本
- Element Plus 2.0 或更高版本
- 支持 ESM 的现代构建工具

## 安装

```bash
npm install element-plus-suite
```

## 注册组件

如果项目已经全局注册 Element Plus，可以直接注册组件库：

```ts
import { createApp } from 'vue'
import ElementPlusSuite from 'element-plus-suite'
import 'element-plus-suite/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlusSuite)
app.mount('#app')
```

也可以按需导入：

```ts
import { ElButtonPro, ElTablePro, ElFormPro } from 'element-plus-suite'
import 'element-plus-suite/dist/index.css'
```

更多用法请查看[文档](https://th74100.github.io/element-plus-suite/components/button-pro/)

## License

MIT
