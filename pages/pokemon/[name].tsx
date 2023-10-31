// pages/pokemon/[name].tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchPokemonDetail } from '@/utils/api'
import {
  Container,
  CatchButton,
  DetailContainer,
  PokemonName,
  PokemonDetailImage,
} from '@/styles/styled'

interface PokemonDetail {
  name: string
  sprites: { front_default: string }
}

const PokemonDetailPage = () => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [catchRate, setCatchRate] = useState<number | null>(null)
  const [isCaught, setIsCaught] = useState<boolean>(false)
  const router = useRouter()
  const { name } = router.query

  useEffect(() => {
    const loadPokemonDetail = async () => {
      if (typeof name === 'string') {
        try {
          const data = await fetchPokemonDetail(name)
          setPokemon(data)
          // 포켓몬 로드 시 랜덤 포획 확률 설정
          const randomCatchRate = Math.floor(Math.random() * 100) + 1
          setCatchRate(randomCatchRate)

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
    if (pokemon && catchRate !== null) {
      const randomChance = Math.floor(Math.random() * 100) + 1
      if (randomChance <= catchRate) {
        alert('포켓몬을 잡았습니다!')
        savePokemon(pokemon)
      } else {
        alert('포켓몬을 놓쳤습니다...')
      }
    }
  }

  const savePokemon = (pokemon: PokemonDetail) => {
    const caughtPokemons = JSON.parse(localStorage.getItem('caughtPokemons') || '[]')
    localStorage.setItem('caughtPokemons', JSON.stringify([...caughtPokemons, pokemon]))
    setIsCaught(true)
  }

  if (!pokemon) return <Container>Loading...</Container>

  return (
    <DetailContainer>
      <PokemonName>{pokemon.name}</PokemonName>
      <PokemonDetailImage src={pokemon.sprites.front_default} alt={pokemon.name} />
      {isCaught ? (
        <div>이미 잡은 포켓몬입니다.</div>
      ) : (
        <>
          <p>포획 확률: {catchRate}%</p>
          <CatchButton onClick={catchPokemon}>잡기</CatchButton>
        </>
      )}
    </DetailContainer>
  )
}

export default PokemonDetailPage
