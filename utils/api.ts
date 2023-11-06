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
            // types: detailResponse.data.types
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
        return [] // Return an empty array for all error cases
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
        // console.log(pokemonWithSprites)
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
