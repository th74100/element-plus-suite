<template>
  <ElConfigProvider :locale="zhCn">
    <DefaultTheme.Layout />
  </ElConfigProvider>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>