import { useState, useEffect } from 'react'

export const useCaughtPokemons = () => {
  const [caughtPokemons, setCaughtPokemons] = useState<string[]>([])

  useEffect(() => {
    const caught = localStorage.getItem('caughtPokemons')
    if (caught) {
      setCaughtPokemons(JSON.parse(caught).map((row: { name: string }) => row.name))
    }
  }, [])

  return caughtPokemons
}
