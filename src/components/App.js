import React, { useState, useEffect, useReducer } from 'react';
import axios from "axios";
import Header from './Header';
import Pager from './Pager';
import { CHARACTER_PATH } from '../constants';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        loading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        isError: false,
        characters: action.payload.results,
        totalPages: action.payload.info.pages,
        nextPageUrl: action.payload.info.next,
        prevPageUrl: action.payload.info.prev
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

// Custom Hook
const useRickAndMortyApi = () => {
  const [url, setUrl] = useState(CHARACTER_PATH);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    loading: false,
    isError: false,
    characters: []
  });

  useEffect(() => {
    const getCharacterData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const response = await axios.get(`${url}`);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data
        });
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE" });
      }
    };

    getCharacterData();
  }, [url]);

  return { state, setUrl };
};

const App = () => {
  const [query, setQuery] = useState("");
  const { state, setUrl } = useRickAndMortyApi(CHARACTER_PATH);

  const submitHandler = event => {
    event.preventDefault();
    setUrl(`${CHARACTER_PATH}?name=${query}`);
  };

  const prevPageHandler = () => {
    setUrl(state.prevPageUrl);
  };

  const nextPageHandler = () => {
    setUrl(state.nextPageUrl);
  };

  const changeHandler = event => {
    setQuery(event.target.value);
  };

  return (
    <>
      <Header
        query={query}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
      />
      {state.isError && <div>Something went wrong.</div>}
      {state.loading ? (
        <div>loading...</div>
      ) : (
          <div>
            <ul>
              {state.characters.map(character => (
                <li key={character.id}>{character.name}</li>
              ))}
            </ul>
            {state.totalPages > 1 && (
              <Pager
                prevPageUrl={state.prevPageUrl}
                nextPageUrl={state.nextPageUrl}
                prevPageHandler={prevPageHandler}
                nextPageHandler={nextPageHandler}
              />
            )}
          </div>
        )}
    </>
  );
};

export default App;
