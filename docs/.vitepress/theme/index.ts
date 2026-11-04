import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// VitePress 使用 html.dark 切换暗色，需要同步加载 Element Plus 暗色变量。
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlusSuite from 'element-plus-suite'
import 'element-plus-suite/dist/index.css'
import ApiType from './components/api-type.vue'
import Layout from './layout.vue'
import Demo from './components/demo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    app.use(ElementPlusSuite)
    app.component('ApiType', ApiType)
    app.component('Demo', Demo)
  },
}
