<script lang="tsx">
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  reactive,
  isVNode,
  shallowRef,
  useSlots,
  watch,
  type PropType,
  type VNodeChild,
} from 'vue'
import {
  ElCol,
  ElForm,
  ElFormItem,
  ElRow,
} from 'element-plus'
import { ElButtonPro } from '../button-pro'
import {
  getFormProFieldProps,
  normalizeColumnProps,
  resolveColumnProps,
  resolveFormProComponent,
} from './component-map'
import { getSchemaDefaults, hasModelValue } from './utils'
import type {
  FormProConfig,
  FormProInstance,
  FormProInternalConfig,
  FormProSchemaItem,
  FormProValue,
} from './types/index'

const FORM_PRO_BUTTON_DEFAULTS = {
  form: {
    type: 'primary',
    text: '提交',
    disabled: false,
    loading: false,
  },
  search: {
    type: 'primary',
    text: '查询',
    disabled: false,
    loading: false,
  },
  reset: {
    plain: true,
    text: '重置',
    disabled: false,
  },
  cancel: {
    plain: true,
    text: '取消',
    disabled: false,
  },
} as const

const FORM_PRO_BUTTON_VISIBILITY = {
  submit: true,
  reset: true,
  cancel: false,
} as const

function omit<T extends Record<string, any>>(
  value: T,
  keys: string[],
): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !keys.includes(key)),
  ) as Partial<T>
}

