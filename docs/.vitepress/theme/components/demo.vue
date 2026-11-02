<template>
  <ClientOnly>
    <figure class="vp-demo">
      <div class="vp-demo__preview">
        <slot />
      </div>
      <figcaption class="vp-demo__bar">
        <span>示例</span>
        <button
          type="button"
          class="vp-demo__toggle"
          :class="{ 'is-active': visible }"
          :aria-expanded="visible"
          @click="visible = !visible"
        >
          <svg class="vp-demo__code-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
          </svg>
          {{ visible ? '收起源码' : '查看源码' }}
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
