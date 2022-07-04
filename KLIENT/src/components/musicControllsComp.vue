<template>
   <div class="music-controlls-container">
      <!-- ------------ -->
      <!-- music name -->
      <!-- ------------ -->
      <div id="music-name">
         {{
            selectedMusic.songName != ""
               ? `${selectedMusic.albumName}-${selectedMusic.songName}`
               : "Wybierz utwór"
         }}
      </div>

      <!-- ---------------- -->
      <!-- music controls -->
      <!-- ---------------- -->
      <div id="music-controlls-and-timeline">
         <!-- ---------------- -->
         <!-- music controller -->
         <!-- ---------------- -->
         <div id="music-controlls">
            <shuffle id="shuffle-comp"></shuffle>
            <button
               id="previous-button"
               @click="clickPreviousNextButton(true)"
            ></button>
            <button
               id="play-resume-button"
               :style="songControllerImages"
               @click="clickControllerButton(false)"
            ></button>
            <button
               id="next-button"
               @click="clickPreviousNextButton(false)"
            ></button>
            <repeat id="repeat-comp"></repeat>
         </div>
         <!-- -------- -->
         <!-- timeline -->
         <!-- -------- -->
         <div id="timeline-and-music-time-numbers">
            <span>{{ music_current_time }}</span>
            <div id="timeline" @click="selectTimeline">
               <div id="progress"></div>
            </div>
            <span>{{ music_duration }}</span>
         </div>
      </div>

      <div id="volume-container">
         <img src="http://localhost:3000/images/volume.png" alt="" />
         <input
            type="range"
            id="volume-range"
            @input="music_volume"
            min="0"
            max="1"
            step="0.01"
         />
      </div>

      <!-- -------------- -->
      <!-- audio source -->
      <!-- -------------- -->
      <audio class="audio-tag" controls>
         <source class="audio_src" type="audio/mp3" />
      </audio>
   </div>
</template>

<script>
   import Repeat from "./musicControllsComps/repeat.vue";
   import shuffle from "./musicControllsComps/shuffle.vue";
   // ----------------
   // Vue script
   // ----------------
   export default {
      components: { shuffle, Repeat },
      data() {
         return {};
      },

      methods: {
         clickControllerButton(bool = false) {
            // --------------------------
            // check if music is played
            // --------------------------
            if (this.album_selecected_bool) {
               if (this.music_on_controller) {
                  this.$store.commit("playPauseMusic", [false]);
               } else {
                  this.$store.commit("playPauseMusic", [
                     true,
                     bool == true ? this.selectedMusic.src : null,
                  ]);
               }
            }
         },

         clickPreviousNextButton(Bool) {
            if (this.album_selecected_bool) {
               // ------------------------------------------
               // check if previous or next music exist
               // ------------------------------------------
               let index = Bool
                  ? // if previous
                    this.selectedMusic.arrayIndex != 0
                     ? this.selectedMusic.arrayIndex - 1
                     : "NOT"
                  : // if next
                  this.selectedMusic.arrayIndex != this.coversList.length - 1
                  ? this.selectedMusic.arrayIndex + 1
                  : "NOT";

               // -------------------------------------
               // do something if name of music exist
               // -------------------------------------
               if (index != "NOT") {
                  let music = this.coversList[index];
                  this.$store.commit("changeSelectedMusic", [
                     music.name,
                     music.albumName,
                     `http://localhost:3000/albums/${music.albumName}/${music.name}`,
                     index,
                  ]);
                  if (this.music_on_controller) {
                     this.clickControllerButton(false);
                     this.clickControllerButton(true);
                  }
               }
            }
         },
         selectTimeline(e) {
            if (!this.album_selecected_bool) return;

            let music_tag = document.querySelector(".audio-tag");

            let offsetLeft = e.currentTarget.offsetLeft;

            let widthINT = e.currentTarget.getBoundingClientRect().width;
            let musicTimeSet =
               ((e.pageX - offsetLeft) / widthINT) * music_tag.duration;

            music_tag.currentTime = musicTimeSet;
         },

         music_time_parser(time) {
            let floor_time = isNaN(time) ? 0 : Math.floor(time);
            let minute = Math.floor(floor_time / 60);
            let seconds = floor_time % 60;

            return `${minute}:${
               seconds.toString().length == 1 ? `0${seconds}` : seconds
            }`;
         },

         // --------------
         // volume
         // --------------
         music_volume(e) {
            let audio = document.querySelector(".audio-tag");
            audio.volume = e.currentTarget.value;
         },
      },

      computed: {
         // ------------------------
         // get states from store
         // ------------------------
         selectedMusic() {
            return this.$store.state.selectedMusic;
         },
         music_on_controller() {
            return this.$store.state.music_on;
         },
         coversList() {
            return this.$store.state.coversList;
         },
         music_duration() {
            return this.music_time_parser(this.$store.state.music_duration);
         },
         music_current_time() {
            return this.music_time_parser(this.$store.state.music_current_time);
         },
         album_selecected_bool() {
            return this.$store.getters.albumSelectedBool;
         },

         // shuffle and repeat
         shuffle_selcted() {
            return this.$store.state.shuffle_selcted;
         },
         repeat_selected() {
            return this.$store.state.repeat_selected;
         },

         // -------------
         // css image
         // -------------
         songControllerImages() {
            return {
               backgroundImage: `url('http://localhost:3000/images/${
                  this.music_on_controller ? "pause.png" : "play.png"
               }')`,
            };
         },
      },

      // -------------------------
      // comp state information
      // -------------------------
      created() {},
      mounted() {
         /**
          * @type {HTMLAudioElement}
          */
         let audioElement = document.querySelector(".audio-tag");
         // audioElement.loop = true;
         audioElement.ontimeupdate = (e) => {
            let currentTime = e.currentTarget.currentTime;
            let duration = e.currentTarget.duration;
            this.$store.commit("SAMPLE_MUTATION", {
               key: "music_current_time",
               value: currentTime,
            });
            this.$store.commit("SAMPLE_MUTATION", {
               key: "music_duration",
               value: duration,
            });
            let progressDIV = document.getElementById("progress");
            progressDIV.style.width = `${(currentTime / duration) * 100}%`;
         };

         // -------------------
         // music on ended
         // -------------------
         audioElement.onended = () => {
            let index;

            if (this.shuffle_selcted) {
               index = Math.floor(this.coversList.length * Math.random());
            } else if (
               this.selectedMusic.arrayIndex !=
               this.coversList.length - 1
            ) {
               index = this.selectedMusic.arrayIndex + 1;
            } else if (this.repeat_selected) {
               index = 0;
            } else {
               index = "NOT";
            }

            if (index != "NOT") {
               let selected_cover = this.coversList[index];

               this.$store.commit("playPauseMusic", [
                  true,
                  `http://localhost:3000/albums/${selected_cover.albumName}/${selected_cover.name}`,
               ]);

               this.$store.commit("changeSelectedMusic", [
                  selected_cover.name,
                  selected_cover.albumName,
                  `http://localhost:3000/albums/${selected_cover.albumName}/${selected_cover.name}`,
                  index,
               ]);
            } else {
               this.$store.commit("playPauseMusic", [false]);
            }
         };
      },
   };
