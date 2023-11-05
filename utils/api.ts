import axios from 'axios'
import { PokemonDetail, PokemonListResponse } from '@/utils/serverConnector/type'
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
        return [] // Return an empty array for all error cases
      }
    } else {
      const response = await apis.getPokemonList({ limit, offset })
      if (response.status === 200 && response.data) {
        const pokemonWithSprites = await Promise.all(
          response.data.results.map(async (pokemon: Pokemon) => {
            try {
              if (pokemon.url) {
                const detailResponse = await apis.getPokemonSprite(
                  getRelativePath(pokemon.url, API_BASE_URL),
                )
                return { ...pokemon, sprites: detailResponse.data.sprites }
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
