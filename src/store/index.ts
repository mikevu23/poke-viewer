// import Vue from "vue";
// import Vuex, { Store } from "vuex";
// import axios from "axios";

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {
//     pokemonData: []
//   },
//   mutations: {
//     setData(state, data){
//       state.pokemonData = data;
//     }
//   },
//   getters: {
//     getPokeData: state =>{
//       return state.pokemonData;
//     }
//   },
//   actions: {
//     async getPokemon({ commit }){
      
//       const pokeCache = await caches.open('pokeDB');

//       if (!data){
//         // const result = await axios.get(`${process.env.VUE_APP_POKE}pokemon?limit=150`);
//         const pokeCache = await caches.open('pokeDB');
        
//         const listOfPokemon: any[] = [];

//         for (let i = 0; i < result.data.results.length; i++){
//           try{
//             const test = await axios.get(result.data.results[i].url);
//             listOfPokemon.push(test.data);
//           }

//           catch(e){
//               console.error(e);
//           }
//         }

//         console.log(listOfPokemon);
//         console.log(listOfPokemon);
//         commit('setData', listOfPokemon);
//         localStorage.setItem('pokeDB', JSON.stringify(listOfPokemon));
//       }

//       else{
//         const parseData = JSON.parse(data);
//         commit('setData', parseData);
//       }
//     }
//   },
//   modules: {},
// });
