import {
  ElAutocomplete,
  ElButton,
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElInputTag,
  ElMention,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTreeSelect,
  ElUpload,
} from 'element-plus'
import { h } from 'vue'
import type { FormProCol, FormProColProps, FormProOption, FormProSchemaItem } from './types'

type OptionData = FormProOption[] | (() => FormProOption[])

function normalizeOptions(options?: OptionData) {
  if (typeof options === 'function') return options()
  return options ?? []
}

function createOptionComponent(
  component: any,
  optionComponent: any,
) {
  return (props: Record<string, any>, { slots: fieldSlots = {} }: any) => {
    const {
      options,
      props: optionProps = {},
      slots: optionSlots = {},
      ...componentProps
    } = props
    const labelKey = optionProps.label ?? 'label'
    const valueKey = optionProps.value ?? 'value'
    const disabledKey = optionProps.disabled ?? 'disabled'

    return h(
      component,
      componentProps,
      {
        // 保留 ElSelect / ElRadioGroup / ElCheckboxGroup 自身的具名插槽。
        ...fieldSlots,
        // 自动生成选项；显式传入 default 插槽时交由调用方接管。
        default: fieldSlots.default ?? (() =>
          normalizeOptions(options).map((item: FormProOption) =>
            h(
              optionComponent,
              {
                label: item[labelKey],
                value: item[valueKey],
                disabled: item[disabledKey],
              },
              typeof item.slots === 'function'
                ? item.slots
                : optionSlots[item.slots as string],
            ),
          )),
      },
    )
  }
}

/** 密码框仍然使用 ElInput，仅固定原生 type 为 password。 */
function PasswordInput(props: Record<string, any>, { slots }: any) {
  return h(ElInput, { ...props, type: 'password' }, slots)
}

/** Upload 使用 file-list 双向绑定，需要适配 FormPro 的 modelValue。 */
function UploadField(props: Record<string, any>, { slots }: any) {
  const { modelValue, 'onUpdate:modelValue': onUpdateModelValue, ...rest } = props
  return h(
    ElUpload,
    {
      ...rest,
      fileList: modelValue,
      'onUpdate:fileList': onUpdateModelValue,
    },
    {
      ...slots,
      // ElUpload 不会自动生成触发按钮，未自定义内容时提供默认按钮。
      default: slots.default ?? (() => h(ElButton, { type: 'primary', plain: true }, () => '选择文件')),
    },
  )
}

export const formProComponentMap: Record<string, any> = {
  input: ElInput,
  password: PasswordInput,
  number: ElInputNumber,
  select: createOptionComponent(ElSelect, ElOption),
  selectV2: ElSelectV2,
  radio: createOptionComponent(ElRadioGroup, ElRadio),
  checkbox: createOptionComponent(ElCheckboxGroup, ElCheckbox),
  date: ElDatePicker,
  time: ElTimePicker,
  timeSelect: ElTimeSelect,
  autocomplete: ElAutocomplete,
  cascader: ElCascader,
  inputTag: ElInputTag,
  rate: ElRate,
  slider: ElSlider,
  switch: ElSwitch,
  tree: ElTreeSelect,
  transfer: ElTransfer,
  upload: UploadField,
  mention: ElMention,
}

export function resolveFormProComponent(item: FormProSchemaItem) {
  if (item.type && typeof item.type !== 'string') return item.type
  return formProComponentMap[item.type || 'input'] ?? ElInput
}

export const formProRootProps = [
  'key',
  'label',
  'type',
  'style',
  'rules',
  'col',
  'hidden',
  'labelWidth',
  'slot',
  'defaultValue',
  'formItemProps',
  'fieldProps',
  'children',
  'separator',
]

export function getFormProFieldProps(
  item: FormProSchemaItem,
): Record<string, any> {
  const defaults: Record<string, any> = {}
  if (
    ['select', 'selectV2', 'cascader', 'autocomplete', 'tree'].includes(
      item.type as string,
    )
  ) {
    defaults.filterable = true
  }

  const omitted = new Set(formProRootProps)
  const passthrough = Object.fromEntries(
    Object.entries(item).filter(([key]) => !omitted.has(key)),
  )

  return {
    clearable: true,
    ...passthrough,
    ...(item.fieldProps ?? {}),
  }
}

export function normalizeColumnProps(col?: FormProCol): FormProColProps {
  return typeof col === 'number' ? { span: col } : (col ?? {})
}

export function resolveColumnProps(
  item: FormProSchemaItem,
  formConfig: { col?: FormProCol },
) {
  return {
    span: 24,
    ...normalizeColumnProps(formConfig.col),
    ...normalizeColumnProps(item.col),
  }
}
