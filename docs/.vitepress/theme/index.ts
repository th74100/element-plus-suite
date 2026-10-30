import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElementPlusSuite from 'element-plus-suite'
import Demo from './components/demo.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    app.use(ElementPlusSuite)
    app.component('Demo', Demo)
  },
}
