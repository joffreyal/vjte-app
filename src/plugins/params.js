import packageJson from "../../package.json"

export default {
  install: (app) => {

    app.config.globalProperties.$params = {
      // backUrl: "https://script.google.com/macros/s/AKfycbx50mVgytcweddvA5LbXRMb0hgwxNI6nSOfcfLynEE/dev",
      backUrl: "https://script.google.com/macros/s/AKfycbxPOR7ptGz9SX9MF2DMCahzNcPMPzAKUcjYFhNrtNFiGbdoKBIRain19frUYnnO0pz-/exec",
      version: packageJson.version
    }
  }
}



