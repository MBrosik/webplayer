<template>
   <div>
      <button class="add-to-playlist-button" @click="showPlaylist"></button>
   </div>
</template>

<script>
   export default {
      methods: {
         showPlaylist() {
            // change bool
            this.$store.commit("SAMPLE_MUTATION", {
               key: "selected_custom_album",
               value: true,
            });

            this.$store.dispatch("getPlaylist");
         },
      },
   };
</script>

<style scoped>
   .add-to-playlist-button {
      cursor: pointer;
      padding: 0;
      outline: 0;
      border: 0;
      width: 40px;
      height: 40px;
      background-size: 100% 100%;
      background-color: transparent;
      background-image: url("http://localhost:3000/images/show_playlist.png");
   }
</style>