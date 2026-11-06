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
      action: 'http://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
      name: 'file',
      listType: 'text',
      limit: 3,
      style: { width: '100%' },
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
