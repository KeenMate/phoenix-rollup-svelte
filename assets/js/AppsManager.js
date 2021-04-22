class AppsManager {
  constructor() {
    console.log("Creating AppsManager")
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

      elements.forEach(element => constructor(element));
    });
  }
}

export default window.AppsManager || new AppsManager()
