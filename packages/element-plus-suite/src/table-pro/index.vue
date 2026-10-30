<script lang="tsx">
import {
  computed,
  defineComponent,
  h,
  onMounted,
  shallowRef,
  useSlots,
  withDirectives,
  type PropType,
} from 'vue'
import {
  ElPagination,
  ElTable,
  vLoading,
  type TableInstance,
} from 'element-plus'
import { renderTableColumns } from './render-columns'
import { useTablePagination } from './composables/use-table-pagination'
import { useTableRequest } from './composables/use-table-request'
import type {
  TableProColumn,
  TableProInstance,
  TableProPagination,
  TableProRequest,
  TableProRequestResult,
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
      type: [Boolean, Object] as PropType<false | TableProPagination>,
      default: () => ({}),
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
    const tableRef = shallowRef<TableInstance | null>(null)
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

    const { loading: requestLoading, load } = useTableRequest<any>({
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

    async function reload(options?: { page?: number }) {
      if (options?.page !== undefined) {
        pagination.currentPage.value = options.page
      }
      await load()
    }


    const exposed = new Proxy(
      {},
      {
        get(_target, key) {
          if (key === 'reload') return reload

          const table = tableRef.value
          if (!table) return undefined

          const value = table[key as keyof TableInstance]

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
        },
        {
          default: () => renderTableColumns(props.columns, slots),
          empty: slots.empty,
          append: slots.append,
        },
      )

      return h('div', { class: 'element-plus-suite-table' }, [
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
              class: 'element-plus-suite-table__pagination',
              'onUpdate:currentPage': (page: number) => {
                pagination.currentPage.value = page
              },
              'onUpdate:pageSize': (size: number) => {
                pagination.setPageSize(size)
              },
              onCurrentChange: () => {
                void reload()
              },
              onSizeChange: (size: number) => {
                pagination.setPageSize(size)
                void reload()
              },
            })
          : null,
      ])
    }
  },
})
</script>




