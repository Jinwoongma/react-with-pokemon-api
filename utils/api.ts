import axios from 'axios'
import { Pokemon } from '@/pages/type'
import apis from '@/utils/serverConnector/apis'
import { getRelativePath } from '@/utils/commonUtils/getRelativePath'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchPokemons = async (limit = 20, offset = 0, search = ''): Promise<Pokemon[]> => {
  try {
    if (search) {
      try {
        const detailResponse = await apis.getPokemonDetail({ name: search })
        return [
          {
            name: detailResponse.data.name,
            sprites: detailResponse.data.sprites,
          },
        ]
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            console.error('Pokemon not found')
          } else {
            console.error('An error occurred', error)
          }
        } else {
          console.error('Non-axios error occurred', error)
        }
        return []
      }
    } else {
      const response = await apis.getPokemonList({ limit, offset })
      if (response.status === 200 && response.data) {
        const pokemonWithSprites = await Promise.all(
          response.data.results.map(async (pokemon: Pokemon) => {
            try {
              if (pokemon.url) {
                const spriteResponse = await apis.getPokemonSprite(
                  getRelativePath(pokemon.url, API_BASE_URL),
                )
                const detailResponse = await apis.getPokemonDetail({ name: pokemon.name })
                return {
                  ...pokemon,
                  sprites: spriteResponse.data.sprites,
                  types: detailResponse.data.types,
                }
              }
              return pokemon
            } catch (error) {
              console.error('Error fetching pokemon detail', error)
              return pokemon
            }
          }),
        )
        return pokemonWithSprites
      } else {
        throw new Error('Unexpected response structure')
      }
    }
  } catch (error) {
    console.error('Error fetching pokemons', error)
    throw error
  }
}

// 포켓몬 타입별로 필터링된 목록을 가져오는 함수
export const fetchFilteredPokemons = async (selectedTypes: string[]): Promise<Pokemon[]> => {
  try {
    const fetches = selectedTypes.map((typeName) => apis.getPokemonListByType({ typeName }))
    const responses = await Promise.all(fetches)

    const pokemonNames = new Set<string>()
    for (const response of responses) {
      if (response.status === 200 && response.data) {
        response.data.pokemon.forEach((pokemon) => {
          pokemonNames.add(pokemon.pokemon.name)
        })
      }
    }

    const pokemonDetailsFetches = Array.from(pokemonNames).map((name) => fetchPokemons(1, 0, name))
    const pokemonDetails = (await Promise.all(pokemonDetailsFetches)).flat()

    return pokemonDetails
  } catch (error) {
    console.error('Error fetching filtered pokemons', error)
    throw error
  }
}
