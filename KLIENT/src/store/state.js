export let state = {
   albumNames: [],
   coversList: [],
   selectedMusic: {
      songName: "",
      albumName: "",
      src: "",
      arrayIndex: "",
   },
   music_on: false,
   music_duration: 0,
   music_current_time: 0,
   selected_custom_album: false,

   // shuffle and repeat
   shuffle_selcted: false,
   repeat_selected: false
}