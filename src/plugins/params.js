import packageJson from "../../package.json"

export default {
  install: (app) => {

    app.config.globalProperties.$params = {
      backUrl: "https://script.google.com/macros/s/AKfycbz939fImOSGXB5_TFXi3J4fKmf1Rkvot5FugLYyi4Zyz2mpIn3cX0KGQu393c0Ehhgd/exec",
      version: packageJson.version
    }
  }
}
