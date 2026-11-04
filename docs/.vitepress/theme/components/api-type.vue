<template>
  <span class="api-type">
    <code class="api-type__name">{{ type }}</code>

    <ClientOnly>
      <ElPopover
        placement="top"
        trigger="click"
        width="max-content"
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

        <div
          v-if="highlightedSignature"
          class="api-type__signature"
          v-html="highlightedSignature"
        />
        <code v-else class="api-type__signature">{{ signature }}</code>
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
import { onMounted, ref, watch } from 'vue'
import { highlightApiType } from '../composables/use-api-type-highlight'

const props = defineProps<{
  type: string
  signature: string
}>()

const highlightedSignature = ref('')

async function updateHighlight() {
  highlightedSignature.value = await highlightApiType(props.signature)
}

watch(() => props.signature, updateHighlight)
onMounted(updateHighlight)
</script>