<template>
  <ElFormPro
    :schema="schema"
    :form-config="formConfig"
    @submit="onSubmit"
  />

  <pre v-if="submittedValues" class="submit-values">{{ submittedValues }}</pre>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ElFormPro,
  type FormProConfig,
  type FormProSchemaItem,
} from 'element-plus-suite'

const schema: FormProSchemaItem[] = [
  {
    key: 'phone',
    label: '手机号',
    defaultValue: '',
    col: 24,
    rules: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      {
        pattern: /^1\d{10}$/,
        message: '请输入正确的手机号',
        trigger: 'blur',
      },
    ],
  },
  {
    key: 'captcha',
    label: '验证码',
    type: 'captcha',
    defaultValue: '',
    col: 24,
    rules: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    fieldProps: {
      phoneName: 'phone',
      countDown: 60,
      placeholder: '请输入验证码',
      async onGetCaptcha(phone: string) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        ElMessage.success(`手机号 ${phone} 验证码发送成功!`)
      },
    },
  },
]

const formConfig: FormProConfig = {
  labelWidth: 90,
  labelPosition: 'top',
  actionCol: {
    style: {
      marginTop: '10px',
    },
  },
  buttons: {
    submit: {
      text: '登 录',
      type: 'primary',
      size: 'large',
      block: true,
      gradient: {
        from: '#6253e1',
        to: '#04befe'
      }
    },
    reset: false,
  },
}

const submittedValues = ref('')

function onSubmit(values: Record<string, any>) {
  submittedValues.value = JSON.stringify(values, null, 2)
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
