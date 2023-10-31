export interface Pokemon {
  name: string
  url: string
  sprites?: { front_default: string }
}

// 리듀서의 상태를 담는 인터페이스
export interface State {
  pokemons: Pokemon[]
  offset: number
  hasMore: boolean
}

// 액션 타입들을 정의하는 타입
export type Action =
  | { type: 'LOAD_MORE' }
  | { type: 'LOAD_SUCCESS'; payload: Pokemon[] }
  | { type: 'RESET' }
