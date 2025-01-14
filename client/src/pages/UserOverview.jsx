import React from 'react'
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

function UserOverview() {
  const { user } = useContext(UserContext);


  return (
    <>
      <div>UserOverview</div>
      {/* <div>Hello, {user.name}</div> */}
    </>
  )
}

export default UserOverview;
