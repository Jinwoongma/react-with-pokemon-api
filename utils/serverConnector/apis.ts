import ApiConnector from '@/utils/serverConnector/connector'
import {GetPokemonSearchType, PokemonListResponse, ServerResponse, SpriteResponse} from "@/utils/serverConnector/type";

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
