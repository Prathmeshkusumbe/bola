import { handleDecodedToken, handleLogOutUserFlag } from '@/app/(auth)/store/authReducer';
import { removeCookie } from '@/helper/generalHelper';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

function LogoutUser() {
  //alert('logoutuser component');
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(()=>{
    removeCookie('authToken');
    dispatch(handleDecodedToken(''));
    console.log('logged Out user');
    dispatch(handleLogOutUserFlag(0));
    router.push('/login')
  },[])

  return null
}

export default LogoutUser