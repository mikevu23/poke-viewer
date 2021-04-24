/**
 * Poke API service
 *
 * Handles calling API to POKE APIs
 */

import axios from "axios";

export class PokeApiHandler {
  API_URL_POKE = process.env.VUE_APP_POKE;
  API_URL_POKE_IMG = process.env.VUE_APP_POKE_IMG;

  /**
   * Get the pokemon image
   * @param {number} id the integer that represents the pokemon's id from a range of 1-893
   * @returns {string} the url for the img of the pokemon based on the id given
   */
  public getPokeImg(id: number) {
    console.log("Getting poke image");

    if (isNaN(id) || id < 0 || id > 893) {
      return "";
    }

    console.log(this.API_URL_POKE_IMG);

    const pokemonImgUrl = `${this.API_URL_POKE_IMG}${id}.png`;
    console.log(pokemonImgUrl);
    return pokemonImgUrl;
  }
}
