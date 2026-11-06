import './form-pro/style.css'
import './table-pro/style.css'
import type { App } from 'vue'
import { ElFormPro } from './form-pro'
import { ElTablePro } from './table-pro'

export * from './form-pro'
export * from './table-pro'
export { ElFormPro, ElTablePro }

const components = [ElFormPro, ElTablePro]

export function install(app: App) {
  components.forEach((component) => {
    const name = (component as { name?: string }).name
    if (name) app.component(name, component)
  })
}

export default { install }
