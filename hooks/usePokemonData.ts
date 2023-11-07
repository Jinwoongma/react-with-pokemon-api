import { useReducer, useCallback } from 'react'
import { fetchPokemons } from '@/utils/api'
import { State, Action } from '@/pages/type'
import { filterPokemon } from '@/utils/pokemonUtils'

const initialState = {
  pokemons: [],
  offset: 0,
  hasMore: true,
  initialLoading: true,
  selectedTypes: [],
  isFetching: false,
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOAD_MORE':
      return { ...state, offset: state.offset + 50 }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        pokemons: [...state.pokemons, ...action.filteredPayload],
        hasMore: action.originalPayload.length > 0,
      }
    case 'RESET':
      return {
        ...initialState,
        selectedTypes: state.selectedTypes,
      }
    case 'CHANGE_FILTER':
      return {
        ...state,
        selectedTypes: action.selectedTypes,
      }
    case 'SET_IS_FETCHING':
      return {
        ...state,
        isFetching: action.isFetching,
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
      const filteredPokemons = filterPokemon(pokemons, state.selectedTypes)
      if (pokemons.length === 50 && state.pokemons.length < 20) {
        dispatch({
          type: 'LOAD_SUCCESS',
          filteredPayload: filteredPokemons,
          originalPayload: pokemons,
        })
        dispatch({ type: 'LOAD_MORE' })
      } else {
        dispatch({
          type: 'LOAD_SUCCESS',
          filteredPayload: filteredPokemons,
          originalPayload: pokemons,
        })
      }
      console.log(filteredPokemons)
      dispatch({ type: 'SET_IS_FETCHING', isFetching: false })
    } catch (error) {
      console.error('Error loading pokemons', error)
    }
  }, [state.offset, state.pokemons.length, state.selectedTypes])

  return { state, loadPokemons, dispatch }
}
