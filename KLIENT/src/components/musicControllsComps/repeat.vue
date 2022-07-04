<template>
   <button @click="click" :style="selected_css"></button>
</template>

<script>
   export default {
      methods: {
         click() {
            this.$store.commit("SAMPLE_MUTATION", {
               key: "repeat_selected",
               value: this.repeat_selected ? false : true,
            });
         },
      },
      computed: {
         repeat_selected() {
            return this.$store.state.repeat_selected;
         },
         selected_css() {
            return {
               backgroundImage: `url("http://localhost:3000/images/${
                  this.repeat_selected ? "repeat_selected.png" : "repeat.png"
               }")`,
            };
         },
      },
   };
</script>

<style scoped>
</style>