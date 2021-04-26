# poke-viewer

# Description
PokeViewer is a web application that allows users to view all the current existing Pokemon and obtain information on their stats, abilities and types.
Currently it has pagination and searching for navigation.

# Tech Stack
Vue.js, Vuetify, Typescript and Cache API.

# Notes

This application utilizes PokeApi and Pokeres.bastionbot.org for Pokemon information and Pokemon Images.

The application as of right now sometimes takes long to render the information pulled from the API.
Some performance improvements were added to ensure a smooth experience. 
In terms of searching, it has a debounce time set to 600ms and only accepts Pokemon names as of right now.
The Cache API is used on this application to cache queries to improve user experience by enabling faster load times as the application is used. 
**However a HTTPS is required to use this application as Cache api depends on it.**

This application encounters cors issues with PokeAPI. A solution was to send the request through a cors proxy. More information on how to resolve the cors issue through here https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors.

tldr regarding the solution to solve cors:
- git clone https://github.com/Rob--W/cors-anywhere.git
- npm install and then push into a different heroku app
- prefix the heroku application with your api request url
- example  https://cryptic-headland-94862.herokuapp.com/https://pokeapi.co/api/v2/

# Future improvements or add-ons
- Include more details on Pokemon detail page
- ~~Improve performance on querying for Pokemon and pagination~~ -> fixed by including promise.all when I query pokemon data

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
