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

    const forwardedAttrs = computed(() => {
      const { onClick: _onClick, ...rest } = attrs
      return rest
    })

    const isSolidButton = computed(() => (
      !props.plain
      && !props.dashed
      && !props.text
      && !props.link
      && props.type !== 'text'
    ))

    const gradientValue = computed(() => (
      props.gradient && isSolidButton.value
        ? normalizeGradient(props.gradient)
        : ''
    ))

    const hoverGradientValue = computed(() => (
      gradientValue.value && props.hoverGradient
        ? normalizeGradient(props.hoverGradient)
        : ''
    ))

    const buttonStyle = computed<Record<string, string> | undefined>(() => {
      if (!gradientValue.value)
        return undefined

      return {
        '--el-button-pro-gradient': gradientValue.value,
        ...(hoverGradientValue.value && {
          '--el-button-pro-hover-gradient': hoverGradientValue.value,
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

    async function handleClick(event: MouseEvent) {
      const onClick = attrs.onClick
      if (typeof onClick !== 'function')
        return

      const result = onClick(event)
      if (!result || typeof result.then !== 'function') return

      loading.value = true
      try {
        await result
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
            'el-button-pro',
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
