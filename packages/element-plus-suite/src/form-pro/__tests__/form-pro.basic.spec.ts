import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { ElFormPro, type FormProConfig } from '../../index'

describe('ElFormPro', () => {
  it('渲染 schema 字段', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
        modelValue: { keyword: 'test' },
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.find('.el-form').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })
})
describe('ElFormPro config', () => {
  it('formConfig 控制按钮与栅格配置', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
        formConfig: {
          col: { span: 12 },
          buttonAlign: 'start',
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.find('.el-col-12').exists()).toBe(true)
    expect(wrapper.find('.el-form-pro__actions').exists()).toBe(false)
  })
})

describe('ElFormPro col shorthand', () => {
  it('col 支持数字简写，并允许 schema 项覆盖', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input', col: 8 },
          { key: 'b', label: 'B', type: 'input' },
        ],
        formConfig: {
          col: 12,
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findAll('.el-col-8')).toHaveLength(1)
    expect(wrapper.findAll('.el-col-12')).toHaveLength(1)
  })

  it('actionCol 支持数字简写', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
        formConfig: {
          actionCol: 12,
          buttons: {
            submit: {},
            reset: false,
            cancel: false,
          },
        },
      },
    })

    expect(wrapper.find('.el-col-12 .el-form-pro__actions').exists()).toBe(true)
  })
})
describe('ElFormPro default visibility', () => {
  it('未配置折叠时展示全部字段', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input' },
          { key: 'b', label: 'B', type: 'input' },
          { key: 'c', label: 'C', type: 'input' },
        ],
        modelValue: {},
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findAll('.el-form-item__content input')).toHaveLength(3)
  })
})

describe('ElFormPro standalone collapse config', () => {
  it('忽略折叠配置并展示全部字段', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input', col: { span: 8 } },
          { key: 'b', label: 'B', type: 'input', col: { span: 8 } },
          { key: 'c', label: 'C', type: 'input', col: { span: 8 } },
        ],
        modelValue: {},
        formConfig: {
          showCollapseButton: true,
          collapseRows: 1,
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findAll('.el-form-item__content input')).toHaveLength(3)
    expect(wrapper.findAll('button').some(button => button.text() === '展开')).toBe(false)
  })
})
describe('ElFormPro auto model', () => {
  it('没有传 modelValue 时使用 schema defaultValue', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'keyword', label: '关键词', type: 'input', defaultValue: '手机' },
          { key: 'category', label: '分类', type: 'input', defaultValue: 'beauty' },
        ],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    await wrapper.vm.$nextTick()
    const values = (wrapper.vm as unknown as { getValues: () => Record<string, any> }).getValues()
    expect(values).toEqual({
      keyword: '手机',
      category: 'beauty',
    })
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('手机')
  })
})
describe('ElFormPro label position', () => {
  const originalWidth = window.innerWidth

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalWidth,
    })
  })

  it('默认小屏使用 top，md 以上使用 right', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 600,
    })
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-form').classes()).toContain('el-form--label-top')

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1200,
    })
    window.dispatchEvent(new Event('resize'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-form').classes()).toContain('el-form--label-right')
  })
})
describe('ElFormPro action label', () => {
  it('未命中断点时使用基础 span', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 390,
    })
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input', col: { span: 8 } },
          { key: 'b', label: 'B', type: 'input', col: { span: 8 } },
        ],
        formConfig: {
          labelPosition: 'top',
          buttons: { submit: { text: '查询' }, reset: { text: '重置' } },
        },
      },
    })
    await wrapper.vm.$nextTick()
    const cols = wrapper.findAll('.el-col')
    expect(cols.map(col => col.classes())).toEqual([
      expect.arrayContaining(['el-col-8']),
      expect.arrayContaining(['el-col-8']),
      expect.arrayContaining(['el-col-8']),
    ])
  })
})
describe('ElFormPro narrow layout', () => {
  it('390px 下仍然展示全部字段', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 390,
    })
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input', col: { span: 8 } },
          { key: 'b', label: 'B', type: 'input', col: { span: 8 } },
          { key: 'c', label: 'C', type: 'input', col: { span: 8 } },
        ],
        formConfig: {
          collapseRows: 1,
          buttons: { submit: { text: '查询' }, reset: { text: '重置' } },
        },
      },
    })
    expect(wrapper.findAll('.el-form-item__content input')).toHaveLength(3)
  })
})
describe('ElFormPro resize', () => {
  it('窗口尺寸变化后无需刷新即可切换响应式布局', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 390,
    })
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input', col: { span: 8 } },
          { key: 'b', label: 'B', type: 'input', col: { span: 8 } },
        ],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.el-col').every(col => col.classes().includes('el-col-8'))).toBe(true)

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1200,
    })
    window.dispatchEvent(new Event('resize'))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.el-col').every(col => col.classes().includes('el-col-8'))).toBe(true)
  })
})

