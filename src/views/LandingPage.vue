<template>
  <v-container class="landingPage">
    <v-row>
      <v-col id="searchBar">
        <v-text-field v-model="searchFields"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="imgs in listOfImgsToDisplay" v-bind:key="imgs.id">
        <v-card>
          <v-card-text>
            <v-row>
              <v-img
                v-bind:key="imgs.id"
                :src="imgs.url"
                max-height="200"
                max-width="200"
              >
              </v-img>
            </v-row>
            <v-row id="test">
              <div>1</div>
            </v-row>
            <v-row id="test">BULBA</v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Thumbnail from "@/components/PokemonThumbnail.vue";
import { PokeApiHandler } from "@/services/poke-api-handler";

const pokeApiHandler = new PokeApiHandler();

@Component({ components: { Thumbnail } })
export default class LandingPage extends Vue {
  searchFields = "";
  listOfImgsToDisplay: { id: number; url: string }[] = [];

  startIndex = 1;
  endIndex = 15;

  created(): void {
    this.listOfImgsToDisplay = this.generateUrlForImgs(
      this.startIndex,
      this.endIndex
    );

    console.log(this.listOfImgsToDisplay);
  }

  generateUrlForImgs(
    start: number,
    end: number
  ): { id: number; url: string }[] {
    let arrayOfUrls = [];

    for (let i = start; i < end; i++) {
      const url = pokeApiHandler.getPokeImg(i);
      const urlObj = { id: i, url: url };
      arrayOfUrls.push(urlObj);
    }

    return arrayOfUrls;
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
}
</style>
