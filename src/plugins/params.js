import packageJson from "../../package.json"

export default {
  install: (app) => {

    app.config.globalProperties.$params = {
      backUrl: "https://script.google.com/macros/s/AKfycbyJK2_pEiCJgO2B5LAnOAAEB9S5CCVSg1uXtvmoPk2Y8HKlEnhcLEeiG6xy53iS0UZN/exec",
      version: packageJson.version
    }
  }
}
