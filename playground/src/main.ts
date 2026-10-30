import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElementPlusSuite from 'element-plus-suite'
import App from './app.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(ElementPlusSuite)
app.mount('#app')
