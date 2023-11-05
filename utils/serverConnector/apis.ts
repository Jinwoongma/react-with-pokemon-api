import ApiConnector from '@/utils/serverConnector/connector'

type ServerResponse<T> = Promise<{
  status: number
  data: T
}>

type GetPokemonSearchType = {
  name: string
  sprites: { front_default: string }
}

type GetPokemonListType = {
  name: string
  url: string
}

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: GetPokemonListType[];
};

type SpriteResponse = {
    sprites: {
      front_default: string;
    };
}

const Apis = {
  getPokemonDetail: ({ name }: { name: string }): ServerResponse<GetPokemonSearchType> => {
    return ApiConnector.get({
      url: `pokemon/${name}`,
    })
  },
  getPokemonList: async ({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }): Promise<ServerResponse<PokemonListResponse>> => {
    return ApiConnector.get<PokemonListResponse>({
      url: `pokemon`,
      params: { limit, offset },
    })
  },
  getPokemonSprite: async (url: string): Promise<ServerResponse<SpriteResponse>> => {
    return ApiConnector.get<SpriteResponse>({
      url: url,
    })
  }
}
export default Apis
