import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'element-plus-suite',
  description: '基于 Element Plus 的扩展组件库',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/table-pro/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
      ],
      '/components/table-pro/': [
        {
          text: 'ElTablePro',
          items: [
            { text: '概览', link: '/components/table-pro/' },
            { text: 'Props', link: '/components/table-pro/props' },
            { text: 'Events', link: '/components/table-pro/events' },
            { text: '实例方法', link: '/components/table-pro/instance' },
          ],
        },
      ],
    },
    outline: { level: [2, 3] },
    footer: {
      message: '基于 MIT License 发布',
      copyright: 'Copyright © 2026 element-plus-suite contributors',
    },
  },
})
