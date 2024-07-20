"use client";
import { decode_token } from '@/helper/generalHelper';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleDecodedToken } from '../(auth)/store/authReducer';

export default function RootLayout({children}) {

  const decodedToken = useSelector((state) => state.auth.decodedToken);
  const router = useRouter();
  const [showChild, setShowChild] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!decodedToken) {
      getToken();
    } else {
      setShowChild(1);
    }
  }, []);

  async function getToken() {
    const res = await decode_token();
    if (res.status) {
      setShowChild(1);
      dispatch(handleDecodedToken(res.token));
    }
    else {
      //alert('redirecting to login from chat layout')
      setShowChild(0);
      router.push('/login')
    }
  }
  return (
    <div className='page-content page-min-height'>
      { showChild ? children : null }
    </div>
  )
}

