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
    PokemonTypeWrapper,
    PokemonTypeBadge,
    PokemonNameTag, FilterWrapper,
} from '@/styles/styled'
import { useSearch } from '@/hooks/useSearch'
import { useInfiniteScroll } from '@/hooks/useInfinityScroll'
import useDebounce from '@/hooks/useDebounce'
import { useCaughtPokemons } from '@/hooks/useCaughtPokemons'
import { PokemonType, colors } from '@/pages/type'

const SEARCH_DEBOUNCE_TIME = 500 // 검색 디바운스 타임

const PokemonList = () => {
  const { state, loadPokemons, dispatch } = usePokemonData()
  const { search, setSearch, noResults, handleSearch, searchResults } = useSearch(
    dispatch,
    loadPokemons,
  )
  const caughtPokemons = useCaughtPokemons()
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_TIME)

  const changeFilter = useCallback(
    (filterType: string) => {
      const newSelectedTypes = state.selectedTypes.includes(filterType)
        ? state.selectedTypes.filter((type) => type !== filterType)
        : [...state.selectedTypes, filterType]

      dispatch({ type: 'RESET' })
      dispatch({ type: 'CHANGE_FILTER', selectedTypes: newSelectedTypes })
    },
    [dispatch, state.selectedTypes],
  )

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
      <FilterWrapper>
        {Object.keys(colors).map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              checked={state.selectedTypes.includes(type)}
              onChange={() => changeFilter(type)}
            />
            {type}
          </label>
        ))}
      </FilterWrapper>
      {noResults ? (
        <div>No results found</div>
      ) : (
        <>
          <PokemonListContainer>
            {(searchResults.length > 0 ? searchResults : state.pokemons).map((pokemon) => (
              <Link
                key={pokemon.name}
                href={`/pokemon/${pokemon.name}`}
                style={{ textDecoration: 'none' }}
                passHref>
                <PokemonCard>
                  {caughtPokemons.includes(pokemon.name) && <CaughtTag>Caught</CaughtTag>}
                  {pokemon.sprites && (
                    <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} />
                  )}
                  <PokemonNameTag>{pokemon.name}</PokemonNameTag>
                  <PokemonTypeWrapper>
                    {pokemon.types &&
                      pokemon.types.map((typeInfo) => (
                        <PokemonTypeBadge
                          key={typeInfo.type.name}
                          type={typeInfo.type.name as PokemonType}>
                          {typeInfo.type.name}{' '}
                        </PokemonTypeBadge>
                      ))}
                  </PokemonTypeWrapper>
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
