// pages/pokemon/[name].tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchPokemonDetail } from '@/utils/api'
import { Container } from '@/styles/styled'

interface PokemonDetail {
  name: string
  sprites: { front_default: string }
}

const PokemonDetailPage = () => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const router = useRouter()
  const { name } = router.query

  useEffect(() => {
    const loadPokemonDetail = async () => {
      if (typeof name === 'string') {
        try {
          const data = await fetchPokemonDetail(name)
          setPokemon(data)
        } catch (error) {
          console.error('Error loading pokemon detail', error)
        }
      }
    }

    loadPokemonDetail()
  }, [name])

  if (!pokemon) return <Container>Loading...</Container>

  return (
    <Container>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
    </Container>
  )
}

export default PokemonDetailPage
