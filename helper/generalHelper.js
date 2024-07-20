import { decode_token_action } from "@/controllers/auth/token";
import Cookies from "js-cookie";
import jwt from 'jsonwebtoken';

export const setSiteCookie = (key, value) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 1);
  const cookieString = `${key}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
};

export function getCookie(key){
  const val = Cookies.get(key);
  return val ?  val : false;
}

export function removeCookie(key){
  Cookies.remove(key);
}

export function decode_token(){
  const authToken = Cookies.get('authToken');
  const res = decode_token_action(authToken);
  return res;
  // try{
  //   const Vtoken = jwt.verify(authToken, secret);
  //   return ({ status: 1, Vtoken });
  // }
  // catch(e){
  //   return ({ status: 0});
  // }
}