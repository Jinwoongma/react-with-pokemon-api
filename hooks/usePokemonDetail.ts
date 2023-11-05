import { useEffect, useMemo, useState } from 'react'
import { PokemonDetail } from '@/utils/serverConnector/type'
import apis from '@/utils/serverConnector/apis'
import PokemonUtils from '@/utils/pokemonUtils'

const usePokemonDetail = ({ name }: { name: string | string[] | undefined }) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [isCaught, setIsCaught] = useState<boolean>(false)
  const catchRate = useMemo(() => {
    return Math.floor(Math.random() * 100) + 1
  }, [])

  useEffect(() => {
    const loadPokemonDetail = async () => {
      if (typeof name === 'string') {
        try {
          const data = await apis.getPokemonDetail({ name })

          setPokemon(data.data)

          // LocalStorage에서 잡은 포켓몬 목록을 확인
          const caughtPokemons = JSON.parse(localStorage.getItem('caughtPokemons') || '[]').map(
            (row: { name: String }) => row.name,
          )
          if (caughtPokemons.includes(name)) {
            setIsCaught(true)
          }
        } catch (error) {
          console.error('Error loading pokemon detail', error)
        }
      }
    }

    loadPokemonDetail()
  }, [name])

  const catchPokemon = () => {
    if (!!pokemon) {
      setIsCaught(PokemonUtils.catchPokemon({ pokemon, catchRate }))
    }
  }

  return {
    pokemon,
    isCaught,
    catchRate,
    catchPokemon,
  }
}

export default usePokemonDetail
