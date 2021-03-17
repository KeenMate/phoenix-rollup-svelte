<script>
  let randomNumber = () => Math.floor(Math.random() * 101);

  let friends = randomNumber();
  let photos = randomNumber();
  let comments = randomNumber();
</script>

<div class="flex justify-center py-4 lg:pt-4 pt-8">
  <div class="mr-4 p-3 text-center">
    <span class="text-xl font-bold block uppercase tracking-wide text-gray-700">{friends}</span><span
      class="text-sm text-gray-500">Friends</span>
  </div>
  <div class="mr-4 p-3 text-center">
    <span class="text-xl font-bold block uppercase tracking-wide text-gray-700">{photos}</span><span
      class="text-sm text-gray-500">Photos</span>
  </div>
  <div class="lg:mr-4 p-3 text-center">
    <span class="text-xl font-bold block uppercase tracking-wide text-gray-700">{comments}</span><span
      class="text-sm text-gray-500">Comments</span>
  </div>
</div>

<style>
</style>
