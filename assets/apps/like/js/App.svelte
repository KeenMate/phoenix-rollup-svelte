<svelte:options tag="like-btn" />

<script>
  export let id;
  export let liked;
  export let csrf;

  function likeClicked() {
    if (liked !== "true") {
      sendRequest(true)
      liked = "true"
    }  else {
      sendRequest(false)
      liked = "false"
    }
  }

  function sendRequest(like) {
    let method = like ? "PUT" : "DELETE"

    fetch("/api/like", {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrf
        },
        body: JSON.stringify({id: id})
      });
  }
</script>

<button on:click="{likeClicked}">{#if liked === "true"}Unlike{:else}Like{/if}</button>