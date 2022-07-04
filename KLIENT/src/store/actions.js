import axios from 'axios'

export let actions = {
   // -------------------------
   // Receive data from data
   // -------------------------
   getFirstInfo({ commit }) {
      axios.post('http://localhost:3000/getAlbumInfo',
         JSON.stringify({
            action: "first"
         })
      )
         .then(response => {
            commit('setAlbumNames', response.data.albumNames)
            commit('setCoversList', response.data.covers)
         })
   },
   getNextInfo({ commit }, albumName) {
      axios.post('http://localhost:3000/getAlbumInfo',
         JSON.stringify({
            action: "next",
            albumName: albumName
         })
      )
         .then(response => {
            commit('setCoversList', response.data.covers)
         })
   },

   // ------------------------
   // playlist
   // ------------------------
   addToPlaylist({ commit }, { albumName, name, size }) {
      commit
      axios.post('http://localhost:3000/addToDataBase', JSON.stringify({ albumName, name, size }))
         .then(res => {
            if (res.data.action == true) {
               alert("Utwór został dodany do playlisty")
            }
            else {
               alert("Utwór już istnieje")
            }
         })
   },
   removeFromPlaylist({ commit }, { albumName, name, size }) {
      axios.post('http://localhost:3000/removeFromDataBase', JSON.stringify({ albumName, name, size }))
         .then(res => {
            alert("Utwór został usunięty z playlisty");
            commit("setCoversList", res.data);
         })
   },
   getPlaylist({ commit }) {
      axios.post('http://localhost:3000/findAllInDataBase')
         .then(response => {
            commit("setCoversList", response.data)
         })
   }
}