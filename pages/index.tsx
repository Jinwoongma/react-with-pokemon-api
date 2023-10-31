import { useEffect, useReducer, useState, useCallback } from 'react'
import Link from 'next/link'
import { fetchPokemons } from '@/utils/api'
import usePrevious from '@/hooks/usePrevious'
import {
  Container,
  Input,
  PokemonListContainer,
  PokemonCard,
  PokemonImage,
  CaughtTag,
} from '@/styles/styled'
import axios from 'axios'

// 포켓몬의 기본 정보를 담는 인터페이스
interface Pokemon {
  name: string
  url: string
  sprites?: { front_default: string }
}

// 리듀서의 상태를 담는 인터페이스
interface State {
  pokemons: Pokemon[]
  offset: number
  hasMore: boolean
}

// 액션 타입들을 정의하는 타입
type Action =
  | { type: 'LOAD_MORE' }
  | { type: 'LOAD_SUCCESS'; payload: Pokemon[] }
  | { type: 'RESET' }

const SEARCH_DEBOUNCE_TIME = 500 // 검색 디바운스 타임

const initialState: State = {
  pokemons: [],
  offset: 0,
  hasMore: true,
}

// 상태를 업데이트 하는 리듀서 함수
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

const PokemonList = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [search, setSearch] = useState('')
  const [noResults, setNoResults] = useState(false)
  const [caughtPokemons, setCaughtPokemons] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Pokemon[]>([])

  // 이전 검색 값을 저장
  const previousSearch = usePrevious(search)

  // 포켓몬 데이터를 불러오는 함수
  const loadPokemons = useCallback(async () => {
    try {
      const pokemons = await fetchPokemons(50, state.offset)
      dispatch({ type: 'LOAD_SUCCESS', payload: pokemons })
    } catch (error) {
      console.error('Error loading pokemons', error)
    }
  }, [state.offset])

  // localStorage에서 잡은 포켓몬 목록을 불러오는 Side Effect
  useEffect(() => {
    const caught = localStorage.getItem('caughtPokemons')
    if (caught) {
      setCaughtPokemons(JSON.parse(caught).map((row: { name: String }) => row.name))
    }
  }, [])

  // 검색어가 사라졌을 때 결과 없음 상태를 초기화하는 Side Effect
  useEffect(() => {
    if (previousSearch && previousSearch.trim() && !search.trim()) {
      console.log('!')
      setNoResults(false)
      setSearchResults([])
    }
  }, [search, previousSearch, loadPokemons])

  // 검색어가 없을 때 포켓몬 데이터를 불러오는 Side Effect
  useEffect(() => {
    if (!search.trim()) {
      loadPokemons()
    }
  }, [search, loadPokemons])

  // 검색 함수
  const handleSearch = useCallback(async () => {
    if (search.trim()) {
      try {
        const pokemons = await fetchPokemons(20, 0, search.trim())
        if (pokemons.length === 0) {
          setNoResults(true)
          setSearchResults([])
        } else {
          setNoResults(false)
          setSearchResults(pokemons)
        }
        dispatch({ type: 'RESET' })
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
      setNoResults(false)
      setSearchResults([])
    }
  }, [search])

  // 검색 디바운스를 위한 Side Effect
  // TODO: REVIEW) 디바운스 훅을 따로 커스텀훅으로 처리 가능
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        handleSearch()
      }
    }, SEARCH_DEBOUNCE_TIME)

    return () => {
      clearTimeout(timer)
    }
  }, [search, handleSearch])

  // 스크롤 이벤트로 더 많은 포켓몬을 불러오는 함수
  // TODO: REVIEW) 무한 스크롤만 처리 가능한 커스텀 훅 분리 필요
  const loadMorePokemons = useCallback(() => {
    if (!state.hasMore || noResults) return

    if (typeof window !== 'undefined') {
      const scrollElement = document.scrollingElement || document.documentElement
      if (window.innerHeight + scrollElement.scrollTop + 1 >= scrollElement.scrollHeight) {
        dispatch({ type: 'LOAD_MORE' })
      }
    }
  }, [state.hasMore, noResults])

  // 스크롤 이벤트를 추가하고 제거하는 Side Effect
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(loadMorePokemons)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [loadMorePokemons])

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
            {(searchResults.length > 0 ? searchResults : state.pokemons).map((pokemon) => (
              <Link key={pokemon.name} href={`/pokemon/${pokemon.name}`} passHref>
                <PokemonCard>
                  {caughtPokemons.includes(pokemon.name) && <CaughtTag>Caught</CaughtTag>}
                  {pokemon.sprites && (
                    <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
                  )}
                  <div>{pokemon.name}</div>
                </PokemonCard>
              </Link>
            ))}
          </PokemonListContainer>
          {!state.hasMore && <p>No more Pokemon</p>}
        </>
      )}
    </Container>
  )
}

export default PokemonList
