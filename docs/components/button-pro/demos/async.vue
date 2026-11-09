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
