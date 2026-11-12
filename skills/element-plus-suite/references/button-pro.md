# ElButtonPro

## Import

Global registration exists: do not import runtime components in the SFC.

No global registration:

```ts
import { ElButtonPro } from 'element-plus-suite'
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| block | `boolean` | `false` |
| iconPlacement | `'start' \| 'end'` | `'start'` |
| gradient | `string \| ButtonProGradient` | - |
| hoverGradient | `string \| ButtonProGradient` | - |

`ButtonProGradient`:

```ts
interface ButtonProGradient {
  from: string
  to: string
  angle?: number
}
```

All native `ElButton` props, events, slots, and instance methods remain available.

## Examples

### Basic

```vue
<ElButtonPro type="primary">Submit</ElButtonPro>
```

### Block

```vue
<ElButtonPro type="primary" block>Submit</ElButtonPro>
```

### Icon after text

```vue
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
</script>

<template>
  <ElButtonPro type="primary" :icon="Search" icon-placement="end">
    Search
  </ElButtonPro>
</template>
```

### Gradient

Prefer object configuration:

```vue
<ElButtonPro
  type="primary"
  :gradient="{ from: '#6253e1', to: '#04befe', angle: 135 }"
  :hover-gradient="{ from: '#06b6d4', to: '#7c3aed', angle: 135 }"
>
  Continue
</ElButtonPro>
```

A CSS gradient string is also accepted:

```vue
<ElButtonPro
  type="primary"
  gradient="linear-gradient(135deg, #6253e1, #04befe)"
/>
```

### Async loading

```vue
<script setup lang="ts">
async function save() {
  await api.save()
}
</script>

<template>
  <ElButtonPro type="primary" @click="save">
    Save
  </ElButtonPro>
</template>
```

Use `@click` with an async function when automatic loading status is wanted.

## Restrictions

- `gradient` and `hoverGradient` only apply to solid buttons.
- `plain`, `dashed`, `text`, `link`, and `type="text"` do not support gradients.
- `hoverGradient` requires `gradient`.

## Types

```ts
import type {
  ButtonProGradient,
  ButtonProGradientValue,
  ButtonProIconPlacement,
  ButtonProInstance,
} from 'element-plus-suite'
```
