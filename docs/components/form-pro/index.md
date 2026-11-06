---
title: Form 表单 | Element Plus Suite
description: 基于 schema 配置的 Element Plus 表单组件。
---

<script setup lang="ts">
import BasicDemo from './demos/basic.vue'
import SlotsDemo from './demos/slots.vue'
import RenderDemo from './demos/render.vue'
import RulesDemo from './demos/rules.vue'
</script>

# Form 表单

ElFormPro 的诞生是为了减少表单中的重复代码。并通过 schema 帮助我们快速地开发一个表单。

## 基础用法

通过 schema 快速生成表单

<Demo>
  <BasicDemo />
  <template #code>

```vue
<template>
  <ElFormPro
    :schema="schema"
    :form-config="formConfig"
    @submit="onSubmit"
    @cancel="onCancel"
  />

  <pre v-if="submittedValues" class="submit-values">{{ submittedValues }}</pre>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElFormPro,
  type FormProConfig,
  type FormProSchemaItem,
} from 'element-plus-suite'

const schema: FormProSchemaItem[] = [
  {
    key: 'name',
    label: '用户名',
    defaultValue: '',
    col: 12,
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
  },
  {
    key: 'region',
    label: '地区',
    type: 'select',
    defaultValue: '',
    col: 12,
    rules: [
      { required: true, message: '请选择地区', trigger: 'change' },
    ],
    fieldProps: {
      options: [
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing' },
      ],
      slots: {
        header: () => '自定义 header',
        footer: () => '自定义 footer'
      }
    },
  },
  {
    label: '活动时间',
    separator: '-',
    children: [
      {
        key: 'date1',
        type: 'date',
        defaultValue: '',
        rules: [
          { required: true, message: '请选择活动日期', trigger: 'change' },
        ],
        fieldProps: {
          type: 'date',
          placeholder: '选择一个日期',
          style: { width: '100%' },
        },
      },
      {
        key: 'date2',
        type: 'time',
        defaultValue: '',
        fieldProps: {
          placeholder: '选择一个时间',
          style: { width: '100%' },
        },
      },
    ],
  },
  {
    key: 'delivery',
    label: '即时送达',
    type: 'switch',
    defaultValue: false,
  },
  {
    key: 'type',
    label: '活动类型',
    type: 'checkbox',
    defaultValue: [],
    fieldProps: {
      options: [
        { label: '在线活动', value: 'Online activities' },
        { label: '促销活动', value: 'Promotion activities' },
        { label: '线下活动', value: 'Offline activities' },
      ],
    },
  },
  {
    key: 'resource',
    label: '资源',
    type: 'radio',
    defaultValue: '',
    fieldProps: {
      options: [
        { label: '赞助商', value: 'Sponsor' },
        { label: '场地', value: 'Venue' },
      ],
    },
  },
  {
    key: 'desc',
    label: '活动形式',
    defaultValue: '',
    fieldProps: {
      type: 'textarea',
      rows: 4,
    },
  },
  {
    key: 'cities',
    label: '目标城市',
    type: 'transfer',
    defaultValue: [],
    fieldProps: {
      data: [
        { key: 'shanghai', label: '上海' },
        { key: 'beijing', label: '北京' },
        { key: 'guangzhou', label: '广州' },
      ],
      titles: ['可选城市', '已选城市'],
    },
  },
  {
    key: 'attachments',
    label: '活动附件',
    type: 'upload',
    defaultValue: [],
    fieldProps: {
      action: 'https://httpbin.org/post',
      name: 'file',
      listType: 'text',
      limit: 3,
    },
  },
  {
    key: 'mention',
    label: '指定成员',
    type: 'mention',
    defaultValue: '',
    fieldProps: {
      options: [
        { value: 'Alice', label: 'Alice' },
        { value: 'Bob', label: 'Bob' },
        { value: 'Carol', label: 'Carol' },
      ],
      placeholder: '输入 @ 提及成员',
    },
  },
]

const formConfig: FormProConfig = {
  labelWidth: 'auto',
  buttons: {
    submit: {
      text: '创建',
      type: 'primary',
    },
    reset: false,
    cancel: {
      text: '取消',
    },
  },
}

const submittedValues = ref('')

function onSubmit(values: Record<string, any>) {
  submittedValues.value = JSON.stringify(values, null, 2)
}

function onCancel() {
  console.log('cancel!')
}
</script>

<style scoped>
.submit-values {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>

```

  </template>
</Demo>

## 自定义插槽

通过 `key`、`slot` 和 `fieldProps.slots` 对应插槽名称

<Demo>
  <SlotsDemo />
  <template #code>

