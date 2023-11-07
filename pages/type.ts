import { PokemonTypeEntry } from '@/utils/serverConnector/type'

export interface Pokemon {
  name: string
  url?: string
  sprites?: { front_default: string }
  types?: PokemonTypeEntry[]
}

// 리듀서의 상태를 담는 인터페이스
export interface State {
  pokemons: Pokemon[]
  offset: number
  hasMore: boolean
  selectedTypes: string[]
  isFetching: boolean
}

// 액션 타입들을 정의하는 타입
export type Action =
  | { type: 'LOAD_MORE' }
  | { type: 'LOAD_SUCCESS'; filteredPayload: Pokemon[], originalPayload: Pokemon[] }
  | { type: 'RESET' }
  | { type: 'CHANGE_FILTER'; selectedTypes: string[] }
  | { type: 'SET_IS_FETCHING'; isFetching: boolean }

export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

export const colors: { [key in PokemonType]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}

export const getTypecolor = (type: PokemonType): string => colors[type] || '#777'
