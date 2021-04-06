import App from './App.svelte'

window.components = {};
window.components.like = function(root, id, liked) {
  // instantiate the component
  new App({
    // mount it to `document.body`
    target: root,

    // pass some props (optional)
    props: {
      id: id,
      liked: liked
    }
  })
}
