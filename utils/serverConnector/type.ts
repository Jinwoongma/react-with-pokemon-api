export type ServerResponse<T> = Promise<{
  status: number
  data: T
}>

export type GetPokemonSearchType = {
  name: string
  sprites: { front_default: string }
  types: PokemonTypeEntry[]
}

export type PokemonInfo = {
  name: string
  url: string
}

export type GetPokemonListType = {
  count: number
  next: string | null
  previous: string | null
  results: PokemonInfo[]
}

export type SpriteResponse = {
  sprites: {
    front_default: string
  }
}
export type PokemonDetail = {
  name: string
  sprites: { front_default: string }
  types: PokemonTypeEntry[]
}

export type PokeymonTypeInfo = {
  name: string
  url: string
}

export type PokemonTypeEntry = {
  slot: number
  type: PokeymonTypeInfo
}

export type LanguageInfo = {
  name: string;
  url: string;
}

export type NameEntry = {
  language: LanguageInfo;
  name: string;
}

export type PokemonEntry = {
  pokemon: PokemonInfo;
  slot: number;
}

export type getPokemonListByTypeType = {
  names: NameEntry[];
  pokemon: PokemonEntry[];
}
