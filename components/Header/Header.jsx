'use server '
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { decode_token } from '@/helper/generalHelper';
import { handleDecodedToken, handleLogOutUserFlag } from '@/app/(auth)/store/authReducer';
import DropDown from '../common/DropDown';
import LogoutUser from '../common/LogoutUser';
import { useRouter } from 'next/navigation';

function Header() {
  //const [pending, setPending] = useState(true);
  let [buttonName,setButtonName]=useState('');
  const decodedToken = useSelector((state) => state.auth.decodedToken);
  const dispatch = useDispatch();
  const logoutUseFlag = useSelector((state) => state.auth.logOutUserFlag);
  const [loginText, setLoginText] = useState('loading');

  const router = useRouter();
  const {pathname, query, asPath} = router;

  const notHeaderRequire = ['login'];


  console.log(logoutUseFlag, 'logoutUseFlag');

  useEffect(()=>{
    if (!decodedToken) {
      getToken();
    }
    else{
      console.log('token found')
      setButtonName('chat');
      setLoginText('Log Out');
    }

  },[decodedToken]);

  async function getToken() {
    const res = await decode_token();
    if (res.status) {
      setButtonName('chat');
      dispatch(handleDecodedToken(res.token));
      setLoginText('Log Out');
    }
    else {
      setButtonName('login');
      setLoginText('Login');
    }
  }

  function logoutUser(){
    //alert('logging out')
    dispatch(handleLogOutUserFlag(1));
  }

  const dropDownList = [
    {name:'Profile', link:'/profile', },
    {name:loginText, onClick:logoutUser},
  ];

  console.log(loginText,'loginText')

  function myAccout(){
    return(
      <>
        <DropDown dropDownList={dropDownList} name='My Account' />
      </>
    )
  }



  if (router.isReady && notHeaderRequire.includes(pathname)){

    return null;
  }

  console.log(pathname, 'pathname', notHeaderRequire.includes(pathname))

  return (
    <header className='text-lg dark:bg-slate-800 bg-white pl-4 pt-4 pb-4 pr-4 lg:pl-20 lg:pr-20'>
      <div className='max-w-[1900px] ml-auto mr-auto'>
        <div className='flex flex-wrap'>
          <div className='w-[20%]'>
            Logo
          </div>
          <div className='w-[60%]'>
            <div className='flex justify-center'>
              <NavBar />
            </div>
          </div>
          <div className='w-[20%]'>
            {myAccout()}
          </div>
        </div>
      </div>
      {logoutUseFlag ? <LogoutUser /> : ''}
    </header>
  )
}

export default Header

export async function getServerSideProps({ req, query, resolvedUrl }) {
  console.log(req, query, resolvedUrl)
  return { props: {} }
}