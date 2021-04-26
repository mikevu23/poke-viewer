/**
 * Poke API service
 *
 * Handles calling and caching API from POKE APIs
 */

import {
  POKEMON_PER_PAGE,
  RETRIEVAL_AMOUNT_FOR_SEARCH,
  TOTAL_NUMBER_OF_POKEMON,
} from "@/helper/constants";
import { Pokemon } from "@/types/Pokemon";

export class PokeApiHandler {
  API_URL_POKE = process.env.VUE_APP_POKE;
  API_URL_POKE_IMG = process.env.VUE_APP_POKE_IMG;

  /**
   * Get the pokemon image
   * @param {number} id the integer that represents the pokemon's id from a range of 1-893
   * @returns {string} the url for the img of the pokemon based on the id given
   */
  public getPokeImg(id: number): string {
    if (isNaN(id) || id < 0 || id > TOTAL_NUMBER_OF_POKEMON) {
      return "";
    }

    const pokemonImgUrl = `${this.API_URL_POKE_IMG}${id}.png`;
    return pokemonImgUrl;
  }

  /**
   * Get Pokemon information for the specified ID
   * @param {number} id the integer that represents the pokemon's id from a range of 1-893
   * @returns {Object} the object which represents pokemon's meta data
   */

  public async getPokemonMetaData(url: string): Promise<Pokemon> {
    const pokeCache = await caches.open("poke");
    let response = await pokeCache.match(url);

    if (response === undefined) {
      await pokeCache.add(url);
    }

    response = await pokeCache.match(url);

    try {
      response = await response?.json();
    } catch (error) {
      console.log(error);
      response = undefined;
    }

    const pokemon: Pokemon = {
      id: 0,
      imgUrl: "",
      url: "",
      name: "",
      types: [],
      stats: [],
      abilities: [],
    };

    Object.assign(pokemon, response);

    return pokemon;
  }

  /**
   * Initialize the cache
   * @returns a void promise
   */
  async initCache(): Promise<void> {
    const cachePoke = await caches.open("poke");
    for (let i = 1; i < POKEMON_PER_PAGE - 1; i++) {
      const response = await cachePoke.match(
        `${this.API_URL_POKE}pokemon/${i}/`
      );

      if (response === undefined) {
        console.log(response);
        await cachePoke.add(`${this.API_URL_POKE}pokemon/${i}/`);
      }
    }
  }

  /**
   * Search for the list of pokemon that match the provided name
   * @param name the name used to filter pokemon
   * @returns a promise of an array of pokemons
   */
  async search(name: string): Promise<Pokemon[]> {
    const cachePoke = await caches.open("pokeSearch");
    let response = await cachePoke.match(
      `${this.API_URL_POKE}pokemon?limit=893`
    );

    if (response === undefined) {
      await cachePoke.add(`${this.API_URL_POKE}pokemon?limit=893`);
    }

    response = await cachePoke.match(`${this.API_URL_POKE}pokemon?limit=893`);
    let searchCache = undefined;
    try {
      searchCache = await response?.json();
    } catch (error) {
      console.error(error);
      searchCache = undefined;
    }
    let arrayofURL = searchCache.results.filter((pokemon: Pokemon) =>
      pokemon.name.match(name)
    );
    arrayofURL = arrayofURL.slice(0, RETRIEVAL_AMOUNT_FOR_SEARCH);

    let pokemons: Pokemon[] = [];
    const promises = [];

    for (const obj of arrayofURL) {
      promises.push(this.getPokemonMetaData(obj.url));
    }

    pokemons = await Promise.all(promises);

    return pokemons;
  }
}
