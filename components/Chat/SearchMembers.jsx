import { getUsersFromSearchString } from '@/app/(firebase)/firebaseChat';
import React, { useState } from 'react'

function SearchMembers() {
  const [inputValue, setInputValue] = useState('');
  const SearchUsers = (e) => {
    setInputValue(e.target.value);
    setTimeout(()=>{
      searchUserInDb(e.target.value)
    },1000)
  }
  const searchUserInDb = async (val) => {
    const res = await getUsersFromSearchString(val);
    console.log(res,'res')
  }
  return (
    <div>
      <input className='bg-transparent' onChange={(e) => SearchUsers(e)} value={inputValue} />
    </div>
  )
}

export default SearchMembers