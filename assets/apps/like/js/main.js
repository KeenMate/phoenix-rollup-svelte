import App from './App.svelte'

// instantiate the component
function constructor(element, props) {
  new App({
    // mount it to `document.body`
    target: element,
  
    // pass some props (optional)
    props: props
  })
}

window.AppsManager.register("like", constructor);