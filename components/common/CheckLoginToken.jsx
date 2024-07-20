import React from 'react'
import { useSelector } from 'react-redux'

function CheckLoginToken() {
  const deocodedToken = useSelector((state)=>state.auth.decodedToken);

  console.log(deocodedToken);
  return (null)
}

export default CheckLoginToken