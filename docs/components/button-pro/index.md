---
title: Button 按钮 | Element Plus Suite
description: 在 Element Plus Button 基础上进行的一些功能扩展。
---

<script setup lang="ts">
import BasicDemo from './demos/basic.vue'
import BlockDemo from './demos/block.vue'
import GradientDemo from './demos/gradient.vue'
import AsyncDemo from './demos/async.vue'
import IconPlacementDemo from './demos/icon-placement.vue'
</script>

# Button 按钮

`ElButtonPro` 基于 Element Plus Button，在保留其全部属性、事件和插槽能力的基础上提供额外扩展。

## 基础用法

用法与 `ElButton` 一致

<Demo>
  <BasicDemo />
  <template #code>

```vue
<template>
    <ElButtonPro>Default</ElButtonPro>
    <ElButtonPro type="primary">Primary</ElButtonPro>
    <ElButtonPro type="success">Success</ElButtonPro>
    <ElButtonPro type="warning" plain>Warning</ElButtonPro>
    <ElButtonPro type="danger" round>Danger</ElButtonPro>
</template>
```

  </template>
</Demo>

## 整行按钮

设置 `block` 属性将使按钮适合其父宽度

<Demo>
  <BlockDemo />
  <template #code>

```vue
<template>
  <ElButtonPro type="primary" block>Button</ElButtonPro>
</template>
```

  </template>
</Demo>

## 渐变按钮

通过 `gradient` 属性设置按钮的渐变，这里展示了如何为按钮添加渐变色效果。

<Demo>
  <GradientDemo />
  <template #code>

```vue
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
</script>

<template>
  <ElButtonPro
    type="primary"
    :gradient="{ from: '#6253e1', to: '#04befe'}"
    :icon="Search"
    circle
  />

  <ElButtonPro
    type="primary"
    :gradient="{ from: '#6253e1', to: '#04befe'}"
    :hover-gradient="{ from: '#06b6d4', to: '#7c3aed'}"
    :icon="Search"
  >
    Button
  </ElButtonPro>

  <ElButtonPro plain>
    Button
  </ElButtonPro>
</template>


```
  </template>
</Demo>

::: tip
`plain`、`dashed`、`text`、`link` 以及 `type="text"` 的按钮不支持渐变。
:::

## 图标位置

通过 `iconPlacement` 设置按钮图标的位置，支持 `start` 和 `end`，默认为 `start`。

<Demo>
  <IconPlacementDemo />
  <template #code>

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { ButtonProIconPlacement } from 'element-plus-suite'

const iconPlacement = ref<ButtonProIconPlacement>('start')
</script>

<template>
  <div class="button-pro-demo">
    <ElRadioGroup v-model="iconPlacement">
      <ElRadioButton value="start">start</ElRadioButton>
      <ElRadioButton value="end">end</ElRadioButton>
    </ElRadioGroup>

    <el-divider content-position="left">预览</el-divider>

    <div>
      <ElButtonPro :icon="Search" circle/>

      <ElButtonPro circle>A</ElButtonPro>

      <ElButtonPro
        type="primary"
        :icon="Search"
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>

      <ElButtonPro
        :icon="Search"
        plain
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>

      <ElButtonPro
        :icon="Search"
        plain
        text
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>

      <ElButtonPro
        type="primary"
        :icon="Search"
        :loading="true"
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>
    </div>
  </div>
</template>

<style scoped>
.button-pro-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
</style>
```

  </template>
</Demo>

## 异步加载

`ElButtonPro` 会在点击处理函数执行期间自动显示加载状态，并在处理完成后恢复。

<Demo>
  <AsyncDemo />
  <template #code>

```vue
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

function request() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 1000)
  })
}
</script>

<template>
  <ElButtonPro
    type="primary"
    :icon="Search"
    @click="request"
  >
    异步提交
  </ElButtonPro>
</template>

```

  </template>
</Demo>

## API

`ElButtonPro` 是在 Element Plus Button 基础上进行了一些功能扩展，这里只列出与 Element Plus Button 不同 API。

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| block | 按钮是否独占一行 | `boolean` | `false` |
| iconPlacement | 图标在文字前或文字后 | <ApiType type="string" signature="'start' &#124; 'end'" /> | `'start'` |
| gradient | 渐变背景，支持 CSS 渐变字符串或起止颜色对象 | `string` / `ButtonProGradient` | - |
| hoverGradient | 鼠标经过时的渐变背景；渐变覆盖层会淡出并显示该背景 | `string` / `ButtonProGradient` | - |

更多属性请查看 [Element Plus Button](https://element-plus.org/zh-CN/component/button.html#button-attributes)

### ButtonProGradient

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| from | 渐变起始颜色 | `string` | - |
| to | 渐变结束颜色 | `string` | - |
| angle | 渐变角度，单位为 `deg` | `number` | `135` |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击事件，支持返回 Promise | `(event: MouseEvent) => void \| Promise<void>` |

### 特性
- 整行按钮
- 自定义渐变背景
- 继承 Element Plus Button 的所有属性
