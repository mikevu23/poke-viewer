<template>
  <v-container>
    <v-img max-height="200" max-width="200"></v-img>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PokeApiHandler } from "@/services/poke-api-handler";

const pokeApiHandler = new PokeApiHandler();
@Component({})
export default class PokemonThumbnail extends Vue {}
</script>

<style></style>
