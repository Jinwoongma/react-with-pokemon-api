import ApiConnector from '@/utils/serverConnector/connector'

type ServerResponse<T> = Promise<{
  status: number
  data: T
}>

type GetPokemonSearchType = {
  name: string
  sprites: { front_default: string }
}

const Apis = {
  getPokemonSearch: ({ name }: { name: string }): ServerResponse<GetPokemonSearchType> => {
    return ApiConnector.get({
      url: `pokemon/${name}`,
    })
  },
  getPokemon: () => {},
}
export default Apis
