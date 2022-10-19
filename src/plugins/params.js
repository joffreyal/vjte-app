export default {
  install: (app) => {
    // inject a globally available $translate() method
    app.config.globalProperties.$params = {
      backUrl: "https://script.google.com/macros/s/AKfycbz939fImOSGXB5_TFXi3J4fKmf1Rkvot5FugLYyi4Zyz2mpIn3cX0KGQu393c0Ehhgd/exec"
    }
  }
}
