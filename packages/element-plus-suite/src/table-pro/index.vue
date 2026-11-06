<script lang="tsx">
import {
  computed,
  defineComponent,
  h,
  onMounted,
  shallowRef,
  useSlots,
  reactive,
  watch,
  withDirectives,
  type PropType,
} from 'vue'
import {
  ElPagination,
  ElTable,
  vLoading,

} from 'element-plus'
import { ElFormPro } from '../form-pro'
import { getSchemaDefaults } from '../form-pro/utils'
import { renderTableColumns } from './render-columns'
import { useTableMerge } from './composables/use-table-merge'
import { useTablePagination } from './composables/use-table-pagination'
import { useTableRequest } from './composables/use-table-request'
import type {
  TableProColumn,
  TableProInstance,
  TableProFilterConfig,
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
    query: {
      type: Object as PropType<Record<string, any>>,
      default: undefined,
    },
    filter: {
      type: Object as PropType<TableProFilterConfig>,
      default: undefined,
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
    const filterDefaults = computed(() => ({
      ...getSchemaDefaults(props.filter?.schema ?? []),
      ...(props.filter?.defaultValue ?? {}),
      ...(props.filter?.model ?? {}),
    }))
    const filterModel = reactive<Record<string, any>>({ ...filterDefaults.value })
    const appliedQuery = shallowRef<Record<string, any>>({
      ...filterDefaults.value,
      ...(props.query ?? {}),
    })

    watch(
      () => props.query,
      (query) => {
        appliedQuery.value = {
          ...filterDefaults.value,
          ...(query ?? {}),
        }
        if (props.request) {
          void load()
        }
      },
      { deep: true },
    )

    watch(
      () => props.filter?.model,
      (value) => {
        for (const key of Object.keys(filterModel)) delete filterModel[key]
        Object.assign(filterModel, filterDefaults.value, value ?? {})
      },
      { deep: true },
    )

    const pagination = useTablePagination(() => props.pagination)
    let skipNextPaginationRequest = false

    /** 修改页码；如果分页 watcher 会触发请求，则让下一次 watcher 跳过重复请求。 */
    function setPage(page: number) {
      if (page === pagination.currentPage.value) return
      if (pagination.enabled.value) skipNextPaginationRequest = true
      pagination.currentPage.value = page
    }

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
      query: () => appliedQuery.value,
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
        setPage(options.page)
      }
      await load()
    }

    async function search() {
      appliedQuery.value = { ...filterModel }
      setPage(1)
      await load()
    }

    async function resetFilter() {
      const defaults = { ...filterDefaults.value }
      for (const key of Object.keys(filterModel)) {
        delete filterModel[key]
      }
      Object.assign(filterModel, defaults)
      appliedQuery.value = { ...defaults }
      setPage(1)
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
        if (skipNextPaginationRequest) {
          skipNextPaginationRequest = false
          return
        }
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
          if (key === 'search') return search
          if (key === 'resetFilter') return resetFilter

          const table = tableRef.value
          if (!table) return undefined

          const value = table[key as keyof TableProTableInstance]

          return typeof value === 'function'
            ? value.bind(table)
            : value
        },
        has(_target, key) {
          if (key === 'reload' || key === 'search' || key === 'resetFilter') return true
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

    const getFilterSlots = () => {
      return Object.fromEntries(
        Object.entries(slots)
          .filter(([name]) => name.startsWith('filter-'))
          .map(([name, slot]) => [name.slice(7), slot]),
      )
    }

    return () => {
      const filterVNode = props.filter
        ? h(ElFormPro, {
            schema: props.filter.schema,
            modelValue: filterModel,
            collapsible: true,
            searchMode: true,
            formConfig: {
              // 筛选表单开启折叠按钮时，默认按一行折叠。
              ...(props.filter.formConfig?.showCollapseButton
                ? { collapseRows: 1 }
                : {}),
              ...(props.filter.formConfig ?? {}),
            },
            'onUpdate:modelValue': (value: Record<string, any>) => {
              for (const key of Object.keys(filterModel)) delete filterModel[key]
              Object.assign(filterModel, value)
            },
            onSubmit: () => void search(),
            onReset: () => void resetFilter(),
          }, getFilterSlots())
        : null

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
          filterVNode,
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
              pagerCount: pagination.config.value?.pagerCount,
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
