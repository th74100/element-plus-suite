import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Element Plus Suite',
  description: '保留 ElTable 全部能力，同时减少表格页面中的重复代码。',
  lang: 'zh-CN',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/table-pro/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '为什么用它', link: '/guide/introduction' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
      ],
      '/components/table-pro/': [
        {
          text: '数据展示',
          items: [
            { text: 'ElTablePro', link: '/components/table-pro/' },
            { text: 'Props', link: '/components/table-pro/props' },
            { text: 'Events', link: '/components/table-pro/events' },
            { text: '实例方法', link: '/components/table-pro/instance' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/th74100/element-plus-suite' },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    footer: {
      message: '基于 MIT License 发布',
      copyright: 'Copyright © 2026 Element Plus Suite contributors',
    },
  },
})
