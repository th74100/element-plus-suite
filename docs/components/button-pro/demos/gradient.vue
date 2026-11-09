<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
</script>

<template>
  <ElButtonPro
    type="primary"
    :gradient="{ from: '#6253e1', to: '#04befe'}"
    :icon="Search"
    circle
  />

  <ElButtonPro
    type="primary"
    :gradient="{ from: '#6253e1', to: '#04befe'}"
    :hover-gradient="{ from: '#06b6d4', to: '#7c3aed'}"
    :icon="Search"
  >
    Button
  </ElButtonPro>

  <ElButtonPro plain>
    Button
  </ElButtonPro>
</template>
