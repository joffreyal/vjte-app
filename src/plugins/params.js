import packageJson from "../../package.json"

export default {
  install: (app) => {
    app.config.globalProperties.$params = {
      backUrl: process.env.VUE_APP_GOOGLE_SCRIPT_URL,
      version: packageJson.version
    }
  } 
}



