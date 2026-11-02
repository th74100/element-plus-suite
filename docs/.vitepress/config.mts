import { defineConfig } from 'vitepress'

/**
 * VitePress 默认给 .vp-doc 下所有 table/tr/th/td 加样式，
 * 连 Demo 中 ElTable 的内部表格也会被命中。
 * 这里在构建阶段移除 vp-doc.css 的 Table 区块，
 * 再由主题样式只给 Markdown 表格补样式。
 */
function stripVitePressTableStyles() {
  return {
    name: 'strip-vitepress-table-styles',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const file = id.split('?')[0].replace(/\\/g, '/')
      if (!file.endsWith('/theme-default/styles/components/vp-doc.css')) return

      const source = code.replace(/\r\n/g, '\n')
      const tableStart = source.indexOf('/**\n * Table')
      const decorationStart = source.indexOf(
        '/**\n * Decorational elements',
        tableStart,
      )

      if (tableStart < 0 || decorationStart < 0) return

      return source.slice(0, tableStart) + source.slice(decorationStart)
    },
  }
}
export default defineConfig({
  title: 'Element Plus Suite',
  description: '保留 ElTable 全部能力，同时减少表格页面中的重复代码。',
  lang: 'zh-CN',
  cleanUrls: true,
  vite: {
    plugins: [stripVitePressTableStyles()],
  },
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/' },
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
      '/components/': [
        /*{
          text: '组件总览',
          items: [
            { text: '全部组件', link: '/components/' },
          ],
        },*/
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table-pro/' },
            /*{ text: 'Props', link: '/components/table-pro/props' },
            { text: 'Events', link: '/components/table-pro/events' },
            { text: '实例方法', link: '/components/table-pro/instance' },*/
          ],
        },
        /*{
          text: '表单',
          items: [
            { text: 'ElFormPro（规划中）', link: '/components/form/' },
          ],
        },
        {
          text: '基础',
          items: [
            { text: 'ElButton（规划中）', link: '/components/button/' },
          ],
        },*/
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/th74100/element-plus-suite' },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
  },
})
