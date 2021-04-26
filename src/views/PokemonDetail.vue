<template>
  <v-card>
    <v-card-title class="titleText">
      {{ pokemon.name }}
      #{{ pokemon.id }}
    </v-card-title>
    <v-card-text id="bodyText">
      <v-img :src="pokemon.imgUrl" max-height="200" max-width="200"> </v-img>
      <h2>Type</h2>
      <li v-for="type in pokemon.types" v-bind:key="type.url">
        {{ type.type.name }}
      </li>
      <br />
      <h2>Stats</h2>
      <li v-for="stat in pokemon.stats" v-bind:key="stat.url">
        {{ stat.stat.name }} {{ stat.base_stat }}
      </li>
      <br />
      <h2>Ability</h2>
      <li v-for="ability in pokemon.abilities" v-bind:key="ability.url">
        {{ ability.ability.name }}
      </li>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class PokemonDetail extends Vue {
  @Prop() pokemon: unknown;
}
</script>

<style>
#bodyText {
  text-align: left;
}
</style>
