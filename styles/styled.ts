import styled from 'styled-components'
import { getTypecolor, PokemonType } from '@/pages/type'

export const Container = styled.div`
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
`

export const Input = styled.input`
  padding: 20px;
  font-size: 16px;
  margin: 0 auto 20px;
  display: block;
  width: 90%;
`

export const PokemonListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 90%;
  margin: 0 auto;
`

export const PokemonCard = styled.div`
  padding: 20px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: block;
  text-align: center;
  text-decoration: none;
  color: inherit;
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`

export const PokemonImage = styled.img`
  max-width: 100px;
  max-height: 100px;
`

export const LoadMoreButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
`

export const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // 요소들을 가운데 정렬
  padding: 20px;
`

export const PokemonDetailImage = styled.img`
  width: 200px;
`

export const PokemonName = styled.h1`
  font-size: 24px;
`

export const CatchButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
`

export const CaughtTag = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  padding: 5px;
  font-size: 12px;
  border-radius: 0 5px 0 0;
`
export const PokemonNameTag = styled.div`
  margin-bottom: 15px;
  color: black;
  font-weight: 600;
`
export const PokemonTypeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
`

export const PokemonTypeBadge = styled.span<{ type: PokemonType }>`
  background-color: ${({ type }) => getTypecolor(type)};
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 0.8em;
  color: white;
`
