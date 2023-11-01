import {useState, useCallback, Dispatch, useEffect} from 'react'
import axios from 'axios'
import { fetchPokemons } from '@/utils/api'
import usePrevious from '@/hooks/usePrevious'
import {Action, Pokemon} from "@/pages/type";
export const useSearch = (dispatch: Dispatch<Action>, loadPokemons: () => Promise<void>  ) => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Pokemon[]>([])
    const [noResults, setNoResults] = useState(false);
    const previousSearch = usePrevious(search);

    // 검색 함수
    const handleSearch = useCallback(async () => {
        if (search.trim()) {
            try {
                const pokemons = await fetchPokemons(20, 0, search.trim())
                if (pokemons.length === 0) {
                    setNoResults(true)
                    setSearchResults([])
                } else {
                    setNoResults(false)
                    setSearchResults(pokemons)
                }
                dispatch({ type: 'RESET' })
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Axios error loading pokemons', error.response?.data)
                    if (error.response?.status === 404) {
                        setNoResults(true)
                    }
                } else {
                    console.error('Unexpected error loading pokemons', error)
                }
            }
        } else {
            setNoResults(false)
            setSearchResults([])
        }
    }, [search])

    useEffect(() => {
        if (previousSearch && previousSearch.trim() && !search.trim()) {
            setNoResults(false);
            setSearchResults([]);
        }
    }, [search, previousSearch]);

    useEffect(() => {
        if (!search.trim()) {
            loadPokemons();
        }
    }, [search, loadPokemons]);

    return { search, setSearch, searchResults, noResults, handleSearch };
}
