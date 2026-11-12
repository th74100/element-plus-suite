<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ElFormPro,
  type FormProConfig,
  type FormProSchemaItem,
} from 'element-plus-suite'

const model = ref({
  showContact: true,
  contactLocked: false,
  requireRemark: false,
  showMoreChannels: false,
  channel: '1',
  contact: '',
  remark: '',
  followUp: '',
})

const formConfig: FormProConfig = {
  labelWidth: 110,
  col: 12,
  buttons: {
    submit: { text: '提交', type: 'primary' },
    reset: { text: '重置' },
  },
}

const schema = computed<FormProSchemaItem[]>(() => [
  {
    key: 'showMoreChannels',
    label: '显示更多渠道',
    type: 'switch',
    col: 6,
  },
  {
    key: 'showContact',
    label: '显示联系方式',
    type: 'switch',
    col: 6,
  },
  {
    key: 'contactLocked',
    label: '禁用联系方式',
    type: 'switch',
    col: 6,
  },
  {
    key: 'requireRemark',
    label: '备注必填',
    type: 'switch',
    col: 6,
  },
  {
    key: 'channel',
    label: '联系渠道',
    type: 'select',
    col: 12,
    fieldProps: {
      options: [
        { label: '电话', value: '1' },
        { label: '邮件', value: '2' },
        ...(model.value.showMoreChannels
          ? [{ label: '企业微信', value: '3' }]
          : []),
      ],
    },
  },
  {
    key: 'contact',
    label: '联系方式',
    type: 'input',
    hidden: !model.value.showContact,
    col: 12,
    rules: [
      { required: true, message: '请输入联系方式', trigger: ['blur', 'change'] },
    ],
    fieldProps: {
      disabled: model.value.contactLocked,
      placeholder: model.value.contactLocked ? '已禁用' : '请输入联系方式',
    },
  },
  {
    key: 'remark',
    label: '备注',
    type: 'input',
    col: 12,
    rules: [
      {
        required: model.value.requireRemark,
        message: '请输入备注',
        trigger: ['blur', 'change'],
      },
    ],
  },
  {
    key: 'followUp',
    label: '跟进说明',
    type: 'input',
    col: 12,
    rules: [
      {
        required: !!model.value.contact,
        message: '填写联系方式后，请补充跟进说明',
        trigger: ['blur', 'change'],
      },
    ],
    fieldProps: {
      placeholder: model.value.contact ? '请补充跟进说明' : '选填',
    },
  },
])

function handleSubmit(values: Record<string, any>) {
  console.log('dynamic form submit', values)
}
</script>

<template>
  <ElFormPro
    v-model="model"
    :schema="schema"
    :form-config="formConfig"
    @submit="handleSubmit"
  />
</template>
