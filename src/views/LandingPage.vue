<template>
  <v-container class="landingPage">
    <v-row>
      <v-col id="searchBar">
        <v-text-field
          v-model="searchText"
          label="Find a pokemon"
          hint="Enter a pokemon name to search for"
          @input="displaySearchPokemon(searchText)"
          v-on:next="nextPage"
          v-on:previous="prevPage"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="imgs in listOfImgsToDisplay" v-bind:key="imgs.id">
        <v-card class="pokemonCard" @click="showDetailPokemon(imgs)">
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
                lazy-src="../assets/whitebg.png"
                ><template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="blue lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      v-model="currentPage"
      :length="pageNumbers"
      circle
      total-visible="10"
      @input="paginate"
      @next="paginate"
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
import _ from "lodash";

import PokemonDetail from "@/views/PokemonDetail.vue";
import { TOTAL_NUMBER_OF_POKEMON, DEBOUNCE_TIMEOUT } from "@/helper/constants";

const pokeApiHandler = new PokeApiHandler();

const API_URL_POKE = process.env.VUE_APP_POKE;
const API_URL_POKE_IMG = process.env.VUE_APP_POKE_IMG;

@Component({ components: { Thumbnail, PokemonDetail } })
export default class LandingPage extends Vue {
  searchText = "";
  listOfImgsToDisplay: any = [];

  currentPage = 1;
  pokemonPerPage = 15;

  TOTAL_NUMBER = 893;
  numberOfPokemonInTotalCurrently = TOTAL_NUMBER_OF_POKEMON;
  isUsingSearchPagination = false;
  searchBatch: any = [];

  selectedPokemon: unknown = {};
  pokemonModal = false;

  /**
   * Display the searched pokemon
   */
  displaySearchPokemon = _.debounce(this.searchPokemon, DEBOUNCE_TIMEOUT);

  /**
   * Get the list of Pokemons that match with the searchField
   * @param searchField a string to search pokemon with
   * @returns a void promise
   */
  async searchPokemon(searchText: string): Promise<void> {
    console.log(searchText);
    let searchedPokemon = await pokeApiHandler.search(searchText);
    let arrayOfImgUrl: any = [];

    searchedPokemon.forEach((obj: any) => {
      const imgUrl = `${API_URL_POKE_IMG}${obj.id}.png`;
      const urlObj = { id: obj.id, url: imgUrl, pokemon: obj };
      arrayOfImgUrl.push(urlObj);
    });

    this.searchBatch = arrayOfImgUrl;
    this.numberOfPokemonInTotalCurrently = arrayOfImgUrl.length;
    this.listOfImgsToDisplay = arrayOfImgUrl.slice(0, this.pokemonPerPage - 1);

    // Adjust pagination to search items
    this.isUsingSearchPagination = true;

    if (searchText == "") {
      this.numberOfPokemonInTotalCurrently = TOTAL_NUMBER_OF_POKEMON;
      this.isUsingSearchPagination = false;
    }
  }

  nextPage() {
    console.log("next");
  }

  prevPage() {
    console.log("prev");
  }

  async paginate(): Promise<void> {
    console.log("test");
    if (this.isUsingSearchPagination) {
      this.listOfImgsToDisplay = this.searchBatch;
    } else {
      this.listOfImgsToDisplay = await this.generatePokemonCards(
        this.startingIndex,
        this.endingIndex
      );
    }
  }

  async mounted(): Promise<void> {
    this.listOfImgsToDisplay = await this.generatePokemonCards(
      this.startingIndex,
      this.endingIndex
    );
  }

  /**
   * Create pokemon cards to render
   * @param start the starting id for the pokemon to iterate to the end
   * @param end the last pokemon id
   * @returns a Promise of an object that contains the id, url and pokemon object of the pokemon
   */
  async generatePokemonCards(
    start: number,
    end: number
  ): Promise<{ id: number; url: string; pokemon: unknown }[]> {
    let arrayOfUrls = [];

    for (let i = start; i < end; i++) {
      const url = pokeApiHandler.getPokeImg(i);
      let newUrl = `${API_URL_POKE}/pokemon/${i}`;
      const pokemonData = await pokeApiHandler.getPokemonMetaData(newUrl);
      const urlObj = { id: i, url: url, pokemon: pokemonData };
      arrayOfUrls.push(urlObj);
    }

    return arrayOfUrls;
  }

  /**
   * Load the details page for the Pokemon selected
   * @returns void
   */
  showDetailPokemon(item: unknown): void {
    console.log(item);
    this.selectedPokemon = item;
    this.pokemonModal = true;
    console.log(item);
  }

  /**
   * Calculate the number of pages needed for pagination for the list of pokemons
   * @returns a number that represents the total number of pages to paginate the list of pokemons
   */
  get pageNumbers(): number {
    let numberOfPokemons = Math.ceil(this.numberOfPokemonInTotalCurrently / 15);
    return numberOfPokemons;
  }

  /**
   * Compute the starting index of the list of Pokemons for pagination
   */
  get startingIndex(): number {
    return this.pokemonPerPage * (this.currentPage - 1) + 1;
  }

  /**
   * Computed the last index of the list of pokemons for pagination
   * @returns the index of the last pokemon
   */
  get endingIndex(): number {
    return this.currentPage * this.pokemonPerPage;
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

.pokemonCard {
  max-width: 300px;
  margin: auto;
}
</style>
