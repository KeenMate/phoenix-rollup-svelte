import AppsManager from '../../../js/AppsManager';
import App from './App.svelte'

// instantiate the component
function constructor(element) {
  new App({
    // mount it to `document.body`
    target: element,
  
    // pass some props (optional)
    props: element.dataset
  })
}

AppsManager.register("connect", constructor);