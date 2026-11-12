import {
  computed,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  type PropType,
  type VNodeChild,
} from 'vue'
import { ElButton, ElInput } from 'element-plus'
import type { FormProCaptchaProps } from './types'

export default defineComponent({
  name: 'FormProCaptchaField',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    phoneName: {
      type: String,
      default: undefined,
    },
    countDown: {
      type: Number,
      default: 60,
    },
    onGetCaptcha: {
      type: Function as PropType<FormProCaptchaProps['onGetCaptcha']>,
      required: true,
    },
    onTiming: {
      type: Function as PropType<FormProCaptchaProps['onTiming']>,
      default: undefined,
    },
    captchaTextRender: {
      type: Function as PropType<FormProCaptchaProps['captchaTextRender']>,
      default: undefined,
    },
    captchaProps: {
      type: Object as PropType<FormProCaptchaProps['captchaProps']>,
      default: () => ({}),
    },
    getPhone: {
      type: Function as PropType<() => Promise<string>>,
      required: true,
    },
  },
  setup(props, { attrs, emit }) {
    const loading = shallowRef(false)
    const timing = shallowRef(false)
    const seconds = shallowRef(props.countDown)
    let timer: ReturnType<typeof setInterval> | undefined

    const buttonText = computed(() => {
      if (props.captchaTextRender) {
        return props.captchaTextRender(timing.value, seconds.value)
      }
      return timing.value ? `${seconds.value} 秒后重新获取` : '获取验证码'
    })

    function stopTiming(reset = true) {
      if (timer) clearInterval(timer)
      timer = undefined
      timing.value = false
      if (reset) seconds.value = props.countDown
    }

    function startTiming() {
      stopTiming(false)
      seconds.value = props.countDown
      timing.value = true
      props.onTiming?.(seconds.value)

      timer = setInterval(() => {
        if (seconds.value <= 1) {
          stopTiming()
          return
        }
        seconds.value -= 1
        props.onTiming?.(seconds.value)
      }, 1000)
    }

    async function handleGetCaptcha() {
      if (loading.value || timing.value) return

      loading.value = true
      try {
        const phone = await props.getPhone()
        await props.onGetCaptcha(phone)
        startTiming()
      }
      catch {
        // 手机号校验或发送失败时保持按钮可用，错误由表单或调用方提示。
      }
      finally {
        loading.value = false
        await nextTick()
      }
    }

    onBeforeUnmount(() => stopTiming(false))

    const renderInput = (): VNodeChild => h(ElInput, {
      ...attrs,
      class: ['eps-form-pro__captcha-input', attrs.class],
      modelValue: props.modelValue,
      'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
    })

    const renderButton = (): VNodeChild => h(
      ElButton,
      {
        ...props.captchaProps,
        class: ['eps-form-pro__captcha-button', (props.captchaProps as Record<string, any> | undefined)?.class],
        loading: loading.value,
        disabled: timing.value || props.captchaProps?.disabled,
        onClick: handleGetCaptcha,
      },
      () => buttonText.value,
    )

    return () => h(
      'div',
      { class: 'eps-form-pro__captcha' },
      [renderInput(), renderButton()],
    )
  },
})
