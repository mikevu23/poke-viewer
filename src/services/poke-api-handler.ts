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

    if (isNaN(id) || id < 0 || id > 893) {
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

  public async getPokemonMetaData(id: number) : Promise<unknown>{

    if (isNaN(id) || id < 0 || id > 893) {
        return "";
    }

    let data = localStorage.getItem(`${this.API_URL_POKE}/pokemon/${id}/`);
    console.log("test");

    if (!data){
        try{
            const result = await axios.get(`${this.API_URL_POKE}/pokemon/${id}/`);
            data = result.data;
            console.log(data);
            localStorage.setItem(`${this.API_URL_POKE}/pokemon/${id}/`, result.data);
            return data;
        }

        catch(e){
            console.error(e);
            return {};
        }

    }

    return data;
  }

  public async
  
}
