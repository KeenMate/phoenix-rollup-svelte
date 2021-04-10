import App from './App.svelte'

window.components = window.components || {};
window.components.subscriptionForm = function(elem) {
  // instantiate the component
  new App({
    // mount it to `document.body`
    target: elem
  })
}