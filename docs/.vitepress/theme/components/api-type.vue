<template>
  <span class="api-type">
    <code class="api-type__name">{{ type }}</code>

    <ClientOnly>
      <ElPopover
        placement="top"
        trigger="click"
        popper-class="api-type-popover"
      >
        <template #reference>
          <button
            type="button"
            class="api-type__trigger"
            aria-label="查看类型签名"
          >
            ?
          </button>
        </template>

        <code class="api-type__signature">{{ signature }}</code>
      </ElPopover>

      <template #fallback>
        <span
          class="api-type__trigger"
          aria-hidden="true"
        >
          ?
        </span>
      </template>
    </ClientOnly>
  </span>
</template>

<script setup lang="ts">
import { ElPopover } from 'element-plus'

defineProps<{
  type: string
  signature: string
}>()
</script>