```vue
<template>
  <ElFormPro
    :schema="schema"
    :form-config="{
      buttons: {
        submit: false,
        reset: false,
      },
    }"
  >
    <template #input-prefix>
      <span>https://</span>
    </template>

    <template #colorPicker="{model}">
      <ElColorPicker v-model="model.color" />
    </template>

    <template #rate="{model}">
      <ElRate v-model="model.rate" />
    </template>
  </ElFormPro>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { ElAvatar, ElRate, ElColorPicker } from 'element-plus'
import { ElFormPro, type FormProSchemaItem } from 'element-plus-suite'

const schema: FormProSchemaItem[] = [
  {
    key: 'url',
    label: '网址',
    fieldProps: {
      slots: {
        prefix: 'input-prefix',

        // 函数形式的插槽会直接渲染为 VNode
        suffix: () => h('span', null, '.com'),
      },
    },
  },
  {
    key: 'color',
    label: '颜色',
    slot: 'colorPicker',
    defaultValue: '#409eff',
  },
  {
    key: 'rate',
    label: '评分',
    defaultValue: 3,
  },
]
</script>
```

  </template>
</Demo>

## 自定义 label 和 type

ElFormItem 的 `label` 和 `type` 支持 h 函数渲染。

<Demo>
  <RenderDemo />
  <template #code>

```vue
<template>
  <ElFormPro
    :schema="schema"
    :form-config="formConfig"
  />
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { ElInput, ElTag, ElTooltip } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import {
  ElFormPro,
  type FormProConfig,
  type FormProSchemaItem,
} from 'element-plus-suite'

const schema: FormProSchemaItem[] = [
  {
    key: 'project',
    label: () =>
      h('span', { class: 'custom-label' }, [
        '项目名称',
        h(ElTooltip, { content: '填写项目的正式名称' }, () =>
          h('span', null, ' ?')),
      ]),
  },
  {
    key: 'level',
    label: '优先级',
    type: h(ElTag, { type: 'warning', effect: 'light' }, () => 'custom type'),
  },
]

const formConfig: FormProConfig = {
  labelWidth: 90,
  buttons: {
    submit: false,
    reset: false,
  },
}
</script>
```

  </template>
</Demo>

## Rules 校验

使用 `rules` 配置字段校验规则来验证用户的输入是否符合规范。

<Demo>
  <RulesDemo />
  <template #code>

```vue
<template>
  <ElFormPro
    ref="formRef"
    :schema="schema"
    :form-config="{
      labelWidth: 90
    }"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElFormPro,
  type FormProInstance,
  type FormProSchemaItem,
} from 'element-plus-suite'

const formRef = ref<FormProInstance>()

const schema: FormProSchemaItem[] = [
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    rules: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
    ],
  },
  {
    key: 'username',
    label: '用户名',
    formItemProps: {
      showMessage: false,
    },
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        min: 3,
        max: 12,
        message: '用户名长度在 3 到 12 个字符之间',
        trigger: ['blur', 'change'],
      },
    ],
  },
  {
    key: 'password',
    label: '密码',
    type: 'password',
    rules: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        min: 6,
        max: 20,
        message: '密码长度在 6 到 20 个字符之间',
        trigger: ['blur', 'change'],
      },
    ],
    fieldProps: {
      showPassword: true
    }
  },
  {
    key: 'confirmPassword',
    label: '确认密码',
    type: 'password',
    rules: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value === '') {
            callback(new Error('请再次输入密码'))
          } else if (value !== formRef.value?.getValues().password) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
    fieldProps: {
      showPassword: true
    }
  }
]

function handleSubmit(values: Record<string, any>) {
  console.log('valid submit', values)
}
</script>
```

  </template>
</Demo>

## API

ElFormPro 在 Element Plus 的 Form 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 Element Plus Form 不同和部分原始的 API。

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| schema | 表单配置 | `FormProSchemaItem[]` | - |
| model | 表单数据 | `Record<string, any>` | - |
| formConfig | 全局配置 | `FormProConfig` | - |

### FormProConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| labelPosition | 标签位置；支持字符串或响应式对象，对象配置见下方 | <ApiType type="string" signature="'left' &#124; 'right' &#124; 'top'" /> / <ApiType type="object" signature="FormProLabelPositionConfig" /> | `{ base: 'top', md: 'right' }` |
| buttonAlign | 底部按钮区域水平对齐方式 | <ApiType type="string" signature="'start' &#124; 'center' &#124; 'right'" /> | `'right'` |
| buttons | 提交、重置、取消按钮配置 | `FormProButtons` | - |
| row | 分栏间隔 | `object` | `{ gutter: 18 }` |
| col | 栅格列配置 | `number` / `FormProColProps` | `24` |
| actionCol | 操作按钮栅格列配置 | `number` / `FormProColProps` | - |

#### labelPosition 对象配置

`labelPosition` 传入对象时，可按断点配置标签位置；未命中的断点会沿用前一个有效值，`base` 作为基础回退值。

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| base | 基础标签位置，所有断点未配置时使用 | <ApiType type="string" signature="'left' &#124; 'right' &#124; 'top'" /> |
| xs | 视口宽度 `< 768px` 时使用 | <ApiType type="string" signature="'left' &#124; 'right' &#124; 'top'" /> |
| sm | 视口宽度 `≥ 768px` 时使用 | <ApiType type="string" signature="'left' &#124; 'right' &#124; 'top'" /> |
| md | 视口宽度 `≥ 992px` 时使用 | <ApiType type="string" signature="'left' &#124; 'right' &#124; 'top'" /> |
| lg | 视口宽度 `≥ 1200px` 时使用 | <ApiType type="string" signature="'left' &#124; 'right' &#124; 'top'" /> |
| xl | 视口宽度 `≥ 1920px` 时使用 | <ApiType type="string" signature="'left' &#124; 'right' &#124; 'top'" /> |