describe('ElFormPro buttons', () => {
  it('取消按钮需要显式开启', async () => {
    const formConfig: FormProConfig = {
      buttons: {
        cancel: { text: '取消' },
      },
    }
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
        modelValue: {},
        formConfig,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('button').map(button => button.text())).toEqual([
      '提交',
      '重置',
      '取消',
    ])
  })


  it('传 false 可以隐藏按钮', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{ key: 'keyword', label: '关键词', type: 'input' }],
        modelValue: {},
        formConfig: {
          buttons: {
            submit: false,
            reset: false,
          },
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('button')).toHaveLength(0)
  })
})


describe('ElFormPro custom buttons', () => {
  it('自定义按钮插槽不启用折叠', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input', col: { span: 8 } },
          { key: 'b', label: 'B', type: 'input', col: { span: 8 } },
          { key: 'c', label: 'C', type: 'input', col: { span: 8 } },
        ],
        modelValue: {},
        formConfig: {
          showCollapseButton: true,
        },
      },
      slots: {
        buttons: () => h('button', { class: 'custom-button' }, '自定义按钮'),
      },
    })

    expect(wrapper.find('.custom-button').text()).toBe('自定义按钮')
    expect(wrapper.findAll('button').some(button => button.text() === '展开')).toBe(false)
  })
})


describe('ElFormPro fieldProps', () => {
  it('将 fieldProps 透传给字段组件', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          {
            key: 'keyword',
            label: '关键词',
            type: 'input',
            fieldProps: {
              placeholder: '请输入关键词',
            },
          },
        ],
        modelValue: {},
        formConfig: {
          buttons: {
            submit: false,
            reset: false,
          },
        },
      },
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入关键词')
  })
})


describe('ElFormPro formItemProps', () => {
  it('将属性透传给 ElFormItem', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'username',
          label: '用户名',
          formItemProps: {
            showMessage: false,
          },
        }],
        modelValue: {},
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'ElFormItem' }).props('showMessage')).toBe(false)
  })
})

describe('ElFormPro option internal slots', () => {
  it('将 fieldProps.slots 转发给 ElSelect 内部插槽', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'city',
          label: '城市',
          type: 'select',
          fieldProps: {
            options: [
              { label: '上海', value: 'shanghai' },
              { label: '北京', value: 'beijing' },
            ],
            teleported: false,
            slots: {
              header: () => h('span', { class: 'select-header' }, '请选择城市'),
            },
          },
        }],
        modelValue: { city: '' },
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    await wrapper.find('.el-select__wrapper').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.select-header').text()).toBe('请选择城市')
  })
})

describe('ElFormPro option fieldProps', () => {
  it('使用 fieldProps.options 和字段映射渲染选项', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          {
            key: 'category',
            label: '分类',
            type: 'select',
            fieldProps: {
              options: [
                { name: '美妆', id: 'beauty' },
                { name: '食品', id: 'groceries' },
              ],
              props: {
                label: 'name',
                value: 'id',
              },
            },
          },
        ],
        modelValue: { category: '' },
        formConfig: {
          buttons: {
            submit: false,
            reset: false,
          },
        },
      },
    })

    await wrapper.vm.$nextTick()
    const options = wrapper.findAllComponents({ name: 'ElOption' })
    expect(options).toHaveLength(2)
    expect(options[0].props('label')).toBe('美妆')
    expect(options[0].props('value')).toBe('beauty')
    expect(options[1].props('label')).toBe('食品')
    expect(options[1].props('value')).toBe('groceries')
  })
})


describe('ElFormPro responsive column spans', () => {
  it('按 md 断点读取响应式 span，而不是只读取 span', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input' },
          { key: 'b', label: 'B', type: 'input' },
          { key: 'c', label: 'C', type: 'input' },
        ],
        modelValue: {},
        formConfig: {
          col: { span: 24, sm: 12, md: 8 },
          buttons: { submit: false, reset: false },
        },
      },
    })

    await wrapper.vm.$nextTick()
    const cols = wrapper.findAll('.el-col')
    expect(cols[0].classes()).toContain('el-col-md-8')
    expect(cols[0].classes()).not.toContain('el-col-md-24')
  })
})


describe('ElFormPro responsive actions', () => {
  it('字段全部展示时按钮跟随最后一行', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 })
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'a', label: 'A', type: 'input' },
          { key: 'b', label: 'B', type: 'input' },
          { key: 'c', label: 'C', type: 'input' },
          { key: 'd', label: 'D', type: 'input' },
        ],
        modelValue: {},
        formConfig: {
          col: { span: 24, sm: 12, md: 8, xl: 6 },
          showCollapseButton: true,
          collapseRows: 1,
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.el-form-item__content input')).toHaveLength(4)
    expect(wrapper.findAll('button').some(button => button.text() === '展开')).toBe(false)
  })
})