</script>

<style scoped>
   *{
      color:white;
   }
   .music-controlls-container {
      background-color: #446c92;

      display: grid;
      grid-template-columns: 30% 40% 30%;
      align-items: center;
   }
   #music-name {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 20px;
      padding-right: 20px;
   }
   /* -------- */
   /* timeline */
   /* -------- */
   #music-controlls-and-timeline {
      height: 65%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 5px;
   }
   #timeline-and-music-time-numbers {
      height: 10px;
      /* width: clamp(260px, 80%, 450px); */
      width: clamp(356px, 80%, 450px);

      display: grid;
      align-items: center;
      grid-template-columns: 40px auto 40px;

      font-size: 14px;
   }
   #timeline-and-music-time-numbers span {
      text-align: center;
   }
   #timeline {
      cursor: pointer;
      height: 8px;
      background-color: grey;
      border-radius: 5px;
      overflow: hidden;
   }
   #timeline #progress {
      transition: width 0.1s ease-in-out;
      height: 100%;
      width: 0%;
      background-color: rgb(43, 43, 43);
   }
   /* --------------- */
   /* music controlls */
   /* --------------- */
   #music-controlls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
   }
   #music-controlls button {
      cursor: pointer;
      padding: 0;
      outline: 0;
      border: 0;
      background-size: 100% 100%;

      background-color: transparent;
   }
   #music-controlls button:not(:nth-child(3)) {
      width: 40px;
      height: 40px;
   }
   #previous-button {
      background-image: url("http://localhost:3000/images/previous.png");
   }
   #play-resume-button {
      background-image: url("http://localhost:3000/images/play.png");
      width: 50px;
      height: 50px;
   }
   #next-button {
      background-image: url("http://localhost:3000/images/next.png");
   }

   /* ------------------ */
   /* shuffle and repeat */
   /* ------------------ */
   #shuffle-comp,
   #repeat-comp {
      width: 30px !important;
      height: 30px !important;
   }

   #volume-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
   }

   /* ------ */
   /* volume */
   /* ------ */
   #volume-container img {
      width: 30px;
   }
   #volume-container input[type="range"] {
      width: 100px;
      height: 10px;
      overflow: hidden;
      background-color: grey;

      border-radius: 50px;

      -webkit-appearance: none;
      outline: none;
   }

   #volume-container input[type="range"]::-webkit-slider-runnable-track {
      height: 10px;
      -webkit-appearance: none;
      color: rgb(43, 43, 43);
      margin-top: -1px;
   }

   #volume-container input[type="range"]::-webkit-slider-thumb {
      width: 10px;
      -webkit-appearance: none;
      height: 10px;
      cursor: pointer;
      background: #434343;
      box-shadow: -80px 0 0 75px rgb(43, 43, 43);

      border-radius: 10px;
   }
   #volume-container input[type="range"]::-moz-range-thumb {
      width: 10px;
      height: 10px;
      background-color: #434343;
      cursor: pointer;
      outline: none;
      border: none;

      box-shadow: -80px 0 0 75px rgb(43, 43, 43);
   }

   .audio-tag {
      display: none;
   }
</style>