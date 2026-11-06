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
