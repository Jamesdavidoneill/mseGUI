<template>
  <v-app id="inspire">
    <BrokerSub></BrokerSub>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <router-link to="/">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-grid</v-icon>
            </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Switchboard</v-list-item-title>
              </v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link to="/status">
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home-analytics</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Status</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MSE GUI
        <span v-if="$route.path == '/'">- Switchboard</span>
        <span v-if="$route.path == '/status'">- Status</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import BrokerSub from './components/BrokerSub'
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
    components:{
      BrokerSub
    }
  }
</script> {
  color: blue;
}
<style>
  a{
    text-decoration: none;
  }
</style>