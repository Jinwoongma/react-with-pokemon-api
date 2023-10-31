// pages/pokemon/[name].tsx
import { useRouter } from 'next/router'
import {
  Container,
  CatchButton,
  DetailContainer,
  PokemonName,
  PokemonDetailImage,
} from '@/styles/styled'
import usePokemonDetail from '@/hooks/usePokemonDetail'

const PokemonDetailPage = () => {
  const router = useRouter()
  const { name } = router.query

  const { pokemon, isCaught, catchRate, catchPokemon } = usePokemonDetail({ name })

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
