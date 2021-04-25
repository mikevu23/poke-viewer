<template>
  <v-container class="landingPage">
    <v-row>
      <v-col id="searchBar">
        <v-text-field
          v-model="searchFields"
          label="Find a pokemon"
          hint="Enter a pokemon name or a id"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="imgs in listOfImgsToDisplay" v-bind:key="imgs.id">
        <v-card @click="showDetailPokemon(imgs)">
          <v-card-title>
            <v-row>
              <div>#{{ imgs.pokemon.id }} {{ imgs.pokemon.name }}</div>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row class="pokemonImage">
              <v-img
                v-bind:key="imgs.id"
                :src="imgs.url"
                max-height="200"
                max-width="200"
              >
              </v-img>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      v-model="pageNumber"
      :length="5"
      circle
      @input="test"
    ></v-pagination>
    <v-dialog v-model="pokemonModal">
      <pokemon-detail :pokemon="selectedPokemon"></pokemon-detail>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Thumbnail from "@/components/PokemonThumbnail.vue";
import { PokeApiHandler } from "@/services/poke-api-handler";

import PokemonDetail from "@/views/PokemonDetail.vue";

const pokeApiHandler = new PokeApiHandler();

@Component({ components: { Thumbnail, PokemonDetail } })
export default class LandingPage extends Vue {
  searchFields = "";
  listOfImgsToDisplay: unknown = [];

  pageNumber = 1;
  pokemonPerPage = 15;

  selectedPokemon: unknown = {};
  pokemonModal = false;

  async test(): Promise<void> {
    this.listOfImgsToDisplay = await this.generatePokemonCard(
      this.startingIndex,
      this.endingIndex
    );

    console.log(this.listOfImgsToDisplay);
  }

  async mounted(): Promise<void> {
    this.listOfImgsToDisplay = await this.generatePokemonCard(
      this.startingIndex,
      this.endingIndex
    );

    console.log(this.listOfImgsToDisplay);
  }

  async generatePokemonCard(
    start: number,
    end: number
  ): Promise<{ id: number; url: string; pokemon: unknown }[]> {
    let arrayOfUrls = [];

    for (let i = start; i < end; i++) {
      const url = pokeApiHandler.getPokeImg(i);
      const pokemonData = await pokeApiHandler.getPokemonMetaData(i);
      const urlObj = { id: i, url: url, pokemon: pokemonData };
      arrayOfUrls.push(urlObj);
    }

    return arrayOfUrls;
  }

  async fetchData(): Promise<unknown> {
    const result = await pokeApiHandler.getPokemonMetaData(1);
    console.log(result);
    return result;
  }

  showDetailPokemon(item: unknown) {
    this.selectedPokemon = item;
    this.pokemonModal = true;
    console.log(item);
  }

  searchPokemon() {
    console.log("");
  }

  get startingIndex(): number {
    return 15 * (this.pageNumber - 1) + 1;
  }

  get endingIndex(): number {
    return this.pageNumber * 15;
  }
}
</script>

<style>
#searchBar {
  text-align: center;
}

.pokemon-card-title {
  text-align: right;
}

#test {
  justify-content: center;
  color: blue;
}

.pokemonImage {
  display: flex;
  justify-content: center;
}
</style>
