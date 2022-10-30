export default {
  install: (app) => {
    app.config.globalProperties.$token = {
      async getAccessToken() {
        return window.ipcRenderer.invoke('getStoreValue', 'token').then(async (token) => {
          
          if (token.expiry_date < Date.now()) {
            const opt = {
              method: 'POST',
              headers: {"Content-Type": "text/plain;charset=utf-8"},
              body: JSON.stringify({
                "client_id": process.env.VUE_APP_GOOGLE_CLIENT_ID,
                "client_secret": process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
                "refresh_token": token.refresh_token,
                "grant_type": "refresh_token"
              })
            }
            const response = await fetch('https://www.googleapis.com/oauth2/v4/token', opt)
            const data = await response.json()
            token.access_token = data.access_token
            token.expiry_date = Date.now() + (data.expires_in * 1000)
            window.ipcRenderer.invoke('setStoreValue', ['token', token])
            return await token
          } else {
            return Promise.resolve(token)
          }
        })
      },
      reConnectGoogle() {
        return window.ipcRenderer.invoke('resetConnection')
      }
    }
  } 
}



