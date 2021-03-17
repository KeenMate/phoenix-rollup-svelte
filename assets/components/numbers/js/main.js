import App from './App.svelte'

// instantiate the component
new App({
  // mount it to `document.body`
  target: document.getElementById("numbers-container"),

  // pass some props (optional)
  props: {}
})