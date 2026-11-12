import type { ButtonProps, FormInstance, FormProps, InputProps } from 'element-plus'
import type { Component, VNode, VNodeChild } from 'vue'

export type FormProValue = Record<string, any>

export interface FormProColProps {
  span?: number
  offset?: number
  xs?: number | { span?: number; offset?: number }
  sm?: number | { span?: number; offset?: number }
  md?: number | { span?: number; offset?: number }
  lg?: number | { span?: number; offset?: number }
  xl?: number | { span?: number; offset?: number }
  [key: string]: any
}

export type FormProCol = number | FormProColProps

export type FormProFieldType =
  | 'input'
  | 'password'
  | 'number'
  | 'select'
  | 'selectV2'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'timeSelect'
  | 'autocomplete'
  | 'cascader'
  | 'inputTag'
  | 'rate'
  | 'slider'
  | 'switch'
  | 'tree'
  | 'transfer'
  | 'upload'
  | 'mention'

export interface FormProCaptchaProps extends Partial<InputProps> {
  /** 手机号字段的 key；配置后点击获取验证码会先校验该字段 */
  phoneName?: string
  /** 倒计时秒数 */
  countDown?: number
  /** 获取验证码；参数为 phoneName 对应字段的值 */
  onGetCaptcha: (phone: string) => Promise<void>
  /** 倒计时变化回调 */
  onTiming?: (seconds: number) => void
  /** 自定义获取验证码按钮文案 */
  captchaTextRender?: (timing: boolean, seconds: number) => string
  /** 获取验证码按钮属性 */
  captchaProps?: ButtonProps
}

export interface FormProOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
  [key: string]: any
}

export interface FormProSchemaItem {
  /** 组合字段容器可以省略 key，由 children 保存实际字段值。 */
  key?: string
  label?: string | (() => VNodeChild)
  type?: FormProFieldType | Component | VNode | string
  col?: FormProCol
  labelWidth?: string | number
  rules?: any
  hidden?: boolean
  defaultValue?: any
  style?: Record<string, any>
  /** 透传给 ElFormItem 的属性 */
  formItemProps?: Record<string, any>
  /** 透传给字段组件的属性，包括控件内部插槽 fieldProps.slots */
  fieldProps?: Record<string, any>
  /** 替换整个字段控件的插槽名，默认使用 key */
  slot?: string
  /** 同一表单项内的子字段，用于日期与时间等组合控件 */
  children?: FormProSchemaItem[]
  /** 子字段之间的分隔符，默认空字符串 */
  separator?: string
  [key: string]: any
}

export interface FormProButtonOptions {
  text?: string
  type?: string
  plain?: boolean
  disabled?: boolean
  loading?: boolean
  /** 按钮独占一行 */
  block?: boolean
  [key: string]: any
}

export type FormProButtonConfig = false | FormProButtonOptions

export interface FormProButtons {
  submit?: FormProButtonConfig
  reset?: FormProButtonConfig
  cancel?: FormProButtonConfig
}

export interface FormProOwnConfig {
  /** 按钮区域水平对齐方式，默认 `right` */
  buttonAlign?: 'start' | 'center' | 'right'
  /** 提交、重置、取消按钮配置 */
  buttons?: FormProButtons
  /** 透传给 ElRow 的属性 */
  row?: Record<string, any>
  /** 所有字段默认的 ElCol 配置，数字表示 span，可被单个 schema 项的 col 覆盖 */
  col?: FormProCol
  /** 操作按钮所在列的 ElCol 配置，数字表示 span */
  actionCol?: FormProCol
  /** 响应式标签位置，扩展了 ElForm 的 labelPosition */
  labelPosition?: FormProps['labelPosition'] | {
    base?: FormProps['labelPosition']
    xs?: FormProps['labelPosition']
    sm?: FormProps['labelPosition']
    md?: FormProps['labelPosition']
    lg?: FormProps['labelPosition']
    xl?: FormProps['labelPosition']
  }
  /** 标签宽度，支持 ElForm 默认值以及各表单项继承 */
  labelWidth?: FormProps['labelWidth']
}

/** ElFormPro 配置：FormPro 自有配置和透传给 ElForm 的属性。 */
export type FormProConfig = FormProOwnConfig & Omit<FormProps, 'labelPosition' | 'labelWidth'> & {
  /** 渲染在表单根节点上的 class */
  class?: any
}

/** 仅供 ElFormPro 内部和 TablePro 使用的扩展配置。 */
export type FormProInternalConfig = FormProConfig & {
  showCollapseButton?: boolean
  collapseRows?: number
  collapseCount?: number
  collapsed?: boolean
}
export interface FormProProps {
  schema?: FormProSchemaItem[]
  modelValue?: FormProValue
  formConfig?: FormProConfig
  [key: string]: any
}

export interface FormProInstance {
  validate: FormInstance['validate']
  validateField: FormInstance['validateField']
  resetFields: FormInstance['resetFields']
  clearValidate: FormInstance['clearValidate']
  scrollToError: () => Promise<void>
  setState: (options: FormProConfig) => void
  getValues: () => FormProValue
}
