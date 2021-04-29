<script>
  import NotificationManager from "notification-manager";

  let state = "none";

  function toggleConnection() {
    switch (state) {
      case "none":
        simulateConnectionChange(
          "connecting",
          "connected",
          "Connected! What a feeling, right?"
        );
        break;
      case "connecting":
        NotificationManager.warn("Already connecting");
        break;
      case "connected":
        simulateConnectionChange(
          "disconnecting",
          "disconnected",
          "Disconnected! That was a mistake you are going to regret!"
        );
        break;
      case "disconnecting":
        NotificationManager.warn("Already disconnecting! STOP PRESSURING ME!");
        break;
      case "disconnected":
        simulateConnectionChange(
          "connecting",
          "connected",
          "Connected again! Thank god!"
        );
        break;
    }
  }

  function simulateConnectionChange(tempState, finalState, message) {
    state = tempState;
    setTimeout(() => {
      state = finalState;
      NotificationManager.success(message);
    }, 900);
  }
</script>

<button
  class="{state === "connected"
    ? 'bg-indigo-500'
    : 'bg-pink-500'} active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
  type="button"
  style="transition: all 0.15s ease 0s;"
  on:click={toggleConnection}
>
  {#if (state === "none")}
    Connect
  {:else if (state === "connecting")}
    Connecting
  {:else if (state === "connected")}
    Connected
  {:else if (state === "disconnecting")}
    Disconnecting
  {:else}
    Disconnected
  {/if}
</button>

<style>
</style>
