import { computed, shallowRef, watch } from 'vue'
import {
  normalizePagination,
  type TableProPagination,
} from '../types/index'

/**
 * 管理 TablePro 的分页状态。
 * false 表示关闭分页，此时传给 request 的 page/pageSize 都是 null。
 */
export function useTablePagination(
  pagination: () => boolean | TableProPagination | undefined,
) {
  const config = computed(() => normalizePagination(pagination()))

  // 默认页码和每页条数来自统一默认配置。
  const currentPage = shallowRef(config.value?.page ?? 1)
  const pageSize = shallowRef(config.value?.pageSize ?? 20)

  watch(
    () => config.value?.page,
    (page) => {
      if (page !== undefined) currentPage.value = page
    },
  )
  watch(
    () => config.value?.pageSize,
    (size) => {
      if (size !== undefined) pageSize.value = size
    },
  )

  const requestPage = computed(() =>
    config.value ? currentPage.value : null,
  )
  const requestPageSize = computed(() =>
    config.value ? pageSize.value : null,
  )

  /**
   * 切换每页条数后回到第一页，避免停留在不存在的页码。
   */
  function setPageSize(size: number) {
    pageSize.value = size
    currentPage.value = 1
  }

  return {
    // 模板直接依赖这个布尔值，避免访问可能为 null 的配置。
    enabled: computed(() => config.value != null),
    config,
    currentPage,
    pageSize,
    requestPage,
    requestPageSize,
    setPageSize,
  }
}
