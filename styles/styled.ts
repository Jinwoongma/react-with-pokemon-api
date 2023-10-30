// styles/styled.ts
import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
  text-align: center; // 컨텐츠를 가운데 정렬
  width: 100%; // 컨테이너의 너비를 100%로 설정
  box-sizing: border-box;
`

export const Input = styled.input`
  padding: 20px;
  font-size: 16px;
  margin: 0 auto 20px;
  display: block;
  width: 90%; // 검색창의 너비를 90%로 설정
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
  text-decoration: none; // 링크의 기본 스타일을 제거
  color: inherit; // 링크의 기본 색상을 제거
  width: 150px; // 카드의 너비를 150px로 설정
  height: 150px; // 카드의 높이를 150px로 설정
  box-sizing: border-box; // 패딩과 보더를 포함하여 전체 크기를 계산

  @media (max-width: 768px) {
    // 768px 이하의 화면에서는
    width: 100%; // 너비를 100%로 설정
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

export const NoMoreText = styled.p`
  text-align: center;
  font-size: 16px;
`
