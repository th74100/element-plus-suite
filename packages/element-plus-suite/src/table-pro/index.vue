<script lang="tsx">
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useSlots,
  reactive,
  watch,
  withDirectives,
  type PropType,
  type VNodeChild,
} from 'vue'
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElPagination,
  ElTable,
  ElTooltip,
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
  TableProToolbarOptions,
} from './types/index'

const TABLE_PRO_ICONS = {
  refresh: {
    viewBox: '64 64 896 896',
    paths: [
      'M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 00-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 01655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 01279 755.2a342.16 342.16 0 01-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 01109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z',
    ],
    stroke: false,
  },
  density: {
    viewBox: '64 64 896 896',
    paths: [
      'M840 836H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zm0-724H184c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h656c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM610.8 378c6 0 9.4-7 5.7-11.7L515.7 238.7a7.14 7.14 0 00-11.3 0L403.6 366.3a7.23 7.23 0 005.7 11.7H476v268h-62.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V378h62.8z',
    ],
    stroke: false,
  },
  fullscreen: {
    paths: [
      'M8 3H3v5',
      'M16 3h5v5',
      'M8 21H3v-5',
      'M16 21h5v-5',
    ],
    stroke: true,
  },
  fullscreenExit: {
    paths: [
      'M3 8h5V3',
      'M21 8h-5V3',
      'M3 16h5v5',
      'M21 16h-5v5',
    ],
    stroke: true,
  },
} as const

type TableProSize = '' | 'large' | 'default' | 'small'

const TABLE_PRO_DENSITY_OPTIONS: Array<{
  value: Exclude<TableProSize, ''>
  label: string
}> = [
  { value: 'large', label: '宽松' },
  { value: 'default', label: '中等' },
  { value: 'small', label: '紧凑' },
]

function renderTableProIcon(name: keyof typeof TABLE_PRO_ICONS) {
  const icon = TABLE_PRO_ICONS[name]
  return h(
    'svg',
    {
      viewBox: 'viewBox' in icon ? icon.viewBox : '0 0 24 24',
      width: '1em',
      height: '1em',
      fill: icon.stroke ? 'none' : 'currentColor',
      stroke: icon.stroke ? 'currentColor' : undefined,
      'stroke-width': icon.stroke ? 2 : undefined,
      'stroke-linecap': icon.stroke ? 'round' : undefined,
      'stroke-linejoin': icon.stroke ? 'round' : undefined,
      focusable: 'false',
      'aria-hidden': 'true',
    },
    icon.paths.map(path => h('path', { d: path })),
  )
}

function isTableProSize(value: unknown): value is TableProSize {
  return value === '' || value === 'large' || value === 'default' || value === 'small'
}

