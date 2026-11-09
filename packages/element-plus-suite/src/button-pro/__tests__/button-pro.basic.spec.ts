import { h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ElButtonPro } from '../../index'
import { exposeFrom, normalizeGradient } from '../utils'

describe('normalizeGradient', () => {
  it('保留字符串渐变并移除首尾空格', () => {
    expect(normalizeGradient(' linear-gradient(90deg, #6253e1, #04befe) '))
      .toBe('linear-gradient(90deg, #6253e1, #04befe)')
  })

  it('将对象转换为渐变字符串', () => {
    expect(normalizeGradient({
      from: '#6253e1',
      to: '#04befe',
    })).toBe('linear-gradient(135deg, #6253e1, #04befe)')
  })

  it('支持自定义角度', () => {
    expect(normalizeGradient({
      from: '#6253e1',
      to: '#04befe',
      angle: 90,
    })).toBe('linear-gradient(90deg, #6253e1, #04befe)')
  })
})

describe('ElButtonPro', () => {
  it('保留 ElButton 的属性和默认插槽', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        type: 'primary',
        nativeType: 'submit',
      },
      slots: {
        default: () => '提交',
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).toContain('el-button')
    expect(button.classes()).toContain('el-button--primary')
    expect(button.attributes('type')).toBe('submit')
    expect(button.text()).toBe('提交')
  })

  it('block 添加整行 class', () => {
    const wrapper = mount(ElButtonPro, {
      props: { block: true },
    })

    expect(wrapper.get('button').classes()).toContain('is-block')
  })

  it('字符串渐变写入 CSS 变量', () => {
    const gradient = 'linear-gradient(90deg, #6253e1, #04befe)'
    const wrapper = mount(ElButtonPro, {
      props: { gradient },
    })

    const button = wrapper.get('button')
    expect(button.classes()).toContain('is-gradient')
    expect(button.attributes('style')).toContain(
      `--el-button-pro-gradient: ${gradient}`,
    )
  })

  it.each([
    ['plain', { plain: true }],
    ['dashed', { dashed: true }],
    ['text', { text: true }],
    ['link', { link: true }],
    ['type="text"', { type: 'text' as const }],
  ])('非实心按钮 %s 忽略渐变', (_name, buttonProps) => {
    const wrapper = mount(ElButtonPro, {
      props: {
        ...buttonProps,
        gradient: 'linear-gradient(90deg, #6253e1, #04befe)',
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).not.toContain('is-gradient')
    expect(button.attributes('style') ?? '').not.toContain(
      '--el-button-pro-gradient',
    )
  })
  it('对象渐变写入 CSS 变量', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        gradient: {
          from: '#6253e1',
          to: '#04befe',
          angle: 90,
        },
      },
    })

    expect(wrapper.get('button').attributes('style')).toContain(
      '--el-button-pro-gradient: linear-gradient(90deg, #6253e1, #04befe)',
    )
  })

  it('hoverGradient 写入独立的 CSS 变量和 class', () => {
    const hoverGradient = 'linear-gradient(90deg, #7c3aed, #06b6d4)'
    const wrapper = mount(ElButtonPro, {
      props: {
        gradient: 'linear-gradient(90deg, #6253e1, #04befe)',
        hoverGradient,
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).toContain('has-hover-gradient')
    expect(button.attributes('style')).toContain(
      `--el-button-pro-hover-gradient: ${hoverGradient}`,
    )
  })

  it('hoverGradient 支持对象格式', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        gradient: 'linear-gradient(90deg, #6253e1, #04befe)',
        hoverGradient: {
          from: '#7c3aed',
          to: '#06b6d4',
          angle: 90,
        },
      },
    })

    expect(wrapper.get('button').attributes('style')).toContain(
      '--el-button-pro-hover-gradient: linear-gradient(90deg, #7c3aed, #06b6d4)',
    )
  })

  it('没有 gradient 时 hoverGradient 不生效', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        hoverGradient: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).not.toContain('is-gradient')
    expect(button.classes()).not.toContain('has-hover-gradient')
    expect(button.attributes('style') ?? '').not.toContain(
      '--el-button-pro-hover-gradient',
    )
  })
  it('iconPlacement 默认为 start', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        icon: { render: () => h('i', { class: 'test-icon' }) },
      },
      slots: {
        default: () => '按钮',
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).not.toContain('has-icon-end')
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('iconPlacement 为 end 时添加尾部图标 class', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        iconPlacement: 'end',
        icon: { render: () => h('i', { class: 'test-icon' }) },
      },
      slots: {
        default: () => '按钮',
      },
    })

    expect(wrapper.get('button').classes()).toContain('has-icon-end')
  })
  it('loading 时仍保留 iconPlacement 的 end class', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        loading: true,
        iconPlacement: 'end',
      },
      slots: {
        default: () => '按钮',
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).toContain('has-icon-end')
    expect(button.find('.el-icon.is-loading').exists()).toBe(true)
  })
  it('异步点击期间自动维护 loading', async () => {
    let resolveClick!: () => void
    const onClick = vi.fn(() => new Promise<void>((resolve) => {
      resolveClick = resolve
    }))
    const wrapper = mount(ElButtonPro, {
      attrs: { onClick },
      slots: {
        default: () => '提交',
      },
    })
    const button = wrapper.get('button')

    await button.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(button.classes()).toContain('is-loading')
    expect(button.find('.el-icon.is-loading').exists()).toBe(true)
    expect(button.find('.el-icon.is-loading svg').exists()).toBe(true)

    resolveClick()
    await flushPromises()

    expect(wrapper.get('button').classes()).not.toContain('is-loading')
  })

  it('点击时触发 click 事件', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ElButtonPro, {
      attrs: { onClick },
      slots: {
        default: () => '提交',
      },
    })

    await wrapper.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').classes()).not.toContain('is-loading')
  })

  it('透传自定义 class 和 style', () => {
    const wrapper = mount(ElButtonPro, {
      attrs: {
        class: 'custom-button',
        style: 'width: 160px',
      },
    })

    const button = wrapper.get('button')
    expect(button.classes()).toContain('custom-button')
    expect(button.attributes('style')).toContain('width: 160px')
  })

  it('透传具名插槽', () => {
    const wrapper = mount(ElButtonPro, {
      props: { loading: true },
      slots: {
        loading: () => h('span', { class: 'custom-loading' }, 'loading'),
      },
    })

    expect(wrapper.find('.custom-loading').exists()).toBe(true)
  })
})



describe('exposeFrom', () => {
  it('延迟读取并自动转发源实例新增能力', () => {
    interface ForwardedInstance {
      customMethod?: () => string
      disabled?: boolean
    }

    let source: ForwardedInstance | undefined
    const exposed = exposeFrom(() => source)

    expect(exposed.customMethod).toBeUndefined()
    source = {
      customMethod: () => 'available',
      disabled: true,
    }

    expect(exposed.customMethod?.()).toBe('available')
    expect(exposed.disabled).toBe(true)
    expect('customMethod' in exposed).toBe(true)
  })
})
describe('ElButtonPro instance', () => {
  it('透传 ElButton 的实例能力', () => {
    const wrapper = mount(ElButtonPro, {
      props: {
        type: 'success',
        disabled: true,
      },
    })

    expect(wrapper.vm.type).toBe('success')
    expect(wrapper.vm.disabled).toBe(true)
    expect(wrapper.vm.ref).toBe(wrapper.get('button').element)
  })
})
