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
