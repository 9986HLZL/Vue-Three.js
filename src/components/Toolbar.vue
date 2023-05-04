<template>
  <v-app>   
    <v-app-bar
    app
    color="#2C3A47"
    dark
    >
      <v-app-bar-nav-icon @click.stop="mini = !mini" class="clickable"/>
      <v-toolbar-title
      style="width: 300px"
      class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">AnicornApp</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon v-on:click="logout" class="clickable">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
  </v-app>
</template>

<script>
export default {
  name:'Toolbar',
  methods:{
    logout(){
      this.$router.push('/layout/main',()=>{})
    }
  },
  mounted(){
    this.logout()
  }
}
</script>

<style>
.clickable{
    -webkit-app-region:no-drag;
}
</style>