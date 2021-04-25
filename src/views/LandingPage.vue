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
    ></v-pagination>
    <v-dialog v-model="pokemonModal">
      <pokemon-detail :pokemon="selectedPokemon"></pokemon-detail>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Thumbnail from "@/components/PokemonThumbnail.vue";
import { PokeApiHandler } from "@/services/poke-api-handler";

import PokemonDetail from "@/views/PokemonDetail.vue";

const pokeApiHandler = new PokeApiHandler();

const API_URL_POKE = process.env.VUE_APP_POKE;
const API_URL_POKE_IMG = process.env.VUE_APP_POKE_IMG;

@Component({ components: { Thumbnail, PokemonDetail } })
export default class LandingPage extends Vue {
  searchFields = "";
  listOfImgsToDisplay: any = [];

  currentPage = 1;
  pokemonPerPage = 15;

  numberOfPokemonInTotalCurrently = 893;

  selectedPokemon: unknown = {};
  pokemonModal = false;

  @Watch("searchFields")
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async searchPokemon() {
    let searchPokemon = await pokeApiHandler.search(this.searchFields);
    let arrayOfImgUrl: any = [];
    searchPokemon.forEach((obj: any) => {
      const imgUrl = `${API_URL_POKE_IMG}/${obj.id}.png`;
      const urlObj = { id: obj.id, url: imgUrl, pokemon: obj };
      arrayOfImgUrl.push(urlObj);
    });
    console.log(this.listOfImgsToDisplay);
    this.listOfImgsToDisplay = arrayOfImgUrl;
    this.numberOfPokemonInTotalCurrently = this.listOfImgsToDisplay.length;

    if (this.searchFields == "") {
      this.numberOfPokemonInTotalCurrently = 893;
    }
  }

  // get pokeData(): any {
  //   return this.$store.getters.getPokeData;
  // }

  async paginate(): Promise<void> {
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
      let newUrl = `${API_URL_POKE}/pokemon/${i}`;
      const pokemonData = await pokeApiHandler.getPokemonMetaData(newUrl);
      const urlObj = { id: i, url: url, pokemon: pokemonData };
      arrayOfUrls.push(urlObj);
    }

    return arrayOfUrls;
  }

  showDetailPokemon(item: unknown): void {
    this.selectedPokemon = item;
    this.pokemonModal = true;
    console.log(item);
  }

  get pageNumbers(): number {
    let numberOfPokemons = Math.ceil(this.numberOfPokemonInTotalCurrently / 15);
    console.log(numberOfPokemons);
    return numberOfPokemons;
  }

  get startingIndex(): number {
    return 15 * (this.currentPage - 1) + 1;
  }

  get endingIndex(): number {
    return this.currentPage * 15;
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
  max-width: 256px;
}
</style>
