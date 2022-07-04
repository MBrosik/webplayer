<template>
   <div id="container">
      <!-- -------------- -->
      <!-- covers -->
      <!-- -------------- -->
      <div id="menu-div">
         <show-playlist-button> </show-playlist-button>
      </div>
      <div id="covers-container">
         <cover
            v-for="(album, index) in AlbumNames"
            :key="index"
            :albumName="album"
         ></cover>
      </div>

      <!-- ---------- -->
      <!-- title -->
      <!-- ---------- -->
      <div id="title">Web Player</div>

      <!-- -------------- -->
      <!-- music piece -->
      <!-- -------------- -->
      <div id="pieces-container">
         <piece
            v-for="(item, index) in coversList"
            :key="`${item.albumName}-${item.name}`"
            :musicObject="item"
            :arrayIndex="index"
         ></piece>
      </div>

      <music-controlls-comp id="footer"></music-controlls-comp>
   </div>
</template>


<script>
   import ShowPlaylistButton from "./components/ShowPlaylistButton.vue";
   import cover from "./components/cover.vue";
   import MusicControllsComp from "./components/musicControllsComp.vue";
   import Piece from "./components/piece.vue";

   // ----------------
   // Vue script
   // ----------------
   export default {
      components: { cover, Piece, MusicControllsComp, ShowPlaylistButton },

      data() {
         return {};
      },

      computed: {
         AlbumNames() {
            return this.$store.state.albumNames;
         },
         coversList() {
            return this.$store.state.coversList;
         },
      },

      methods: {},

      // ---------------------------
      // Vue component states
      // ---------------------------
      mounted() {
         this.$store.dispatch("getFirstInfo");
      },
   };
</script>

<style>
   @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

   * {
      font-family: "Poppins", sans-serif;
      box-sizing: border-box;
   }

   body {
      margin: 0;
      padding: 0;

      width: 100%;
      height: 100vh;
   }

   @media (max-width: 694px) {
      body {
         height: calc(100vh - 17px);
      }
   }
</style>

<style scoped>
   #container {
      width: max(100%, 694px);
      height: 100%;
      display: grid;
      grid-template-columns: 70px 215px auto;
      grid-template-rows: 50px auto 100px;
   }

   #menu-div {
      grid-column: 1;
      grid-row: 1 / span 2;

      background-color: grey;
      overflow-x: hidden;
      overflow-y: auto;

      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;
   }
   #covers-container {
      grid-column: 2;
      grid-row: 1 / span 2;

      background-color: grey;
      overflow-x: hidden;
      /* overflow-y: auto; */
      overflow-y: scroll;
   }
   #title {
      grid-column: 3;
      grid-row: 1;

      font-size: 20px;
      color: rgb(50, 50, 209);
      text-align: center;
   }
   #pieces-container {
      grid-column: 3;
      grid-row: 2;
      overflow-x: hidden;
      overflow-y: auto;
   }

   #footer {
      grid-column: 1 / span 3;
      grid-row: 3;
   }
</style>