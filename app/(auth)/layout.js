"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { decode_token } from "@/helper/generalHelper";
import { handleDecodedToken } from "./store/authReducer";


export default function AuthLayout({ children }) {

  const decodedToken = useSelector((state) => state.auth.decodedToken);
  const router = useRouter();
  const [showChild, setShowChild] = useState(0);
  const dispatch = useDispatch();

  useEffect(()=>{
    if (!decodedToken) {
      getToken();
    } else {
      console.log(decodedToken,'decodedToken')
      alert('redirecting in chat')
      router.push('/chat');
    }
  },[]);

  async function getToken(){
    const res = await decode_token();
    console.log(res, 'res');
    if (res.status) {
      alert('you are already login');
      dispatch(handleDecodedToken(res.token));
      router.push('/chat');
    }
    else {
      setShowChild(1);
    }
  }

  return (
    <main className="auth-layout" lang="en">
      {showChild ? children : '' }
    </main>
  );
}
