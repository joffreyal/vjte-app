import packageJson from "../../package.json"

export default {
  install: (app) => {

    app.config.globalProperties.$params = {
      backUrl: "https://script.google.com/macros/s/AKfycbxzXLKg4xlav23Dam4Cks3qg7hcJo40cAcY4iKvv0v1nHs7sFR896-yIMu8lQSzIw/exec",
      version: packageJson.version
    }
  }
}
