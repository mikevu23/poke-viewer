export interface Pokemon {
    id: number;
    imgUrl: string;
    url: string;
    name: string;
    types: {name: string; url: string}[]
    stats: {name: string, base_stat: number, url: string}[]
    abilities: {name: string; url: string}[]
}