describe('ElFormPro children', () => {
  it('组合渲染子字段并使用 separator 连接', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          {
            key: 'activityTime',
            label: 'Activity time',
            separator: '-',
            children: [
              { key: 'start', type: 'input', defaultValue: '2026-01-01' },
              { key: 'end', type: 'input', defaultValue: '2026-01-02' },
            ],
          },
        ],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.find('.el-form-pro__children').exists()).toBe(true)
    expect(wrapper.findAll('.el-form-pro__child')).toHaveLength(2)
    expect(wrapper.find('.el-form-pro__separator').text()).toBe('-')
    expect((wrapper.vm as unknown as { getValues: () => Record<string, any> }).getValues()).toMatchObject({
      start: '2026-01-01',
      end: '2026-01-02',
    })
  })

  it('children 必填时父级使用 Element Plus 星号 class，但只校验配置了 rules 的子字段', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'activityTime',
          label: '活动时间',
          separator: '-',
          children: [
            {
              key: 'date1',
              type: 'input',
              rules: [{ required: true, message: '请选择活动日期' }],
            },
            {
              key: 'date2',
              type: 'input',
            },
          ],
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.el-form-pro__group.is-required.asterisk-left').exists()).toBe(true)

    const items = wrapper.findAllComponents({ name: 'ElFormItem' })
    expect(items.map(item => item.props('prop'))).toEqual(['date1', 'date2'])
    expect(items[0].props('rules')).toEqual([
      { required: true, message: '请选择活动日期' },
    ])
    expect(items[1].props('rules')).toBeUndefined()
    expect(wrapper.text()).not.toContain('activityTime is required')
    expect(wrapper.text()).not.toContain('请选择活动时间')
  })
  it('组合字段星号遵循 requireAsteriskPosition 和 hideRequiredAsterisk', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          label: '活动时间',
          children: [
            { key: 'date1', type: 'input', rules: [{ required: true }] },
          ],
        }],
        formConfig: {
          requireAsteriskPosition: 'right',
          hideRequiredAsterisk: true,
          buttons: { submit: false, reset: false },
        },
      },
    })

    const group = wrapper.find('.el-form-pro__group')
    expect(group.classes()).toContain('is-required')
    expect(group.classes()).toContain('asterisk-right')
    expect(group.classes()).toContain('is-no-asterisk')
  })

  it('组合字段容器可以省略 key', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          label: '活动时间',
          separator: '-',
          children: [
            { key: 'date1', type: 'input' },
            { key: 'date2', type: 'input' },
          ],
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.find('.el-form-pro__children').exists()).toBe(true)
    expect((wrapper.vm as any).getValues()).toEqual({
      date1: undefined,
      date2: undefined,
    })
  })
  it('没有 rules 的子字段不参与校验', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'activityTime',
          label: '活动时间',
          separator: '-',
          children: [
            {
              key: 'date1',
              type: 'input',
              defaultValue: '2026-01-01',
              rules: [{ required: true, message: '请选择活动日期' }],
            },
            {
              key: 'date2',
              type: 'input',
            },
          ],
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    const valid = await (wrapper.vm as unknown as {
      validate: () => Promise<boolean>
    }).validate()
    expect(valid).toBe(true)
  })

  it('resetFields 恢复子字段默认值', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'range',
          label: 'Range',
          children: [
            { key: 'start', defaultValue: 'A' },
            { key: 'end', defaultValue: 'B' },
          ],
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('X')
    await inputs[1].setValue('Y')

    ;(wrapper.vm as unknown as { resetFields: () => void }).resetFields()
    await wrapper.vm.$nextTick()

    const nextInputs = wrapper.findAll('input')
    expect((nextInputs[0].element as HTMLInputElement).value).toBe('A')
    expect((nextInputs[1].element as HTMLInputElement).value).toBe('B')
  })

  it('separator 默认是空字符串', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          {
            key: 'range',
            children: [
              { key: 'start', type: 'input' },
              { key: 'end', type: 'input' },
            ],
          },
        ],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.find('.el-form-pro__separator').text()).toBe('')
  })
})

