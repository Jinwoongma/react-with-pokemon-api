import { useEffect, useReducer, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePokemonData } from '@/hooks/usePokemonData'
import {
  Container,
  Input,
  PokemonListContainer,
  PokemonCard,
  PokemonImage,
  CaughtTag,
} from '@/styles/styled'
import axios from 'axios'
import { useSearch } from '@/hooks/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfinityScroll'
import useDebounce from '@/hooks/useDebounce'
import { useCaughtPokemons } from '@/hooks/useCaughtPokemons'

const SEARCH_DEBOUNCE_TIME = 500 // 검색 디바운스 타임

const PokemonList = () => {
  const { state, loadPokemons, dispatch } = usePokemonData()
  const { search, setSearch, noResults, handleSearch, searchResults } = useSearch(
    dispatch,
    loadPokemons,
  )
  const caughtPokemons = useCaughtPokemons()
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_TIME)

  useEffect(() => {
    if (debouncedSearch.trim()) {
      handleSearch()
    }
  }, [debouncedSearch, handleSearch])

  const observerElementRef = useInfiniteScroll({
    loadMore: () => dispatch({ type: 'LOAD_MORE' }),
    hasMore: state.hasMore,
  })

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
          {state.hasMore && <div ref={observerElementRef} style={{ height: '10px' }} />}
        </>
      )}
    </Container>
  )
}

export default PokemonList
