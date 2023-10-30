import { useEffect, useReducer, useState } from 'react'
import Link from 'next/link'
import { fetchPokemons } from '@/utils/api'
import {
  Container,
  Input,
  PokemonListContainer,
  PokemonCard,
  PokemonImage,
  NoMoreText,
} from '@/styles/styled'
import axios from 'axios'

interface Pokemon {
  name: string
  url: string
  sprites?: { front_default: string }
}

interface State {
  pokemons: Pokemon[]
  offset: number
  hasMore: boolean
}

type Action =
  | { type: 'LOAD_MORE' }
  | { type: 'LOAD_SUCCESS'; payload: Pokemon[] }
  | { type: 'RESET'; payload: Pokemon[] }

const initialState: State = {
  pokemons: [],
  offset: 0,
  hasMore: true,
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
      return { ...initialState, pokemons: action.payload, hasMore: action.payload.length > 0 }
    default:
      return state
  }
}

const SEARCH_DEBOUNCE_TIME = 1000

const PokemonList = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [search, setSearch] = useState('')
  const [noResults, setNoResults] = useState(false)

  const loadPokemons = async () => {
    try {
      const pokemons = await fetchPokemons(50, state.offset)
      dispatch({ type: 'LOAD_SUCCESS', payload: pokemons })
    } catch (error) {
      console.error('Error loading pokemons', error)
    }
  }

  useEffect(() => {
    if (search.trim() === '') {
      loadPokemons()
    }
  }, [state.offset, search])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, SEARCH_DEBOUNCE_TIME)

    return () => {
      clearTimeout(timer)
    }
  }, [search])

  const loadMorePokemons = () => {
    if (!state.hasMore || noResults) return

    if (typeof window !== 'undefined') {
      const scrollElement = document.scrollingElement || document.documentElement
      if (window.innerHeight + scrollElement.scrollTop + 1 >= scrollElement.scrollHeight) {
        dispatch({ type: 'LOAD_MORE' })
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(loadMorePokemons)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [loadMorePokemons])

  const handleSearch = async () => {
    if (search.trim()) {
      try {
        const pokemons = await fetchPokemons(20, 0, search.trim())
        if (pokemons.length === 0) {
          setNoResults(true)
        } else {
          setNoResults(false)
          dispatch({ type: 'RESET', payload: pokemons })
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error loading pokemons', error.response?.data)
          if (error.response?.status === 404) {
            setNoResults(true)
          }
        } else {
          console.error('Unexpected error loading pokemons', error)
        }
      }
    } else {
      // 검색어가 없을 때
      setNoResults(false) // 결과가 없는 상태를 초기화
      dispatch({ type: 'RESET', payload: [] }) // 상태를 초기화
      loadPokemons() // 첫 번째 페이지의 데이터를 로드
    }
  }

  return (
    <Container>
      <Input
        type="text"
        placeholder="Search Pokémon"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      {noResults ? (
        <div>No results found</div>
      ) : (
        <>
          <PokemonListContainer>
            {state.pokemons.map((pokemon) => (
              <Link key={pokemon.name} href={`/pokemon/${pokemon.name}`} passHref>
                <PokemonCard>
                  {pokemon.sprites && (
                    <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
                  )}
                  <div>{pokemon.name}</div>
                </PokemonCard>
              </Link>
            ))}
          </PokemonListContainer>
          {!state.hasMore && <NoMoreText>No more Pokémon</NoMoreText>}
        </>
      )}
    </Container>
  )
}

export default PokemonList
