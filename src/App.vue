<template>
  <HomeView id="app"></HomeView>
  <!--  example of router link, hide now-->
  <!--  <div v-if=true>-->
  <!--    <router-link to="/">Home</router-link>-->
  <!--    |-->
  <!--    <router-link to="/about">About</router-link>-->
  <!--  </div>-->

  <!--  <router-view/>-->

</template>

<script>
import HomeView from './components/HomeView.vue'

export default {
  name: 'App',
  components: {
    HomeView
  }
}
</script>

<style scoped>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>
<style>
html{
  background-color: #bcd6d2;;
  margin: 0;
  height: 100%;
}
body{
  background-color: #bcd6d2;;
  height: auto;
  overflow: auto;
}
</style>
