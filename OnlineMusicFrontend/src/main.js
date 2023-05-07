import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './style.less'
import router from './router/index.js'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia()).use(router)
// 导入图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
