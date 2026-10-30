# 快速开始

```ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElementPlusSuite from 'element-plus-suite'

const app = createApp(App)
app.use(ElementPlus)
app.use(ElementPlusSuite)
```

也可以按需导入：

```ts
import { ElTablePro } from 'element-plus-suite'
```
