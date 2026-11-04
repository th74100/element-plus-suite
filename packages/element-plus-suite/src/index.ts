import './table-pro/style.css'
import type { App } from 'vue'
import { ElTablePro } from './table-pro'

export * from './table-pro'
export { ElTablePro }

const components = [ElTablePro]

export function install(app: App) {
  components.forEach((component) => {
    const name = (component as { name?: string }).name
    if (name) app.component(name, component)
  })
}

export default { install }
