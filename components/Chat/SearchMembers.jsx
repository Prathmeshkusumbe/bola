import { getUsersFromSearchString } from '@/app/(firebase)/firebaseChat';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function SearchMembers(props) {

  const [inputValue, setInputValue] = useState('');
  const currUser = useSelector((state)=> state.auth.decodedToken);
  const [clearTime, setClearTime] = useState();

  const SearchUsers = (e) => {
    props.setMemberSearchInput(e.target.value);
    clearTimeout(clearTime)
    setClearTime(setTimeout(()=>{
      searchUserInDb(e.target.value)
    },1000))
  }

  const searchUserInDb = async (val) => {
    if(val===''){
      props.setUserSearchRes([]);
      return;
    }
    let res = await getUsersFromSearchString(val, currUser.username);
    console.log(res,'res')
    if(res.status){
      res = res.data.filter((ele) => ele.username !== currUser.username)
      props.setUserSearchRes(res);
    }else{
      props.setUserSearchRes([]);
    }
  }

  return (
    <div className='border-b border-slate-100 dark:border-slate-700 py-1'>
      <input placeholder="Search..." className="pl-3 w-full flex-1 block bg-transparent placeholder:font-normal placeholder:text-slate-400 py-2 focus:ring-0 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-400"
      onChange={(e) => SearchUsers(e)} value={props.memberSearchInput}/>
    </div>
  )
}

export default SearchMembers