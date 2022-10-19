import { createApp } from 'vue'
import App from './App.vue'
import params from './plugins/params'

import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App);

app.use(params);
app.config.unwrapInjectedRef = true

app.mount('#app')