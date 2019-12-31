import React from 'react';

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

export default Header;
