<script lang="tsx">
import {
  computed,
  defineComponent,
  h,
  onMounted,
  shallowRef,
  useSlots,
  watch,
  withDirectives,
  type PropType,
} from 'vue'
import {
  ElPagination,
  ElTable,
  vLoading,

} from 'element-plus'
import { renderTableColumns } from './render-columns'
import { useTableMerge } from './composables/use-table-merge'
import { useTablePagination } from './composables/use-table-pagination'
import { useTableRequest } from './composables/use-table-request'
import type {
  TableProColumn,
  TableProInstance,
  TableProPagination,
  TableProRequest,
  TableProRequestResult,
  TableProTableInstance,
  TableProTableProps,
} from './types'

export default defineComponent({
  name: 'ElTablePro',
  inheritAttrs: false,
  props: {
    columns: {
      type: Array as PropType<TableProColumn<any>[]>,
      default: () => [],
    },
    request: {
      type: Function as PropType<TableProRequest<any>>,
      default: undefined,
    },
    pagination: {
      type: [Boolean, Object] as PropType<boolean | TableProPagination>,
      default: true,
    },
    mergeFields: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    rowKey: {
      type: [String, Function] as PropType<
        string | ((row: any) => string | number)
      >,
      required: true,
    },
  },
  emits: {
    loaded: (_result: TableProRequestResult<any>) => true,
    error: (_error: unknown) => true,
  },
  setup(props, { attrs, emit, expose }) {
    const slots = useSlots()
    const tableRef = shallowRef<TableProTableInstance | null>(null)
    const remoteData = shallowRef<any[]>([])
    const remoteTotal = shallowRef(0)

    const pagination = useTablePagination(() => props.pagination)

    const rowKeyValue = computed(() => {
      const key = props.rowKey
      if (typeof key === 'function') {
        return (row: any) => String(key(row))
      }
      return key
    })

    const { loading: requestLoading, load, cancel } = useTableRequest<any>({
      request: () => props.request,
      page: () => pagination.requestPage.value,
      pageSize: () => pagination.requestPageSize.value,
      onData: (result) => {
        remoteData.value = result.data
        remoteTotal.value = result.total
      },
      onLoaded: (result) => emit('loaded', result),
      onError: (error) => emit('error', error),
    })

    const isLoading = computed(() => requestLoading.value)

    const displayData = computed(() => {
      if (props.request) return remoteData.value
      if (!props.data) return []
      if (!pagination.config.value) return props.data

      const start =
        (pagination.currentPage.value - 1) *
        pagination.pageSize.value

      return props.data.slice(
        start,
        start + pagination.pageSize.value,
      )
    })

    const total = computed(() =>
      props.request
        ? remoteTotal.value
        : (props.data?.length ?? 0),
    )

    const { spanMethod } = useTableMerge({
      tableRef,
      columns: () => props.columns,
      data: displayData,
      mergeFields: () => props.mergeFields,
      userSpanMethod: () => attrs.spanMethod as TableProTableProps['spanMethod'],
      treeProps: () => attrs.treeProps as TableProTableProps['treeProps'],
      lazy: () => Boolean(attrs.lazy),
    })

    async function reload(options?: { page?: number }) {
      if (options?.page !== undefined) {
        pagination.currentPage.value = options.page
      }
      await load()
    }

    watch(
      () => props.request,
      (request) => {
        remoteData.value = []
        remoteTotal.value = 0

        if (request) {
          void reload()
        }
        else {
          cancel()
        }
      },
    )

    watch(
      () => [
        pagination.requestPage.value,
        pagination.requestPageSize.value,
      ] as const,
      () => {
        if (props.request) {
          void reload()
        }
      },
    )

    const exposed = new Proxy(
      {},
      {
        get(_target, key) {
          if (key === 'reload') return reload

          const table = tableRef.value
          if (!table) return undefined

          const value = table[key as keyof TableProTableInstance]

          return typeof value === 'function'
            ? value.bind(table)
            : value
        },
        has(_target, key) {
          if (key === 'reload') return true
          return tableRef.value != null && key in tableRef.value
        },
      },
    ) as TableProInstance

    expose(exposed)

    onMounted(() => {
      if (props.request) {
        void reload()
      }
    })

    return () => {
      const tableVNode = h(
        ElTable,
        {
          ...attrs,
          ref: tableRef,
          data: displayData.value,
          rowKey: rowKeyValue.value,
          spanMethod: spanMethod.value as any,
        },
        {
          default: () => renderTableColumns(props.columns, slots),
          empty: slots.empty,
          append: slots.append,
        },
      )

      return h(
        'div',
        { class: 'el-table-pro' },
        [
          withDirectives(tableVNode, [
            [vLoading, isLoading.value],
          ]),
          pagination.enabled.value
          ? h(ElPagination, {
              currentPage: pagination.currentPage.value,
              pageSize: pagination.pageSize.value,
              total: total.value,
              pageSizes: [
                ...(pagination.config.value?.pageSizes ?? []),
              ],
              layout: pagination.config.value?.layout,
              background: pagination.config.value?.background,
              'onUpdate:currentPage': (page: number) => {
                pagination.currentPage.value = page
              },
              'onUpdate:pageSize': (size: number) => {
                pagination.setPageSize(size)
              },
            })
            : null,
        ],
      )
    }
  },
})
</script>