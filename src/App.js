import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from "react-dom";
import axios from "axios";

import './App.css';

const PATH_BASE = 'https://rickandmortyapi.com/api';
const PATH_RESOURCE = '/character/';
const CHARACTER_PATH = `${PATH_BASE}${PATH_RESOURCE}`;

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

const Header = props => {
  return (
    <header>
      <form onSubmit={props.submitHandler}>
        <input type="text" value={props.query} onChange={props.changeHandler} />
        <button type="submit">Search</button>
      </form>
    </header>
  );
};

const Pager = props => {
  // ex url: "https://rickandmortyapi.com/api/character/?page=2"
  const getPageNum = url => {
    const numberString = url.split("page=")[1];
    return parseInt(numberString, 10);
  };

  const getCurrentPageNum = () => {
    return props.nextPageUrl
      ? getPageNum(props.nextPageUrl) - 1
      : getPageNum(props.prevPageUrl) + 1;
  };

  return (
    <div>
      {props.prevPageUrl && (
        <button type="button" onClick={props.prevPageHandler}>
          Prev
        </button>
      )}
      <span>{getCurrentPageNum()}</span>
      {props.nextPageUrl && (
        <button type="button" onClick={props.nextPageHandler}>
          Next
        </button>
      )}
    </div>
  );
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
