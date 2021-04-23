<script>
  import NotificationManager from "notification-manager";

  export let id;
  export let liked;

  async function likeClicked() {
    try {
      if (liked !== "true") {
        await sendRequest(true);
        liked = "true";
        NotificationManager.success("Why, thank you");
      } else {
        await sendRequest(false);
        liked = "false";
        NotificationManager.success("This made me sad");
      }
    } catch {
      NotificationManager.error("Error occurred");
    }
  }

  async function sendRequest(like) {
    let method = like ? "PUT" : "DELETE";
    let csrfToken = document.head.querySelector("[name~=csrf-token][content]").content;

    await fetch("/api/like", {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({ id: id }),
    });
  }
</script>

<button
  class="active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 bg-indigo-500"
  on:click={likeClicked}
>
  {#if liked === "true"}Unlike{:else}Like{/if}
</button>

<style>
</style>