export default defineComponent({
  name: 'ElFormPro',
  props: {
    schema: {
      type: Array as PropType<FormProSchemaItem[]>,
      default: () => [],
    },
    modelValue: {
      type: Object as PropType<FormProValue>,
      default: undefined,
    },
    formConfig: {
      type: Object as PropType<FormProInternalConfig>,
      default: () => ({}),
    },

    /** 仅供 TablePro 的筛选表单开启折叠。 */
    collapsible: {
      type: Boolean,
      default: false,
    },
    /** 搜索模式将默认提交文案改为“查询”，仅由 TablePro 使用。 */
    searchMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:modelValue': (_value: FormProValue) => true,
    submit: (_value: FormProValue) => true,
    reset: (_value: FormProValue) => true,
    cancel: () => true,
    change: (_value: FormProValue) => true,
  },
  setup(props, { emit, expose, slots }) {
    const formRef = shallowRef()
    const viewportWidth = shallowRef(typeof window === 'undefined' ? 0 : window.innerWidth)
    // collapsed 默认 true：筛选表单显示折叠按钮时，默认只显示第一行。

    const isExpanded = shallowRef(
      props.collapsible &&
        !(props.formConfig?.collapsed ?? true),
    )
    const formConfig = reactive<FormProInternalConfig>({ ...props.formConfig })

    watch(
      () => props.formConfig,
      (value) => {
        Object.assign(formConfig, value)
      },
      { deep: true },
    )
    watch(
      () => props.formConfig?.collapsed,
      (value) => {
        if (!props.collapsible) return
        isExpanded.value = !(value ?? true)
      },
    )
    const internalModel = reactive<FormProValue>(
      getSchemaDefaults(props.schema),
    )

    const isControlled = computed(() => hasModelValue(props.modelValue))

    const model = computed<FormProValue>({
      get: () => (isControlled.value ? props.modelValue! : internalModel),
      set: (value) => {
        if (isControlled.value) {
          emit('update:modelValue', value)
          return
        }
        for (const key of Object.keys(internalModel)) delete internalModel[key]
        Object.assign(internalModel, value)
        emit('update:modelValue', value)
      },
    })

    /** 动态规则变化后，仅清理规则已变化字段的校验状态。 */
    watch(
      () => props.schema,
      async (schema, previousSchema) => {
        const previousRules = new Map<string, unknown>()

        const collectRules = (items: FormProSchemaItem[]) => {
          for (const item of items) {
            if (item.key != null) previousRules.set(item.key, item.rules)
            collectRules(item.children ?? [])
          }
        }

        collectRules(previousSchema ?? [])
        const changedFields: string[] = []
        const compareRules = (items: FormProSchemaItem[]) => {
          for (const item of items) {
            if (item.key != null) {
              const previousRule = JSON.stringify(previousRules.get(item.key) ?? null)
              const currentRule = JSON.stringify(item.rules ?? null)
              if (previousRule !== currentRule) changedFields.push(item.key)
              previousRules.delete(item.key)
            }
            compareRules(item.children ?? [])
          }
        }

        compareRules(schema)
        if (!changedFields.length) return
        await nextTick()
        formRef.value?.clearValidate(changedFields)
      },
      { deep: true, flush: 'post' },
    )


    watch(
      () => props.schema,
      (schema) => {
        if (isControlled.value) return
        for (const key of Object.keys(internalModel)) delete internalModel[key]
        Object.assign(internalModel, getSchemaDefaults(schema))
      },
      { deep: true },
    )

    const fields = computed(() =>
      props.schema.filter((item) => !item.hidden),
    )
    /** Element Plus 栅格和响应式 label 的断点。 */
    const GRID_BREAKPOINTS = [
      { key: 'sm', min: 768 },
      { key: 'md', min: 992 },
      { key: 'lg', min: 1200 },
      { key: 'xl', min: 1920 },
    ] as const

    const resolveLabelPosition = (
      options: Record<string, string | undefined>,
      width: number,
    ) => {
      let position = options.base || options.xs || 'top'
      if (width < 768) return options.xs || position
      for (const breakpoint of GRID_BREAKPOINTS) {
        if (width < breakpoint.min) break
        position = options[breakpoint.key] || position
      }
      return position
    }

    const responsiveLabelPosition = computed(() => {
      const configured = formConfig.labelPosition
      if (typeof configured === 'string') return configured
      return resolveLabelPosition(
        configured || { base: 'top', md: 'right' },
        viewportWidth.value,
      )
    })
    const getSpanValue = (value: any) =>
      typeof value === 'number' ? value : value?.span

    /** 按 Element Plus 的 sm/md/lg/xl 断点解析实际 span。 */
    const resolveResponsiveSpan = (
      col: Record<string, any>,
      width: number,
    ) => {
      let span = getSpanValue(col.span) ?? 24

      for (const breakpoint of GRID_BREAKPOINTS) {
        if (width < breakpoint.min) break
        const value = getSpanValue(col[breakpoint.key])
        if (value !== undefined) span = value
      }

      return Math.min(24, span)
    }

    const getItemSpan = (item: FormProSchemaItem) => {
      return resolveResponsiveSpan(
        resolveColumnProps(item, formConfig),
        viewportWidth.value,
      )
    }

    const appendSpan = (current: number, span: number) => {
      const used = current % 24
      if (used && 24 - used < span) current += 24 - used
      return current + span
    }

    const hasActionButtons = computed(
      () =>
        Boolean(slots.buttons) ||
        formConfig.buttons?.submit !== false ||
        formConfig.buttons?.reset !== false ||
        (formConfig.buttons?.cancel !== undefined &&
          formConfig.buttons.cancel !== false),
    )

    /** 计算按钮在指定字段行之后实际占用的栅格宽度。 */
    const getActionSpanAfter = (used: number) => {
      if (formConfig.actionCol !== undefined) {
        return resolveResponsiveSpan(
          normalizeColumnProps(formConfig.actionCol),
          viewportWidth.value,
        )
      }
      const remaining = used ? 24 - used : 0
      return remaining >= 4 ? remaining : 24
    }

    const getCollapsedLength = (rows: number) => {
      const capacity = rows * 24
      let current = 0
      let count = 0
      for (const item of fields.value) {
        const next = appendSpan(current, getItemSpan(item))
        if (next > capacity) break

        // 后面还要放按钮；若加入该字段会挤掉按钮，则提前收起。
        const withAction = hasActionButtons.value
          ? appendSpan(next, getActionSpanAfter(next))
          : next
        if (count > 0 && withAction > capacity) break

        current = next
        count += 1
      }
      return Math.max(1, count)
    }
    const showLength = computed(() => {
      // 折叠只属于 TablePro 的筛选表单，普通 FormPro 始终展示全部字段。
      if (!props.collapsible || !formConfig.showCollapseButton) {
        return fields.value.length
      }
      if (formConfig.collapseCount !== undefined) {
        return formConfig.collapseCount
      }
      return getCollapsedLength(formConfig.collapseRows ?? 1)
    })

    const visibleFields = computed(() =>
      isExpanded.value
        ? fields.value
        : fields.value.slice(0, showLength.value),
    )

    const lastRowUsedSpan = computed(() => {
      let current = 0
      for (const item of visibleFields.value) {
        current = appendSpan(current, getItemSpan(item))
      }
      return current % 24
    })

    const actionSpan = computed(() =>
      getActionSpanAfter(lastRowUsedSpan.value),
    )

    const actionOnFieldRow = computed(
      () =>
        lastRowUsedSpan.value > 0 &&
        lastRowUsedSpan.value + actionSpan.value <= 24,
    )

    /** top 模式下，按钮与字段同行时补一个空 label，避免内容区错位。 */
    const showActionLabel = computed(
      () =>
        responsiveLabelPosition.value === 'top' &&
        actionOnFieldRow.value,
    )
    const actionCol = computed(() => {
      if (formConfig.actionCol !== undefined) {
        return {
          span: 24,
          ...normalizeColumnProps(formConfig.actionCol),
        }
      }

      const used = lastRowUsedSpan.value
      const remaining = used ? 24 - used : 0
      return {
        span: remaining >= 4 ? remaining : 24,
      }
    })

    const buttons = computed(() => {
      const defaults = {
        submit: props.searchMode
          ? FORM_PRO_BUTTON_DEFAULTS.search
          : FORM_PRO_BUTTON_DEFAULTS.form,
        reset: FORM_PRO_BUTTON_DEFAULTS.reset,
        cancel: FORM_PRO_BUTTON_DEFAULTS.cancel,
      }
      const resolveButton = (name: keyof typeof defaults) => {
        const config = formConfig.buttons?.[name]
        if (config === false) return null
        if (config === undefined && !FORM_PRO_BUTTON_VISIBILITY[name]) return null

        return {
          ...defaults[name],
          ...(config ?? {}),
        }
      }

      return {
        submit: resolveButton('submit'),
        reset: resolveButton('reset'),
        cancel: resolveButton('cancel'),
      }
    })

    const hasButtons = computed(() =>
      Object.values(buttons.value).some(Boolean),
    )

    const actionAlignClass = computed(() => {
      const align = formConfig.buttonAlign ?? 'right'
      return align === 'start'
        ? 'is-start'
        : align === 'center' ? 'is-center' : 'is-end'
    })

    const updateField = (key: string, value: any) => {
      const next = {
        ...model.value,
        [key]: value,
      }
      model.value = next
      emit('change', next)
    }

    const toRuleList = (rules: any): any[] =>
      Array.isArray(rules) ? rules : rules ? [rules] : []
    /** 组合字段的必填状态由可见叶子字段决定。 */
    const getLeafChildren = (item: FormProSchemaItem): FormProSchemaItem[] => {
      const result: FormProSchemaItem[] = []
      const walk = (items: FormProSchemaItem[]) => {
        for (const child of items) {
          if (child.hidden) continue
          if (child.children?.length) walk(child.children)
          else result.push(child)
        }
      }
      walk(item.children ?? [])
      return result
    }

    const hasRequiredRule = (rules: any) =>
      toRuleList(rules).some(rule => rule?.required)

    /** 任一叶子字段必填时，父级只显示必填星号。 */
    const hasRequiredChild = (item: FormProSchemaItem) =>
      getLeafChildren(item).some(child => hasRequiredRule(child.rules))

    const renderActionButton = (
      options: Record<string, any> | null,
      onClick: () => void,
    ) => {
      if (!options) return null
      return h(
        ElButtonPro,
        {
          ...omit(options, ['text']),
          onClick,
        } as any,
        () => options.text,
      )
    }
    /** 验证码字段由 FormPro 先校验手机号字段，再交给 CaptchaField 发送验证码。 */
    const getCaptchaPhone = async (phoneName?: string) => {
      if (!phoneName) return ''
      if (!formRef.value) throw new Error('FormPro is not mounted')
      const phone = String(model.value[phoneName] ?? '')
      if (!phone.trim()) {
        try {
          await formRef.value.validateField(phoneName)
        }
        catch {
          // 由 ElFormItem 展示校验错误。
        }
        throw new Error('Phone is empty')
      }
      await formRef.value.validateField(phoneName)
      return phone
    }

    const renderControl = (item: FormProSchemaItem): VNodeChild => {
      // slot 替换整个控件；未显式配置时兼容用字段 key 作为插槽名。
      const directSlot = slots[item.slot ?? item.key ?? '']
      if (directSlot) return directSlot({ item, model: model.value })

      const component = resolveFormProComponent(item)
      if (isVNode(component)) return component

      // fieldProps.slots 将 ElFormPro 的插槽转发到控件内部，例如 ElInput 的 prefix。
      const { slots: fieldSlotMap, ...fieldProps } = getFormProFieldProps(item)
      if (item.type === 'captcha') {
        fieldProps.getPhone = () => getCaptchaPhone(fieldProps.phoneName)
      }
      const fieldSlots = Object.fromEntries(
        Object.entries(fieldSlotMap ?? {}).flatMap(([name, source]) => {
          const slot = typeof source === 'function'
            ? source
            : slots[String(source)]
          if (!slot) return []
          return [[
            name,
            (scope: Record<string, any> = {}) =>
              slot({ ...scope, item, model: model.value }),
          ]]
        }),
      )

      return h(component, {
        ...fieldProps,
        modelValue: item.key == null ? undefined : model.value[item.key],
        'onUpdate:modelValue': (value: any) => {
          if (item.key != null) updateField(item.key, value)
        },
      }, fieldSlots)
    }

    const renderLabel = (item: FormProSchemaItem) =>
      typeof item.label === 'function' ? item.label() : item.label

    const renderComposedField = (item: FormProSchemaItem): VNodeChild => {
      return h(
        ElFormItem,
        {
          ...(item.formItemProps ?? {}),
          label: typeof item.label === 'function' ? undefined : item.label,
          labelWidth: item.labelWidth ?? formConfig.labelWidth,
          required: item.formItemProps?.required ?? hasRequiredChild(item),
          class: ['eps-form-pro__group', item.formItemProps?.class],
          style: item.style,
        },
        {
          ...(typeof item.label === 'function'
            ? { label: () => renderLabel(item) }
            : {}),
          default: () => renderField(item),
        },
      )
    }
    const renderChildField = (item: FormProSchemaItem): VNodeChild => {
      if (item.children?.length) return renderField(item)

      return h(
        ElFormItem,
        {
          ...(item.formItemProps ?? {}),
          prop: item.key,
          rules: item.rules,
          labelWidth: item.labelWidth ?? formConfig.labelWidth,
          class: [item.formItemProps?.class, 'eps-form-pro__child'],
          style: item.style,
        },
        { default: () => renderControl(item) },
      )
    }

    const renderField = (item: FormProSchemaItem): VNodeChild => {
      if (!item.children?.length) return renderControl(item)

      return h(
        'div',
        { class: 'eps-form-pro__children' },
        item.children.filter((child) => !child.hidden).flatMap((child, index) => {
          const control = h(
            'div',
            {
              class: 'eps-form-pro__child-wrapper',
              key: child.key,
            },
            [renderChildField(child)],
          )
          if (index === 0) return [control]

          return [
            h(
              'span',
              { class: 'eps-form-pro__separator' },
              item.separator ?? '',
            ),
            control,
          ]
        }),
      )
    }

    const scrollToError = async () => {
      if (props.collapsible) isExpanded.value = true
      await nextTick()
      const el = formRef.value?.$el as HTMLElement | undefined
      el?.querySelector('.is-error')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }


    const onSubmit = async () => {
      try {
        await formRef.value?.validate()
        emit('submit', model.value)
      }
      catch {
        void scrollToError()
      }
    }

    /** 收集指定顶层字段下的叶子子字段默认值。 */
    const getChildDefaults = (selected?: any) => {
      const defaults = getSchemaDefaults(props.schema)
      const selectedKeys = selected == null
        ? null
        : new Set(Array.isArray(selected) ? selected : [selected])
      const result: FormProValue = {}

      const walk = (items: FormProSchemaItem[], inherited = false, child = false) => {
        for (const item of items) {
          const active = inherited || selectedKeys === null || selectedKeys.has(item.key)
          if (item.children?.length) {
            walk(item.children, active, true)
          }
          else if (child && active && item.key != null) {
            result[item.key] = defaults[item.key]
          }
        }
      }

      walk(props.schema)
      return result
    }

    const resetFields = (...args: any[]) => {
      formRef.value?.resetFields(...args)
      const childDefaults = getChildDefaults(args[0])
      if (Object.keys(childDefaults).length) {
        model.value = { ...model.value, ...childDefaults }
      }
      
      return { ...model.value, ...childDefaults }
    }

    const onReset = () => emit('reset', resetFields())
    const onCancel = () => emit('cancel')
    const setState = (options: FormProConfig) => Object.assign(formConfig, options)

    const getValues = () => model.value

    /** 响应式 label 和栅格都按视口宽度计算。 */
    const handleResize = () => {
      viewportWidth.value = window.innerWidth
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }
    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') window.removeEventListener('resize', handleResize)
    })

    const exposed: FormProInstance = {
      validate: (...args) => formRef.value?.validate(...args),
      validateField: (...args) => formRef.value?.validateField(...args),
      resetFields: (...args) => resetFields(...args),
      clearValidate: (...args) => formRef.value?.clearValidate(...args),
      scrollToError,
      setState,
      getValues,
    }
    expose(exposed)

    const renderFormItem = (item: FormProSchemaItem) =>
      h(
        ElFormItem,
        {
          ...(item.formItemProps ?? {}),
          label: typeof item.label === 'function' ? undefined : item.label,
          labelWidth: item.labelWidth ?? formConfig.labelWidth,
          prop: item.key,
          rules: item.rules,
          class: item.formItemProps?.class,
          style: item.style,
        },
        {
          ...(typeof item.label === 'function'
            ? { label: () => renderLabel(item) }
            : {}),
          default: () => renderControl(item),
        },
      )

    const renderFieldColumn = (item: FormProSchemaItem) =>
      h(
        ElCol,
        {
          ...resolveColumnProps(item, formConfig),
          key: item.key ?? item.children?.[0]?.key,
        },
        {
          default: () => item.children?.length
            ? renderComposedField(item)
            : renderFormItem(item),
        },
      )

    const renderCollapseButton = () => {
      const canToggle = props.collapsible &&
        formConfig.showCollapseButton &&
        fields.value.length > showLength.value
      if (!canToggle) return null

      return h(
        ElButtonPro,
        {
          type: 'primary',
          link: true,
          onClick: () => {
            isExpanded.value = !isExpanded.value
          },
        },
        () => isExpanded.value ? '收起' : '展开',
      )
    }

    const renderActionContent = () => {
      const actionButtons = slots.buttons
        ? slots.buttons()
        : [
            renderActionButton(
              buttons.value.submit,
              () => void onSubmit(),
            ),
            renderActionButton(buttons.value.reset, onReset),
            renderActionButton(buttons.value.cancel, onCancel),
          ]

      return [actionButtons, renderCollapseButton()]
    }

    const renderActions = () => {
      if (!hasButtons.value || !fields.value.length) return null

      return h(
        ElCol,
        actionCol.value,
        {
          default: () => h(
            ElFormItem,
            null,
            {
              ...(showActionLabel.value
                ? {
                    label: () =>
                      h('label', { class: 'eps-form-pro__actions-label' }),
                  }
                : {}),
              default: () => h(
                'div',
                {
                  class: [
                    'eps-form-pro__actions',
                    actionAlignClass.value,
                  ],
                },
                renderActionContent(),
              ),
            },
          ),
        },
      )
    }

    const renderFormRow = () =>
      h(
        ElRow,
        {
          gutter: 18,
          ...(formConfig.row ?? {}),
        },
        {
          default: () => [
            ...visibleFields.value.map(renderFieldColumn),
            renderActions(),
          ],
        },
      )

    return () => {
      const formProps = omit(formConfig, [
        'buttonAlign',
        'buttons',
        'row',
        'col',
        'showCollapseButton',
        'collapseRows',
        'collapseCount',
        'collapsed',
        'actionCol',
      ])

      return h(
        ElForm,
        {
          ...formProps,
          class: ['eps-form-pro', formProps.class].filter(Boolean),
          labelPosition: responsiveLabelPosition.value,
          ref: formRef,
          model: model.value,
          onSubmit: (event: Event) => {
            event.preventDefault()
            void onSubmit()
          },
        } as any,
        {
          default: () => [renderFormRow()],
        },
      )
    }
  },
})
</script>
