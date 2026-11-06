<template>
  <ElFormPro
    :schema="schema"
    :form-config="formConfig"
  />
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { ElInput, ElTag, ElTooltip, ElIcon } from 'element-plus'
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
      h('span', null, [
        '项目名称',
        h(ElTooltip, { content: '填写项目的正式名称' }, () =>
          h(ElIcon, {style: 'margin-left: 5px;'}, () => h(QuestionFilled))),
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