export default defineComponent({
  name: 'ElTablePro',
  inheritAttrs: false,
  props: {
    columns: {
      type: Array as PropType<TableProColumn<any>[]>,
      default: () => [],
    },
    headerTitle: {
      type: [String, Function] as PropType<string | (() => VNodeChild)>,
      default: undefined,
    },
    options: {
      type: [Boolean, Object] as PropType<false | TableProToolbarOptions>,
      default: undefined,
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
    const containerRef = shallowRef<HTMLElement | null>(null)
    const selectedRows = shallowRef<any[]>([])
    const isFullscreen = shallowRef(false)
    const toolbarOptions = computed<TableProToolbarOptions>(() =>
      props.options === false || props.options == null ? {} : props.options,
    )
    const tableSize = shallowRef<TableProSize>(
      isTableProSize(attrs.size) ? attrs.size : '',
    )
    const currentDensity = computed<Exclude<TableProSize, ''>>(() =>
      tableSize.value || 'default',
    )

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

    const selectedRowKeys = computed(() => selectedRows.value.map((row) => {
      const key = props.rowKey
      return typeof key === 'function' ? key(row) : row[key]
    }))

    function invokeEventHandler(handler: unknown, ...args: any[]) {
      if (Array.isArray(handler)) {
        handler.forEach(item => invokeEventHandler(item, ...args))
      }
      else if (typeof handler === 'function') {
        handler(...args)
      }
    }

    function handleSelectionChange(rows: any[]) {
      selectedRows.value = rows
      invokeEventHandler(attrs.onSelectionChange, rows)
    }

    function setTableSize(size: TableProSize) {
      tableSize.value = size
      void nextTick(() => tableRef.value?.doLayout?.())
    }

    watch(
      () => attrs.size,
      (size) => {
        tableSize.value = isTableProSize(size) ? size : ''
      },
    )

    let previousBodyOverflow = ''

    function handleFullscreenKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') setFullscreen(false)
    }

    function setFullscreen(next: boolean) {
      if (isFullscreen.value === next) return
      isFullscreen.value = next

      if (typeof document !== 'undefined') {
        if (next) {
          previousBodyOverflow = document.body.style.overflow
          document.body.style.overflow = 'hidden'
          document.addEventListener('keydown', handleFullscreenKeydown)
        }
        else {
          document.body.style.overflow = previousBodyOverflow
          document.removeEventListener('keydown', handleFullscreenKeydown)
        }
      }

      void nextTick(() => {
        const relayout = () => tableRef.value?.doLayout?.()
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(relayout)
        }
        else {
          relayout()
        }
      })
    }

    onBeforeUnmount(() => setFullscreen(false))

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

    const total = computed(() => props.request ? remoteTotal.value : (props.data?.length ?? 0))

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

    /** 自有方法优先，其余能力按 ElTable 实例实时转发。 */
    const ownInstance = { reload, search, resetFilter }
    const exposed = new Proxy(ownInstance, {
      get(target, key) {
        if (key in target) return target[key as keyof typeof target]

        const table = tableRef.value
        const value = table?.[key as keyof TableProTableInstance]
        return typeof value === 'function' ? value.bind(table) : value
      },
      has(target, key) {
        return key in target || (tableRef.value != null && key in tableRef.value)
      },
    }) as TableProInstance

    expose(exposed)

    onMounted(() => {
      if (props.request) {
        void reload()
      }
    })

    /** filter-* 插槽转发给内部筛选表单，并去掉前缀。 */
    const getFilterSlots = () => Object.fromEntries(
      Object.entries(slots)
        .filter(([name]) => name.startsWith('filter-'))
        .map(([name, slot]) => [name.slice(7), slot]),
    )

    // 渲染工具栏按钮图标
    function renderToolbarIcon(
      label: string,
      icon: keyof typeof TABLE_PRO_ICONS,
      onClick?: () => void,
    ) {
      return h(
        ElButton,
        {
          text: true,
          circle: true,
          class: 'eps-table-pro__toolbar-button',
          'aria-label': label,
          onClick,
        },
        () => h(ElIcon, { size: 16 }, { default: () => renderTableProIcon(icon) }),
      )
    }

    // 渲染工具栏按钮（带 tooltip）
    function renderToolbarButton(
      label: string,
      icon: keyof typeof TABLE_PRO_ICONS,
      onClick: () => void,
    ) {
      return h(
        ElTooltip,
        { content: label, placement: 'top' },
        { default: () => renderToolbarIcon(label, icon, onClick) },
      )
    }

    // 渲染密度下拉菜单
    function renderDensityDropdown() {
      return h(
        ElTooltip,
        { content: '密度', placement: 'top' },
        {
          default: () => h(
            ElDropdown,
            {
              trigger: 'click',
              onCommand: (size: TableProSize) => setTableSize(size),
            },
            {
              default: () => renderToolbarIcon('密度', 'density'),
              dropdown: () => h(
                ElDropdownMenu,
                null,
                {
                  default: () => TABLE_PRO_DENSITY_OPTIONS.map(option => h(
                    ElDropdownItem,
                    {
                      command: option.value,
                      class: [
                        'eps-table-pro__density-item',
                        { 'is-active': currentDensity.value === option.value },
                      ],
                    },
                    {
                      default: () => h('span', option.label),
                    },
                  )),
                },
              ),
            },
          ),
        },
      )
    }

    // 渲染表头标题
    function renderHeaderTitle() {
      const slot = slots.headerTitle
      if (slot) return slot()

      const title = props.headerTitle
      if (typeof title === 'function') return title()
      return title != null
        ? h('span', { class: 'eps-table-pro__header-title-text' }, title)
        : null
    }

    // 渲染标题栏
    function renderHeader() {
      const options = toolbarOptions.value
      const hasTitle = Boolean(slots.headerTitle || props.headerTitle != null)
      const hasCustomToolbar = Boolean(slots.toolbar)
      const hasOptions = Boolean(options.reload || options.density || options.fullscreen)
      if (!hasTitle && !hasCustomToolbar && !hasOptions) return null

      const actions = hasCustomToolbar
        ? h(
            'div',
            { class: 'eps-table-pro__toolbar-actions' },
            slots.toolbar?.({
              selectedRows: selectedRows.value,
              selectedRowKeys: selectedRowKeys.value,
            }),
          )
        : null

      const optionNodes: VNodeChild[] = []
      if (options.reload) {
        optionNodes.push(renderToolbarButton('刷新', 'refresh', () => void reload()))
      }
      if (options.density) optionNodes.push(renderDensityDropdown())
      if (options.fullscreen) {
        optionNodes.push(renderToolbarButton(
          isFullscreen.value ? '退出全屏' : '全屏',
          isFullscreen.value ? 'fullscreenExit' : 'fullscreen',
          () => setFullscreen(!isFullscreen.value),
        ))
      }

      const settings = optionNodes.length
        ? h('div', { class: 'eps-table-pro__toolbar-options' }, optionNodes)
        : null

      return h(
        'div',
        { class: 'eps-table-pro__header' },
        [
          hasTitle
            ? h('div', { class: 'eps-table-pro__header-title' }, [renderHeaderTitle()])
            : null,
          h(
            'div',
            { class: 'eps-table-pro__toolbar' },
            [actions, settings],
          ),
        ],
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

      const headerVNode = renderHeader()

      const tableVNode = h(
        ElTable,
        {
          ...attrs,
          ref: tableRef,
          class: ['eps-table-pro__table', attrs.class],
          data: displayData.value,
          rowKey: rowKeyValue.value,
          size: tableSize.value,
          spanMethod: spanMethod.value as any,
          onSelectionChange: handleSelectionChange,
        },
        {
          default: () => renderTableColumns(props.columns, slots),
          empty: slots.empty,
          append: slots.append,
        },
      )

      return h(
        'div',
        {
          ref: containerRef,
          class: [
            'eps-table-pro',
            { 'is-fullscreen': isFullscreen.value },
          ],
        },
        [
          filterVNode,
          headerVNode,
          withDirectives(tableVNode, [
            [vLoading, requestLoading.value],
          ]),
          pagination.enabled.value
          ? h(ElPagination, {
              class: 'eps-table-pro__pagination',
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
