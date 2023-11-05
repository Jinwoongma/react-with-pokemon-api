import { PokemonDetail } from '@/utils/serverConnector/type'

export const savePokemon = (pokemon: PokemonDetail) => {
  const caughtPokemons = JSON.parse(localStorage.getItem('caughtPokemons') || '[]')
  localStorage.setItem('caughtPokemons', JSON.stringify([...caughtPokemons, pokemon]))
}

export const catchPokemon = ({
  pokemon,
  catchRate,
}: {
  pokemon: PokemonDetail
  catchRate: number
}) => {
  const catchFailed = () => {
    alert('포켓몬을 놓쳤습니다...')
    return false
  }

  if (pokemon === null || catchRate === null) return catchFailed()

  const randomChance = Math.floor(Math.random() * 100) + 1
  if (randomChance <= catchRate) {
    alert('포켓몬을 잡았습니다!')
    savePokemon(pokemon)
    return true
  }
  return catchFailed()
}

export const checkPokemon = () => {
  // LocalStorage에서 잡은 포켓몬 목록을 확인
  const caughtPokemons = JSON.parse(localStorage.getItem('caughtPokemons') || '[]').map(
    (row: { name: String }) => row.name,
  )
}

const PokemonUtils = {
  savePokemon: savePokemon,
  catchPokemon: catchPokemon,
  checkPokemon: checkPokemon,
}

export default PokemonUtils
