import { defineConfig } from 'vitepress'

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
const publicPath = isGitHubPages ? '/element-plus-suite' : ''

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
  base: isGitHubPages ? '/element-plus-suite/' : '/',
  title: 'Element Plus Suite',
  description: '保留 ElTable 全部能力，同时减少表格页面中的重复代码。',
  lang: 'zh-CN',
  cleanUrls: true,
  markdown: {
    theme: {
      light: 'one-light',
      dark: 'one-dark-pro',
    },
  },
  vite: {
    plugins: [stripVitePressTableStyles()],
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: publicPath + '/logo.svg' }],
    ['link', { rel: 'apple-touch-icon', href: publicPath + '/apple-touch-icon.png' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/table-pro/' },
      { text: 'skills.md', link: '/skills/' },
    ],
    sidebar: {
      '/skills/': [
        {
          text: '技能',
          items: [
            { text: 'skills.md', link: '/skills/' },
          ],
        },
      ],
      '/guide/': [
        {
          text: '介绍',
          items: [
            { text: '说明', link: '/guide/' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button-pro/' },
          ],
        },
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table-pro/' },
          ],
        },
        {
          text: '数据录入',
          items: [
            { text: 'Form 表单', link: '/components/form-pro/' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/th74100/element-plus-suite' },
    ],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
  },
})
