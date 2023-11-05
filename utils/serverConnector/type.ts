import {Pokemon} from "@/pages/type";

export type PokemonDetail = {
  name: string
  sprites: { front_default: string }
}

export type PokemonListResponse = {
  results: Pokemon[]
}