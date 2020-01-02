import React from 'react';

const Pager = props => {
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