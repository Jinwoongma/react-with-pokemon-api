import { useReducer, useCallback } from 'react'
import { fetchPokemons } from '@/utils/api'
import { Pokemon, State, Action } from '@/pages/type'

const initialState = {
  pokemons: [],
  offset: 0,
  hasMore: true,
  initialLoading: true,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_MORE':
      return { ...state, offset: state.offset + 50 }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        pokemons: [...state.pokemons, ...action.payload],
        hasMore: action.payload.length > 0,
      }
    case 'RESET':
      return {
        ...initialState,
      }
    default:
      return state
  }
}

export const usePokemonData = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // 포켓몬 데이터를 불러오는 함수
  const loadPokemons = useCallback(async () => {
    try {
      const pokemons = await fetchPokemons(50, state.offset)
      dispatch({ type: 'LOAD_SUCCESS', payload: pokemons })
    } catch (error) {
      console.error('Error loading pokemons', error)
    }
  }, [state.offset])

  return { state, loadPokemons, dispatch }
}
