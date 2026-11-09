<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { ButtonProIconPlacement } from 'element-plus-suite'

const iconPlacement = ref<ButtonProIconPlacement>('start')
</script>

<template>
  <div class="button-pro-demo">
    <ElRadioGroup v-model="iconPlacement">
      <ElRadioButton value="start">start</ElRadioButton>
      <ElRadioButton value="end">end</ElRadioButton>
    </ElRadioGroup>

    <el-divider content-position="left">预览</el-divider>

    <div>
      <ElButtonPro :icon="Search" circle/>

      <ElButtonPro circle>A</ElButtonPro>

      <ElButtonPro
        type="primary"
        :icon="Search"
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>

      <ElButtonPro
        :icon="Search"
        plain
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>

      <ElButtonPro
        :icon="Search"
        plain
        text
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>

      <ElButtonPro
        type="primary"
        :icon="Search"
        :loading="true"
        :icon-placement="iconPlacement"
      >
        Search
      </ElButtonPro>
    </div>
  </div>
</template>

<style scoped>
.button-pro-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
</style>
