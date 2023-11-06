import { useReducer, useCallback } from 'react'
import { fetchPokemons } from '@/utils/api'
import { Pokemon, State, Action } from '@/pages/type'
import { usePokemonFilter } from '@/hooks/userPokemonTypeFilter'
import { types } from 'util'
import { act } from 'react-dom/test-utils'
import { filterPokemon } from '@/utils/pokemonUtils'
import { type } from 'os'

const initialState = {
  pokemons: [],
  offset: 0,
  hasMore: true,
  initialLoading: true,
  selectedTypes: [],
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
        selectedTypes: state.selectedTypes,
      }
    case 'CHANGE_FILTER':
      const newSelectedTypes = state.selectedTypes.includes(action.filter)
        ? state.selectedTypes.filter((t) => t !== action.filter)
        : [...state.selectedTypes, action.filter]
      return {
        ...state, // 기존 상태를 유지합니다 (offset과 hasMore 등)
        selectedTypes: newSelectedTypes,
        pokemons: filterPokemon(state.pokemons, newSelectedTypes), // 상태에 반영됩니다.
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
      // 가져온 데이터를 현재 선택된 타입에 맞게 필터링합니다.
      const filteredPokemons = filterPokemon(pokemons, state.selectedTypes);
      dispatch({ type: 'LOAD_SUCCESS', payload: filteredPokemons })
    } catch (error) {
      console.error('Error loading pokemons', error)
    }
  }, [state.offset, state.selectedTypes])

  return { state, loadPokemons, dispatch }
}
