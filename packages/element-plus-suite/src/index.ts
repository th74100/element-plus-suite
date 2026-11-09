import './button-pro/style.css'
import './form-pro/style.css'
import './table-pro/style.css'
import type { App } from 'vue'
import { ElButtonPro } from './button-pro'
import { ElFormPro } from './form-pro'
import { ElTablePro } from './table-pro'

export * from './button-pro'
export * from './form-pro'
export * from './table-pro'
export { ElButtonPro, ElFormPro, ElTablePro }

const components = [ElButtonPro, ElFormPro, ElTablePro]

export function install(app: App) {
  components.forEach((component) => {
    const name = (component as { name?: string }).name
    if (name) app.component(name, component)
  })
}

export default { install }
