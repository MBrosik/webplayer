export let mutations = {
   SAMPLE_MUTATION(state, { key, value }) {
      state[key] = value;
   },


   // --------------------------------------
   // change albums list, selected music, 
   // -------------------------------------
   setAlbumNames(state, albumNames) {
      state.albumNames = albumNames
   },
   setCoversList(state, covers) {
      state.coversList = covers;
   },
   changeSelectedMusic(state, [songName, albumName, src, arrayIndex = state.selectedMusic.arrayIndex]) {
      state.selectedMusic.songName = songName;
      state.selectedMusic.albumName = albumName;
      state.selectedMusic.src = src;
      state.selectedMusic.arrayIndex = arrayIndex;
   },

   // -------------------
   // play music
   // -------------------
   playPauseMusic(state, [musicState = null, src = null,]) {
      state.music_on = musicState
      if (!musicState) {
         // @ts-ignore
         document.querySelector(".audio-tag").pause();
         return
      }
      if (src != null) {
         // @ts-ignore
         document.querySelector(".audio-tag").src = src;
         // @ts-ignore
         document.querySelector(".audio-tag").load();
         // @ts-ignore
         document.querySelector(".audio-tag").onloadeddata = (e) => {
            e.currentTarget.play();
         }
         return
      }
      // @ts-ignore
      document.querySelector(".audio-tag").play();
   }
}