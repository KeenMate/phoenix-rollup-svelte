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

<div class="z-10 px-3 py-4 lg:py-2 flex flex-col-reverse" style="position:relative">
  <button
    on:click={notificationsVisible ? hideNotifications() : showNotifications()}
    class="rounded lg:text-gray-300 text-gray-500 text-right focus:outline-none"
  >
    <svg
      enable-background="new 0 0 48 48"
      height="20px"
      id="Layer_3"
      version="1.1"
      viewBox="0 0 48 48"
      width="20px"
      xml:space="preserve"
      class="{notifications.length > 0
        ? 'text-red-500'
        : 'lg:text-gray-300 text-gray-500'} fill-current"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
        <g
        ><path
          d="M20.012,4.661c-2.212,0.573-4.284,1.494-6.129,2.735L10.89,4.402l-5.656,5.657l3.042,3.042   c-1.163,1.784-2.036,3.766-2.583,5.883h-4.66v10.031h4.66c0.56,2.165,1.458,4.193,2.66,6.009l-3.118,3.118l5.656,5.656l3.119-3.118   c1.819,1.205,3.853,2.104,6.023,2.664V48h4.062v-8.047C15.697,39.465,9.032,32.52,9.032,24c0-8.521,6.665-15.465,15.062-15.953V0   h-4.083V4.661z"
        />
        <path
          d="M16.032,24c0,4.654,3.532,8.482,8.062,8.951v-4.046c-2.312-0.439-4.062-2.465-4.062-4.905   c0-2.44,1.75-4.466,4.062-4.905v-4.046C19.564,15.518,16.032,19.346,16.032,24z"
        /><path
          d="M39.248,25.986V14.133C39.248,6.94,33.933,1.005,27.019,0v4.056c4.344,0.887,7.683,4.512,8.153,8.992v1.085   v0.508v0.607v8.874v1.865v1.004l5.466,12.963H30.259h-3.24h-0.062V48h3.303v-0.006C30.28,47.994,30.3,48,30.321,48   c1.29,0,2.336-1.046,2.336-2.336v-2.31h9.415h0.46h4.436L39.248,25.986z"
        /></g
      ></svg
    >
  </button>

  {#if notificationsVisible}
    <div
      class="absolute top-10 right-1 z-10 max-w-sm rounded-sm
  overflow-hidden shadow-lg bg-white w-72"
    >
      <div class="mx-6 my-4 border-b border-gray-light">
        <div class="font-medium text-base text-gray-darker mb-4">
          Last notifications
        </div>
        {#each notifications as notification}
          <p class="font-normal text-gray-dark text-sm mb-2">
            {notification}
          </p>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
 
</style>
