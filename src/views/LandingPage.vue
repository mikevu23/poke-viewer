<template>
  <v-container class="landingPage">
    <v-row>
      <v-col id="searchBar">
        <v-text-field
          v-model="searchText"
          label="Find a pokemon"
          hint="Enter a pokemon name to search for"
          @input="displaySearchPokemon(searchText)"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="pokemon in pokemonsToDisplay" v-bind:key="pokemon.id">
        <v-card class="pokemonCard" @click="showDetailPokemon(pokemon)">
          <v-card-title>
            <v-row>
              <div>#{{ pokemon.id }} {{ pokemon.name }}</div>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row class="pokemonImage">
              <v-img
                v-bind:key="pokemon.id"
                :src="pokemon.imgUrl"
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
      @input="changePage"
      @next="changePage"
    ></v-pagination>
    <v-dialog v-model="pokemonModal" @click:outside="closeModal">
      <pokemon-detail :pokemon="selectedPokemon"></pokemon-detail>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Vue } from "vue-property-decorator";
import { PokeApiHandler } from "@/services/poke-api-handler";
import PokemonDetail from "@/views/PokemonDetail.vue";
import { Pokemon } from "@/types/Pokemon";
import {
  TOTAL_NUMBER_OF_POKEMON,
  DEBOUNCE_TIMEOUT,
  POKEMON_PER_PAGE,
} from "@/helper/constants";

const pokeApiHandler = new PokeApiHandler();

const API_URL_POKE = process.env.VUE_APP_POKE;
const API_URL_POKE_IMG = process.env.VUE_APP_POKE_IMG;

@Component({ components: { PokemonDetail } })
export default class LandingPage extends Vue {
  searchText = "";
  pokemonsToDisplay: Pokemon[] = [];
  currentPage = 1;
  numberOfPokemonInTotalCurrently = TOTAL_NUMBER_OF_POKEMON;
  isUsingSearchPagination = false;
  searchBatch: Pokemon[] = [];

  selectedPokemon: unknown = {};
  pokemonModal = false;

  /**
   * Display the searched pokemon
   */
  displaySearchPokemon = _.debounce(this.searchPokemon, DEBOUNCE_TIMEOUT);

  /**
   * Close the modal and reset the data
   */
  closeModal(): void {
    this.selectedPokemon = {};
    this.pokemonModal = false;
  }

  /**
   * Load the details page for the Pokemon selected
   * @returns void
   */
  showDetailPokemon(item: Pokemon): void {
    console.log(item);
    this.selectedPokemon = item;
    this.pokemonModal = true;
    console.log(item);
  }

  /**
   * Adjusts the pagination to use the search batch or normal
   * based on the search text provided
   * @param searchText a string that represents text used to search for pokemon
   */
  switchSearch(searchText: string): void {
    // Adjust pagination to search items
    this.isUsingSearchPagination = true;

    if (searchText == "") {
      this.numberOfPokemonInTotalCurrently = TOTAL_NUMBER_OF_POKEMON;
      this.isUsingSearchPagination = false;
      this.currentPage = 1;
    }
  }

  /**
   * Get the list of Pokemons that match with the searchField
   * @param searchField a string to search pokemon with
   * @returns a void promise
   */
  async searchPokemon(searchText: string): Promise<void> {
    console.log(searchText);
    let searchedPokemon = await pokeApiHandler.search(searchText);
    let arrayOfImgUrl: Pokemon[] = [];

    searchedPokemon.forEach((obj: Pokemon) => {
      const imgUrl = `${API_URL_POKE_IMG}${obj.id}.png`;
      obj.imgUrl = imgUrl;
      // const urlObj = { id: obj.id, url: imgUrl, pokemon: obj };
      arrayOfImgUrl.push(obj);
    });

    this.searchBatch = arrayOfImgUrl;
    this.numberOfPokemonInTotalCurrently = arrayOfImgUrl.length;
    this.pokemonsToDisplay = arrayOfImgUrl.slice(0, POKEMON_PER_PAGE - 1);

    this.switchSearch(searchText);
  }

  /**
   * Change of the page of the pokemon view
   */
  async changePage(): Promise<void> {
    if (this.isUsingSearchPagination) {
      this.pokemonsToDisplay = this.searchBatch.slice(
        this.startingIndex,
        this.endingIndex
      );
    } else {
      this.pokemonsToDisplay = await this.generatePokemonCards(
        this.startingIndex,
        this.endingIndex
      );
    }
  }

  async mounted(): Promise<void> {
    this.pokemonsToDisplay = await this.generatePokemonCards(
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
  async generatePokemonCards(start: number, end: number): Promise<Pokemon[]> {
    let pokemons = [];

    for (let i = start; i < end; i++) {
      const url = pokeApiHandler.getPokeImg(i);
      let newUrl = `${API_URL_POKE}/pokemon/${i}`;
      const pokemonData = await pokeApiHandler.getPokemonMetaData(newUrl);
      // const urlObj = { id: i, url: url, pokemon: pokemonData };
      pokemonData.imgUrl = url;
      pokemons.push(pokemonData);
    }

    return pokemons;
  }

  /**
   * Calculate the number of pages needed for pagination for the list of pokemons
   * @returns a number that represents the total number of pages to changePage the list of pokemons
   */
  get pageNumbers(): number {
    let numberOfPokemons = Math.floor(
      this.numberOfPokemonInTotalCurrently / POKEMON_PER_PAGE
    );
    return numberOfPokemons;
  }

  /**
   * Compute the starting index of the list of Pokemons for pagination
   */
  get startingIndex(): number {
    return POKEMON_PER_PAGE * (this.currentPage - 1) + 1;
  }

  /**
   * Computed the last index of the list of pokemons for pagination
   * @returns the index of the last pokemon
   */
  get endingIndex(): number {
    return this.currentPage * POKEMON_PER_PAGE;
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