describe('ElFormPro slots', () => {
  it('把 fieldProps.slots 转发为字段组件内部插槽', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'keyword',
          label: '关键词',
          type: 'input',
          fieldProps: {
            slots: {
              prefix: 'keyword-prefix',
              suffix: () => h('span', { class: 'keyword-suffix' }, '条'),
            },
          },
        }],
        modelValue: { keyword: '' },
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
      slots: {
        'keyword-prefix': () => h('span', { class: 'keyword-prefix' }, '搜索'),
      },
    })

    expect(wrapper.find('.keyword-prefix').text()).toBe('搜索')
    expect(wrapper.find('.keyword-suffix').text()).toBe('条')
  })

  it('默认使用 key 作为整个字段的插槽名', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'avatar',
          label: '头像',
          type: 'input',
        }],
        modelValue: { avatar: '' },
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
      slots: {
        avatar: () => h('span', { class: 'avatar-field' }, '头像插槽'),
      },
    })

    expect(wrapper.find('.avatar-field').text()).toBe('头像插槽')
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('设置 slot 后优先使用 slot 作为插槽名', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'avatar',
          label: '头像',
          type: 'input',
          slot: 'avatar-field',
        }],
        modelValue: { avatar: '' },
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
      slots: {
        avatar: () => h('span', { class: 'key-slot' }, 'key 插槽'),
        'avatar-field': () => h('span', { class: 'avatar-field' }, 'slot 插槽'),
      },
    })

    expect(wrapper.find('.avatar-field').text()).toBe('slot 插槽')
    expect(wrapper.find('.key-slot').exists()).toBe(false)
  })
})

describe('ElFormPro ElForm exposes compatibility', () => {
  it('resetFields 支持只重置指定字段', async () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          { key: 'first', label: 'First', type: 'input', defaultValue: 'A' },
          { key: 'second', label: 'Second', type: 'input', defaultValue: 'B' },
        ],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('changed')
    await inputs[1].setValue('changed')

    ;(wrapper.vm as unknown as { resetFields: (props?: string) => void }).resetFields('first')
    await wrapper.vm.$nextTick()

    const nextInputs = wrapper.findAll('input')
    expect((nextInputs[0].element as HTMLInputElement).value).toBe('A')
    expect((nextInputs[1].element as HTMLInputElement).value).toBe('changed')
  })
})

describe('ElFormPro password field', () => {
  it('渲染原生密码输入框', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'password',
          label: '密码',
          type: 'password',
          defaultValue: '',
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.find('input').attributes('type')).toBe('password')
  })
})

describe('ElFormPro inputTag', () => {
  it('inputTag 使用 ElInputTag', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'tags',
          label: '标签',
          type: 'inputTag',
          defaultValue: ['vue'],
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'ElInputTag' }).props('modelValue')).toEqual(['vue'])
  })
})

describe('ElFormPro composed child visibility', () => {
  it('children 中的 hidden 子字段不会渲染，也不参与必填标记', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          label: '活动时间',
          children: [
            { key: 'date1', label: '日期', type: 'date' },
            {
              key: 'date2',
              label: '时间',
              type: 'time',
              hidden: true,
              rules: [{ required: true }],
            },
          ],
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findAll('input')).toHaveLength(1)
    expect(wrapper.find('.el-form-pro__group').classes()).not.toContain('is-required')
  })
})
describe('ElFormPro new field types', () => {
  it('transfer 使用 modelValue 双向绑定', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'cities',
          label: '城市',
          type: 'transfer',
          defaultValue: [],
          fieldProps: {
            data: [
              { key: 'shanghai', label: '上海' },
              { key: 'beijing', label: '北京' },
            ],
          },
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'ElTransfer' }).props('modelValue')).toEqual([])
  })

  it('mention 使用 modelValue 双向绑定', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'mention',
          label: '提及',
          type: 'mention',
          defaultValue: '@',
          fieldProps: {
            options: [{ value: 'alice', label: 'Alice' }],
          },
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'ElMention' }).props('modelValue')).toBe('@')
  })

  it('upload 使用 file-list 双向绑定', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [{
          key: 'files',
          label: '附件',
          type: 'upload',
          defaultValue: [],
          fieldProps: {
            action: '/upload',
          },
        }],
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'ElUpload' }).props('fileList')).toEqual([])
    expect(wrapper.findComponent({ name: 'ElUpload' }).text()).toContain('选择文件')
  })
})

describe('ElFormPro custom label and type', () => {
  it('支持 label 和 type 使用 h 函数', () => {
    const wrapper = mount(ElFormPro, {
      props: {
        schema: [
          {
            key: 'custom',
            label: () => h('span', { class: 'label-node' }, '自定义标签'),
            type: h('input', { class: 'custom-input' }),
          },
        ],
        modelValue: { custom: '' },
        formConfig: {
          buttons: { submit: false, reset: false },
        },
      },
    })

    expect(wrapper.find('.label-node').text()).toBe('自定义标签')
    expect(wrapper.find('.custom-input').exists()).toBe(true)
  })
})
