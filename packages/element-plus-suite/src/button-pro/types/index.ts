import type { ButtonInstance, ButtonProps } from 'element-plus'
import type { Component } from 'vue'

export interface ButtonProGradient {
  /** 渐变起始颜色 */
  from: string
  /** 渐变结束颜色 */
  to: string
  /** 渐变角度，默认 135 */
  angle?: number
}

export type ButtonProGradientValue = string | ButtonProGradient

/** 图标在文字前或文字后 */
export type ButtonProIconPlacement = 'start' | 'end'

export interface ButtonProOwnProps {
  /** 按钮是否独占一行 */
  block?: boolean
  /** 图标位置，默认 start */
  iconPlacement?: ButtonProIconPlacement
  /** 渐变背景，支持 CSS 渐变字符串或起止颜色对象 */
  gradient?: ButtonProGradientValue
  /** 鼠标经过时的渐变背景，支持 CSS 渐变字符串或起止颜色对象 */
  hoverGradient?: ButtonProGradientValue
}

export type ButtonProProps = Omit<ButtonProps, 'tag'> & ButtonProOwnProps & {
  /** 自定义渲染标签 */
  tag?: string | Component
}

export type ButtonProInstance = ButtonInstance
