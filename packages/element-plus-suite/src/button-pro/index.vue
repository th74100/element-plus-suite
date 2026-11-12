<script lang="tsx">
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  shallowRef,
  type PropType,
} from 'vue'
import {
  ElButton,
  buttonProps,
  useFormSize,
  type ButtonInstance,
} from 'element-plus'
import { exposeFrom, normalizeGradient } from './utils'
import type {
  ButtonProGradientValue,
  ButtonProIconPlacement,
  ButtonProProps,
} from './types'

export default defineComponent({
  name: 'ElButtonPro',
  inheritAttrs: false,
  props: {
    ...buttonProps,
    block: {
      type: Boolean,
      default: false,
    },
    iconPlacement: {
      type: String as PropType<ButtonProIconPlacement>,
      default: 'start',
    },
    gradient: {
      type: [String, Object] as PropType<ButtonProGradientValue>,
      default: undefined,
    },
    hoverGradient: {
      type: [String, Object] as PropType<ButtonProGradientValue>,
      default: undefined,
    },
  },
  setup(props, { attrs, expose, slots }) {
    const buttonRef = shallowRef<ButtonInstance>()
    const loading = shallowRef(false)
    const buttonSize = useFormSize()

    const forwardedAttrs = computed(() => {
      const { onClick: _onClick, ...rest } = attrs
      return rest
    })

    /** 渐变只作用于实心按钮，避免覆盖其他按钮形态的交互背景。 */
    const gradientValue = computed(() => {
      const { gradient, plain, dashed, text, link, type } = props
      if (!gradient || plain || dashed || text || link || type === 'text') return ''
      return normalizeGradient(gradient)
    })

    const hoverGradientValue = computed(() => (
      gradientValue.value && props.hoverGradient
        ? normalizeGradient(props.hoverGradient)
        : ''
    ))

    const buttonStyle = computed<Record<string, string> | undefined>(() => {
      if (!gradientValue.value)
        return undefined

      return {
        '--eps-button-pro-gradient': gradientValue.value,
        ...(hoverGradientValue.value && {
          '--eps-button-pro-hover-gradient': hoverGradientValue.value,
        }),
      }
    })

    const buttonPropsValue = computed(() => {
      const {
        block: _block,
        iconPlacement: _iconPlacement,
        gradient: _gradient,
        hoverGradient: _hoverGradient,
        ...elementProps
      } = props as ButtonProProps

      return elementProps
    })

    /** 点击返回 Promise 时自动维护 loading。 */
    async function handleClick(event: MouseEvent) {
      const onClick = attrs?.onClick
      if (typeof onClick !== 'function') return

      try {
        loading.value = true
        await onClick(event)
      }
      finally {
        loading.value = false
      }
    }

    expose(exposeFrom(() => buttonRef.value))

    return () => h(
      ElButton,
      mergeProps(
        buttonPropsValue.value,
        forwardedAttrs.value,
        {
          ref: buttonRef,
          loading: props.loading || loading.value,
          class: [
            'eps-button-pro',
            `eps-button-pro--${buttonSize.value || 'default'}`,
            {
              'is-block': props.block,
              'is-gradient': Boolean(gradientValue.value),
              'has-icon-end': props.iconPlacement === 'end',
              'has-hover-gradient': Boolean(hoverGradientValue.value),
            },
          ],
          style: buttonStyle.value,
          onClick: handleClick,
        },
      ),
      slots,
    )
  },
})
</script>
