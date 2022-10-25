import packageJson from "../../package.json"

export default {
  install: (app) => {

    app.config.globalProperties.$params = {
      backUrl: "https://script.google.com/macros/s/AKfycbwZ7liUlAPYLTwRyplURd-cxf8ngA-arUF8zYbFgnNGO2xwhH0C4i8e33Y7xthPvLt1/exec",
      version: packageJson.version
    }
  }
}
