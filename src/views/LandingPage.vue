<template>
  <v-container class="landingPage">
    <v-row>
      <v-text-field id="searchBar" v-model="searchFields"></v-text-field>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class LandingPage extends Vue {
  searchFields = "fdsa";
}
</script>

<style lang="sass"></style>
