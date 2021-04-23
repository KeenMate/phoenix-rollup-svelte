<script>
  import { onMount, onDestroy } from "svelte";
  import NotificationManager from "notification-manager";

  let subscription;
  let notifications = [];
  let notificationsVisible = false;

  onMount(() => {
    subscription = NotificationManager.messagesSubject.subscribe((x) => {
      notifications = x;
    });
  });

  onDestroy(() => subscription.unsubscribe());

  function showNotifications() {
    notificationsVisible = true;
  }

  function hideNotifications() {
    notificationsVisible = false;
  }
</script>

<div class="fixed bottom-5 right-5 z-10 flex flex-col-reverse">
  <button on:click={notificationsVisible ? hideNotifications() : showNotifications()} class="bg-blue-500 rounded text-white text-right">
    {#if notificationsVisible}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
        />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
        />
      </svg>
    {/if}
  </button>

  {#if notificationsVisible}
    {#each notifications as notification}
      <div>
        {notification}
      </div>
    {/each}
  {/if}
</div>

<style>
</style>
