/**
 * Poke API service
 *
 * Handles calling and caching API from POKE APIs
 */

import {RETRIEVAL_AMOUNT_FOR_SEARCH} from "@/helper/constants"

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

  public async getPokemonMetaData(url: string) : Promise<unknown>{

    // let parsedData = [];
    // let data = localStorage.getItem(`pokeDB2`);
    // this.initCache();
    const pokeCache = await caches.open('poke');
    let response = await pokeCache.match(url);

    if (response === undefined){
      await pokeCache.add(url);
    }

    response = await pokeCache.match(url);
    response = await response?.json();

    return response;



  //   if (!data){
  //     await this.initCache();
  //     data = localStorage.getItem('pokeDB2');
  //     parsedData = JSON.parse(data);
  //   }

  //   else{
  //     parsedData = JSON.parse(data);
  //   }

  //   const foundPokemon = parsedData.find((e: any) => e.id === id);
  //   if (foundPokemon === undefined){
  //     try{
  //       const result = await axios.get(`${this.API_URL_POKE}/pokemon/${id}/`);
  //       parsedData.push(result.data);
  //       console.log(parsedData);
  //       localStorage.setItem(`pokeDB2`, JSON.stringify(parsedData));
  //       return result.data;
  //   }

  //   catch(e){
  //       console.error(e);
  //       return {};
  //   }
  // }

  // return foundPokemon;

}


async initCache(){
  // const data = localStorage.getItem('pokeDB2');
  // const pokemons = [];
  // if (!data){
  //   for (let i = 1; i < 20; i++){
  //     const result = await axios.get(`${this.API_URL_POKE}/pokemon/${i}/`);
  //     pokemons.push(result.data);
  //   }

  //   localStorage.setItem('pokeDB2', JSON.stringify(pokemons));
  // }
  
  const cachePoke = await caches.open('poke');
    for (let i = 1; i < 14; i++){
      const response = await cachePoke.match(`${this.API_URL_POKE}/pokemon/${i}/`);
      
      if (response === undefined){
        console.log(response)
        cachePoke.add(`${this.API_URL_POKE}/pokemon/${i}/`);
      }
    }
}

async search(name: string){
  const cachePoke = await caches.open('pokeSearch');
  const response = await cachePoke.match(`${this.API_URL_POKE}pokemon?limit=893`);
  if (response === undefined){
    cachePoke.add(`${this.API_URL_POKE}pokemon?limit=893`);
  }

  const searchDB = await response?.json();
  let arrayofURL = searchDB.results.filter((pokemon: any) => pokemon.name.match(name));
  arrayofURL = arrayofURL.slice(0, RETRIEVAL_AMOUNT_FOR_SEARCH);
  
  let pokemons: any = [];
  const promises = [];

  for (const obj of arrayofURL){
    promises.push(this.getPokemonMetaData(obj.url));
  }

  pokemons = await Promise.all(promises);

  console.log(pokemons);
  return pokemons;
}
  
}

// public async searchForPokemon(name: string): Promise<unknown>{

//   let data = localStorage.getItem('pokeDB');

//   if (!data){
//     try{
//       const result = await axios.get(`${this.API_URL_POKE}pokemon?limit=1000`);
//         data = result.data;
//         console.log(data);
//         localStorage.setItem(`pokeDB`, JSON.stringify(result.data));
//         data = localStorage.getItem('pokeDB');
//     }
//     catch(e){
//       console.error(e);
//       return {};
//     }
//   } 
//   const pokemons: any = [];
//   const parsedData = JSON.parse(data);

//   const arrayOfUrls = this.search(parsedData.results, name);
//   console.log(arrayOfUrls);
//   for (let i = 0; i < arrayOfUrls.length; i++){
//     const result = await axios.get(arrayOfUrls[i].url).then(r => pokemons.push(r)).catch(error => console.error(error));
//   }
//   return pokemons;
//   }

//   search(db: any, name: string): any{
//     const searchAmount = 14;
//     const arrayOfUrls = db.filter((pokemon: any) => pokemon.name.match(name));
//     return arrayOfUrls.slice(0, 14);
//   }

// }
