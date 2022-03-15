import React, { useContext, useEffect, useReducer } from 'react'

import {
  SET_LOADING,
  SET_NEWS,
  REMOVE_NEWS,
  HANDLE_PAGE,
  HANDLE_SEARCH,
} from './actions'
import reducer from './reducer'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?'

const initialState = {
  isLoading: true,
  hits: [],
  query: 'react',
  page: 0,
  nbPages: 0,
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchStories = async (url) => {
    dispatch({ type: SET_LOADING })
    try {
      const response = await fetch(url)
      const data = await response.json()
      dispatch({
        type: SET_NEWS,
        payload: { hits: data.hits, nbPages: data.nbPages },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const removeNews = (id) => {
    dispatch({ type: REMOVE_NEWS, payload: id })
  }
  const handleSearch = (query) => {
    dispatch({ type: HANDLE_SEARCH, payload: query })
  }
  const handlePage = (value) => {
    dispatch({ type: HANDLE_PAGE, payload: value })
  }
  useEffect(() => {
    fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`)
  }, [state.query, state.page])

  return (
    <AppContext.Provider
      value={{ ...state, removeNews, handleSearch, handlePage }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
