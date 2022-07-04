export let getters = {
   albumSelectedBool(state) {
      return Object.keys(state.selectedMusic).every(
         el => (state.selectedMusic[el].toString() != "")
      )
   }
}