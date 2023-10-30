import axios from 'axios'

const API_BASE_URL = 'https://pokeapi.co/api/v2'

interface Pokemon {
  name: string
  url: string
  sprites?: { front_default: string }
}

interface PokemonDetail {
  name: string
  sprites: { front_default: string }
}

interface PokemonListResponse {
  results: Pokemon[]
}

export const fetchPokemons = async (limit = 20, offset = 0, search = ''): Promise<Pokemon[]> => {
  try {
    if (search) {
      try {
        const detailResponse = await axios.get<PokemonDetail>(`${API_BASE_URL}/pokemon/${search}`);
        return [{ name: search, url: detailResponse.data.sprites.front_default, sprites: detailResponse.data.sprites }];
      } catch (error) {
        console.error('Pokemon not found', error);
        return []; // 포켓몬이 없을 경우 빈 배열 반환
      }
    } else {
      const response = await axios.get<PokemonListResponse>(`${API_BASE_URL}/pokemon`, {
        params: { limit, offset },
      });
      const pokemonList = response.data.results;
      const pokemonWithSprites = await Promise.all(
          pokemonList.map(async (pokemon) => {
            try {
              const detailResponse = await axios.get<PokemonDetail>(pokemon.url);
              return { ...pokemon, sprites: detailResponse.data.sprites };
            } catch (error) {
              console.error('Error fetching pokemon detail', error);
              return pokemon;
            }
          }),
      );
      return pokemonWithSprites;
    }
  } catch (error) {
    console.error('Error fetching pokemons', error);
    throw error;
  }
};

export const fetchPokemonDetail = async (name: string): Promise<PokemonDetail> => {
  try {
    const response = await axios.get<PokemonDetail>(`${API_BASE_URL}/pokemon/${name}`)
    return response.data
  } catch (error) {
    console.error('Error fetching pokemon detail', error)
    throw error
  }
}
