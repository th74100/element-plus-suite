# ElFormPro

## Import

Global registration exists: do not import runtime components in the SFC.

No global registration:

```ts
import {
  ElFormPro,
  type FormProConfig,
  type FormProSchemaItem,
} from 'element-plus-suite'
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| schema | `FormProSchemaItem[]` | `[]` |
| modelValue (`v-model`) | `Record<string, any>` | - |
| formConfig | `FormProConfig` | `{}` |

All native `ElForm` props, events, slots, and instance methods remain available.

## Basic form

`v-model` is optional. Omit it when the parent does not need continuous access to form values.

```vue
<script setup lang="ts">
import type { FormProConfig, FormProSchemaItem } from 'element-plus-suite'

const schema: FormProSchemaItem[] = [
  {
    key: 'keyword',
    label: 'Keyword',
    type: 'input',
    defaultValue: '',
    col: 8,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: '',
    col: 8,
    fieldProps: {
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },
  },
]

const formConfig: FormProConfig = {
  labelWidth: 90,
  col: 8,
  buttons: {
    submit: { text: 'Search', type: 'primary' },
    reset: { text: 'Reset' },
  },
}
</script>

<template>
  <ElFormPro
    :schema="schema"
    :form-config="formConfig"
    @submit="values => console.log(values)"
  />
</template>
```

Use `v-model` only when the parent must read or update values while the form is mounted:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const model = ref({
  keyword: '',
  status: '',
})
</script>

<template>
  <ElFormPro v-model="model" :schema="schema" :form-config="formConfig" />
</template>
```

## Schema fields

| Field | Type | Notes |
| --- | --- | --- |
| key | `string` | Optional on composite parent |
| label | `string \| () => VNodeChild` | - |
| type | `FormProFieldType \| Component \| VNode \| string` | - |
| col | `number \| FormProColProps` | Number means span |
| labelWidth | `string \| number` | - |
| rules | `FormItemRule[]` | - |
| hidden | `boolean` | - |
| defaultValue | `any` | - |
| formItemProps | `Record<string, any>` | ElFormItem props |
| fieldProps | `Record<string, any>` | Field component props |
| slot | `string` | Custom field slot |
| children | `FormProSchemaItem[]` | Composite fields |
| separator | `string` | Separator between children |

## Field types

```ts
type FormProFieldType =
  | 'input'
  | 'password'
  | 'number'
  | 'select'
  | 'selectV2'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'timeSelect'
  | 'autocomplete'
  | 'cascader'
  | 'inputTag'
  | 'rate'
  | 'slider'
  | 'switch'
  | 'tree'
  | 'transfer'
  | 'upload'
  | 'mention'
  | 'captcha'
```

## Captcha field

Use `type: 'captcha'` with `phoneName` to validate the phone field before sending a code.

```ts
{
  key: 'captcha',
  label: 'Verification code',
  type: 'captcha',
  rules: [{ required: true, message: 'Enter the code' }],
  fieldProps: {
    phoneName: 'phone',
    countDown: 60,
    onGetCaptcha: async phone => {
      await api.sendCaptcha(phone)
    },
  },
}
```

`onGetCaptcha` receives the value of the `phoneName` field. The countdown starts only after the request resolves successfully.

Minimum Element Plus versions:

| Type | Version |
| --- | --- |
| tree | 2.1.8 |
| mention | 2.8.0 |
| inputTag | 2.9.0 |

## Composite field

```ts
const schema: FormProSchemaItem[] = [
  {
    label: 'Event time',
    separator: '-',
    children: [
      {
        key: 'date',
        type: 'date',
        defaultValue: '',
        rules: [{ required: true, message: 'Select a date', trigger: 'change' }],
      },
      {
        key: 'time',
        type: 'time',
        defaultValue: '',
      },
    ],
  },
]
```

## Form config

| Field | Type | Notes |
| --- | --- | --- |
| buttonAlign | `'start' \| 'center' \| 'right'` | Default right |
| buttons | `FormProButtons` | Submit/reset/cancel |
| row | `Record<string, any>` | ElRow props |
| col | `number \| FormProColProps` | Default field column |
| actionCol | `number \| FormProColProps` | Action column |
| labelPosition | ElForm position or responsive object | - |
| labelWidth | `string \| number` | - |

Responsive labels:

```ts
const formConfig: FormProConfig = {
  labelPosition: {
    base: 'right',
    xs: 'top',
    md: 'right',
  },
}
```

## Buttons

```ts
const formConfig: FormProConfig = {
  buttons: {
    submit: { text: 'Save', type: 'primary' },
    reset: { text: 'Clear' },
    cancel: { text: 'Cancel' },
  },
}
```

Set a button to `false` to hide it.

Customize all actions with the `buttons` slot:

```vue
<ElFormPro :schema="schema">
  <template #buttons>
    <ElButton type="primary">Save</ElButton>
  </template>
</ElFormPro>
```

## Events

| Event | Payload |
| --- | --- |
| submit | `FormProValue` |
| reset | `FormProValue` |
| cancel | - |
| change | `FormProValue` |

## Slots

### Replace a whole field

Use `schema[].slot` when present; otherwise use `schema[].key`.

```ts
const schema: FormProSchemaItem[] = [
  { key: 'status', label: 'Status', slot: 'status-field' },
]
```

```vue
<ElFormPro :schema="schema">
  <template #status-field="{ item, model }">
    <ElSelect v-model="model[item.key]" />
  </template>
</ElFormPro>
```

Without `slot`, the same example uses `#status`:

```ts
const schema: FormProSchemaItem[] = [
  { key: 'status', label: 'Status' },
]
```

```vue
<ElFormPro :schema="schema">
  <template #status="{ item, model }">
    <ElSelect v-model="model[item.key]" />
  </template>
</ElFormPro>
```

### Field component slots

Use `fieldProps.slots` to forward slots into the field component:

```ts
{
  key: 'keyword',
  label: 'Keyword',
  type: 'input',
  fieldProps: {
    slots: {
      prefix: 'keyword-prefix',
    },
  },
}
```

```vue
<ElFormPro :schema="schema">
  <template #keyword-prefix>
    <Search />
  </template>
</ElFormPro>
```

### Buttons

```vue
<ElFormPro :schema="schema">
  <template #buttons>
    <ElButton type="primary">Save</ElButton>
  </template>
</ElFormPro>
```

## Instance methods

```ts
import { useTemplateRef } from 'vue'
import type { FormProInstance } from 'element-plus-suite'

const formRef = useTemplateRef<FormProInstance>('formRef')

await formRef.value?.validate()
formRef.value?.validateField(['keyword'])
formRef.value?.resetFields()
formRef.value?.clearValidate()
await formRef.value?.scrollToError()
formRef.value?.setState({ labelWidth: 120 })
formRef.value?.getValues()
```

## Types

```ts
import type {
  FormProConfig,
  FormProFieldType,
  FormProInstance,
  FormProSchemaItem,
} from 'element-plus-suite'
```