更多属性请参考 [**Element Plus Form API**](https://element-plus.org/zh-CN/component/form.html#form-attributes)

### FormProSchemaItem

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 字段名，唯一性；组合字段容器可省略 | `string` | - |
| label | 标签文本 | `string` / `Function` | - |
| type | 字段组件类型；`tree` 需 Element Plus 2.1.8+，`mention` 需 Element Plus 2.8.0+，`inputTag` 需 Element Plus 2.9.0+ | <ApiType type="enum" signature="'input' &#124; 'password' &#124; 'number' &#124; 'select' &#124; 'selectV2' &#124; 'radio' &#124; 'checkbox' &#124; 'date' &#124; 'time' &#124; 'timeSelect' &#124; 'autocomplete' &#124; 'cascader' &#124; 'inputTag' &#124; 'rate' &#124; 'slider' &#124; 'switch' &#124; 'tree' &#124; 'transfer' &#124; 'upload' &#124; 'mention'" /> / `Component` | input |
| formItemProps | 透传给 ElFormItem 的属性 | `object` | - |
| fieldProps | 透传给 type 组件的属性 | `object` | - |
| defaultValue | 字段初始值 | `any` | - |
| col | 栅格列配置 | `number` / `FormProColProps` | `24` |
| rules | 校验规则 | `FormItemRule[]` | - |
| hidden | 是否隐藏 | `boolean` | false |
| slot | 自定义插槽 | `string` | - |
| children | 子字段配置，用于组合字段 | `FormProSchemaItem[]` | - |
| separator | 子字段之间显示的分隔符 | `string` | '' |

更多属性请参考 [**Element Plus FormItem API**](https://element-plus.org/zh-CN/component/form.html#formitem-attributes)

## 布局配置

通过 `formConfig` 设置表单与栅格布局：

```ts
const formConfig: FormProConfig = {
  labelPosition: 'right',
  labelWidth: 90,
  buttonAlign: 'right',
  row: { gutter: 18 },
  col: 8,
  actionCol: 12,
  buttons: {
    submit: {
      text: '查询',
      type: 'primary',
    },
    reset: {
      text: '重置',
    },
  },
}
```

`col`、`actionCol` 和 schema 项的 `col` 都支持数字简写；需要偏移或响应式配置时仍使用对象形式：

```ts
const formConfig: FormProConfig = {
  col: 12,
  actionCol: { span: 6, offset: 18 },
}

const schema = [
  { key: 'name', label: '名称', col: { span: 8, md: 6 } },
]
```

更多格栅布局配置请参考 [**Element Plus Layout**](https://element-plus.org/zh-CN/component/layout)

## 按钮配置

buttons 用来配置表单底部的提交、重置和取消按钮。默认显示“提交”和“重置”

```ts
const formConfig: FormProConfig = {
  buttons: {
    submit: { text: '搜索', type: 'primary' },
    reset: { text: '清空' },
    cancel: { text: '返回' },
  },
}
```

隐藏按钮时传 false

```ts
const formConfig: FormProConfig = {
  buttons: {
    submit: false,
    reset: false,
  },
}
```

需要完全自定义按钮区域时，使用 buttons 插槽

```vue
<template>
  <ElFormPro :schema="schema">
    <template #buttons>
      <ElButton @click="save">保存</ElButton>
      <ElButton @click="close">关闭</ElButton>
    </template>
  </ElFormPro>
</template>
```

更多按钮 API 配置请参考 [**Element Plus Button**](https://element-plus.org/zh-CN/component/button.html#button-attributes)

## Form Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| validate | 校验整个表单 | <ApiType type="Function" signature="(callback?: FormValidateCallback &#124; undefined) =&gt; Promise&lt;boolean&gt;" /> |
| validateField | 校验指定字段 | <ApiType type="Function" signature="(props?: Arrayable&lt;FormItemProp&gt; &#124; undefined, callback?: FormValidateCallback &#124; undefined) =&gt; Promise&lt;boolean&gt;" /> |
| resetFields | 重置字段与校验状态 | <ApiType type="Function" signature="(props?: Arrayable&lt;FormItemProp&gt; &#124; undefined) =&gt; void" /> |
| clearValidate | 清除校验结果 | <ApiType type="Function" signature="(props?: Arrayable&lt;FormItemProp&gt; &#124; undefined) =&gt; void" /> |
| scrollToError | 滚动到首个错误字段 | <ApiType type="Function" signature="() =&gt; Promise&lt;void&gt;" /> |
| getValues | 获取当前表单值 | <ApiType type="Function" signature="() =&gt; FormProValue" /> |
| setState | 更新表单配置 | <ApiType type="Function" signature="(options: FormProConfig) =&gt; void" /> |
