import packageJson from "../../package.json"

export default {
  install: (app) => {

    app.config.globalProperties.$params = {
      backUrl: "https://script.google.com/macros/s/AKfycbyCEDu6ZcGTNw-VWO3eF-QnxE0-8PwF9VZuPzYM3HXkOgLJll34HNJmIkQ_SR1J--gu/exec",
      version: packageJson.version
    }
  }
}
