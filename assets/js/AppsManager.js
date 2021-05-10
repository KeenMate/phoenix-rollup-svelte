class AppsManager {
  constructor() {
    window.AppsManager = this

    this.apps = {}    
  }

  register(name, constructor) {
    this.apps[name] = constructor
  }

  create(name, element) {
    this.apps[name](element)
  }

  createAll() {
    Object.entries(this.apps).forEach(([name, constructor]) => {
      let elements = document.querySelectorAll(`[data-app='${name}'`);

      elements.forEach(element => {
        let filteredDataset = Object.entries(element.dataset).filter(([key, _]) => key !== "app")
        let props = Object.fromEntries(filteredDataset)

        constructor(element, props)
      });
    });
  }
}

window.AppsManager = new AppsManager()
