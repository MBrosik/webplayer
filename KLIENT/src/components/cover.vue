<template>
   <div
      :data-after="albumName.album"
      class="cover-container"
      :style="coverPhoto"
      @click="changeAlbum()"
   ></div>
</template>

<script>
   export default {
      props: ["albumName"],
      computed: {
         coverPhoto() {
            return {
               background: `url("${this.getURL()}")`,
               backgroundSize: `100% 100%`,
            };
         },
      },
      methods: {
         getURL() {
            if (this.albumName.cover != undefined) {
               return `http://localhost:3000/albums/${this.albumName.album}/${this.albumName.cover}`;
            }

            return `http://localhost:3000/images/default.png`;
         },
         changeAlbum() {
            this.$store.commit("playPauseMusic", [false]);
            this.$store.commit("changeSelectedMusic", ["", "", "", ""]);
            ["music_duration", "music_current_time"].forEach((el) => {
               this.$store.commit("SAMPLE_MUTATION", { key: el, value: 0 });
            });

            // change bool
            this.$store.commit("SAMPLE_MUTATION", {
               key: "selected_custom_album",
               value: false,
            });

            document.querySelector(".audio-tag").currentTime = 0;
            this.$store.dispatch("getNextInfo", this.albumName.album);
         },
      },
   };
</script>

<style scoped>
   .cover-container {
      cursor: pointer;
      width: 200px;
      height: 200px;
   }
   .cover-container::after {
      display: block;

      background-color: rgba(102, 102, 102, 0.596);
      color: rgba(255, 255, 255, 0.815);

      text-align: center;

      width: 100%;
      height: 100%;

      transform: scaleY(0);
      transition: transform 0.2s ease-in-out;

      content: attr(data-after);

      display: flex;
      justify-content: center;
      align-items: center;

      padding-right: 15px;
   }
   .cover-container:hover::after {
      transform: scaleY(1);
   }
</style>