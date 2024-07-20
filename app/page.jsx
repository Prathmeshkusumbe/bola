'use client'
import Cookies from "js-cookie";
import Image from "next/image";
import jwt  from "jsonwebtoken";
import { getCookie, getSiteCookie } from "@/helper/generalHelper";
import { getUser } from "@/controllers/user_controler";
import { useEffect } from "react";
import Header from "@/components/Header/Header";
import LogoutUser from "@/components/common/LogoutUser";

export default function Home() {
  // //const token = Cookies.get('authToken');
  // const token = getCookie('authToken');

  // useEffect(()=>{
  //   token && getUserDetails(token);
  // },[])

  // async function getUserDetails(){
  //   const user = await getUser(token);
  //   //return user;
  //   console.log(user);
  // }


  return (
    <div>
      home page
    </div>
  );
}
