<template>
   <button @click="click" :style="selected_css"></button>
</template>

<script>
   export default {
      methods: {
         click() {
            this.$store.commit("SAMPLE_MUTATION", {
               key: "shuffle_selcted",
               value: this.shuffle_selcted ? false : true,
            });
         },
      },
      computed: {
         shuffle_selcted() {
            return this.$store.state.shuffle_selcted;
         },

         selected_css() {
            return {
               backgroundImage: `url("http://localhost:3000/images/${
                  this.shuffle_selcted ? "shuffle_selected.png" : "shuffle.png"
               }")`,
            };
         },
      },
   };
</script>

<style scoped>
</style>