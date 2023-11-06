import { PokemonTypeResponse } from '@/pages/type'

export type ServerResponse<T> = Promise<{
  status: number
  data: T
}>

export type GetPokemonSearchType = {
  name: string
  sprites: { front_default: string }
  types: PokemonTypeResponse[]
}

export type GetPokemonListType = {
  name: string
  url: string
}

export type PokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: GetPokemonListType[]
}

export type SpriteResponse = {
  sprites: {
    front_default: string
  }
}
export type PokemonDetail = {
  name: string
  sprites: { front_default: string }
  types: PokemonTypeResponse[]
}
