import { onBeforeUnmount, shallowRef } from 'vue'
import type {
  TableProRequest,
  TableProRequestResult,
} from '../types'

interface UseTableRequestOptions<Row> {
  request: () => TableProRequest<Row> | undefined
  page: () => number | null
  pageSize: () => number | null
  query: () => Record<string, any>
  onLoaded?: (result: TableProRequestResult<Row>) => void
  onError?: (error: unknown) => void
  onData?: (result: TableProRequestResult<Row>) => void
}

/**
 * 管理远程请求生命周期。
 * 同时使用 AbortController 和递增 requestId，
 * 即使调用方没有透传 signal，旧请求也不会覆盖新数据。
 */
export function useTableRequest<Row>(
  options: UseTableRequestOptions<Row>,
) {
  const loading = shallowRef(false)
  let controller: AbortController | null = null
  let requestId = 0

  async function load() {
    const request = options.request()
    if (!request) return

    // 发起新请求前取消旧请求。
    controller?.abort()
    controller = new AbortController()

    const currentId = ++requestId
    const currentController = controller
    loading.value = true

    try {
      const result = await request({
        page: options.page(),
        pageSize: options.pageSize(),
        query: options.query(),
        signal: currentController.signal,
      })

      // 已取消或已有更新请求时丢弃本次结果。
      if (
        currentController.signal.aborted ||
        currentId !== requestId
      ) {
        return
      }

      options.onData?.(result)
      options.onLoaded?.(result)
    } catch (error) {
      // 取消请求不视为业务错误。
      if (
        currentController.signal.aborted ||
        currentId !== requestId
      ) {
        return
      }

      options.onError?.(error)
    } finally {
      if (currentId === requestId) {
        loading.value = false
      }
    }
  }

  function cancel() {
    controller?.abort()
    requestId += 1
    loading.value = false
  }

  onBeforeUnmount(cancel)

  return { loading, load, cancel }
}
