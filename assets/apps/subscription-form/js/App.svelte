<script>
  import { onMount } from "svelte";

  let submitButton = null;

  let displayName = "";
  let email = "";
	let formIsValid = false

  $: {
    formIsValid = !!displayName && displayName.length > 3 && !!email;
  }

  function registerSubmitHandler() {
    if (!submitButton) {
      console.log("Cannot register submit handler");
      return;
    }

    submitButton.form.addEventListener("submit", onSubmit, false);
  }

  function onSubmit(ev) {
    if (!formIsValid) {
      alert("Invalid form data");
      ev.preventDefault();
      return;
    }

    console.log("Submitting", ev);
  }

  onMount(() => {
    registerSubmitHandler();
  });
</script>

<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="displayName">
    Your name
  </label>
  <input
    class="shadow appearance-none border rounded w-full py-2 px-3 
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="displayName"
    name="displayName"
    type="text"
    bind:value = {displayName}
    placeholder="Display name in format Lastname, Firstname"
  />
</div>
<div class="mb-6">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
    Your email
  </label>
  <input
    class="shadow appearance-none border rounded w-full py-2 px-3 
      text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
    id="email"
    name="email"
    type="email"
    bind:value = {email}
    placeholder="Your email"
  />
</div>
<div class="flex items-center justify-between">
  <button
    bind:this={submitButton}
    class="{!formIsValid ? 'cursor-not-allowed opacity-50': ''} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    type="submit"
    title={(!formIsValid && "Please, fill out all fields") || ""}
    disabled={!formIsValid}
    on:click={onSubmit}
  >
    Subscribe
  </button>
</div>

<style>
</style>