import React from 'react';

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
    props.nextPageUrl &&
    <div>
      <button type="button" onClick={props.showMoreHandler}>
        More
      </button>
    </div>
  );
};

export default Pager;