import { createApp } from 'vue'
import App from './App.vue'

import params from './plugins/params'
import token from './plugins/token'

import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const { fetch: originalFetch } = window;

const app = createApp(App);
window.ipcRenderer.invoke('getStoreValue', 'token').then((result) => {
    app.provide('token', result)
})
app.use(params);
app.use(token);

app.config.unwrapInjectedRef = true

app.mount('#app')

window.fetch = async (...args) => {
    let [resource, config ] = args;
    
    if (resource.includes(process.env.VUE_APP_GOOGLE_SCRIPT_URL)) {
        return app.config.globalProperties.$token.getAccessToken().then(async token => {
            config.headers.Authorization = "Bearer " + token.access_token;
            return originalFetch(resource, config)
        })
    } else {
        return originalFetch(resource, config)    
    }
};