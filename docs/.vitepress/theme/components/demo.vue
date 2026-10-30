<template>
  <ClientOnly>
    <figure class="vp-demo">
      <div class="vp-demo__preview">
        <slot />
      </div>
      <figcaption class="vp-demo__bar">
        <span>示例</span>
        <button type="button" class="vp-demo__toggle" @click="visible = !visible">
          {{ visible ? '收起源码' : '查看源码' }}
          <span :class="{ 'is-open': visible }">⌄</span>
        </button>
      </figcaption>
      <ElCollapseTransition>
        <div v-show="visible" class="vp-demo__code">
          <slot name="code" />
        </div>
      </ElCollapseTransition>
    </figure>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElCollapseTransition } from 'element-plus'

const visible = ref(false)
</script>
