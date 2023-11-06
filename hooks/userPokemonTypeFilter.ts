// hooks/usePokemonFilter.ts
import { Pokemon, PokemonType } from '@/pages/type'

export const usePokemonFilter = (pokemons: Pokemon[], filterType: PokemonType | null) => {
  // 선택된 Type에 따라 포켓몬을 필터링하는 로직
  return pokemons.filter(
    (pokemon) =>
      filterType === null || pokemon.types?.some((typeInfo) => typeInfo.type.name === filterType),
  )
}
