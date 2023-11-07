import ApiConnector from '@/utils/serverConnector/connector'
import {
  GetPokemonSearchType,
  GetPokemonListType,
  ServerResponse,
  SpriteResponse,
  getPokemonListByTypeType,
} from '@/utils/serverConnector/type'

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
  }): Promise<ServerResponse<GetPokemonListType>> => {
    return ApiConnector.get<GetPokemonListType>({
      url: `pokemon`,
      params: { limit, offset },
    })
  },

  getPokemonListByType: async ({
    typeName,
  }: {
    typeName: string
  }): Promise<ServerResponse<getPokemonListByTypeType>> => {
    return ApiConnector.get<getPokemonListByTypeType>({
      url: `type/${typeName}`,
    })
  },
  
  getPokemonSprite: async (url: string): Promise<ServerResponse<SpriteResponse>> => {
    return ApiConnector.get<SpriteResponse>({
      url: url,
    })
  },
}
export default Apis
