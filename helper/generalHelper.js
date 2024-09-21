import { decode_token_action } from "@/controllers/auth/token";
import Cookies from "js-cookie";
import jwt from 'jsonwebtoken';
import toast from "react-hot-toast";

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

export function isObjectValid(obj) {
  return obj !== undefined && obj !== null && Object.keys(obj).length > 0;
}

export function isNullUndefinedOrEmpty(value) {
  // Check if the value is undefined or null
  if (value === undefined || value === null) {
    return true;
  }

  // Check if the value is an array or object and if it's empty
  if (typeof value === 'object') {
    // For arrays
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    // For objects
    if (Object.prototype.toString.call(value) === '[object Object]') {
      return Object.keys(value).length === 0;
    }
  }

  // Return false if none of the conditions are met
  return false;
}

export const currentDateTime = () => {
  const currentTimeStamp = new Date();
  return currentTimeStamp;
}

export const ts = (msg) =>  {
  toast.success(msg);
}

export const te = (msg) => {
  toast.error(msg);
}

export const isScrolledBottom = (ele) => {
  //console.log(ele.scrollHeight, (ele.scrollTop), ele.clientHeight )
  //console.log(ele.scrollHeight - parseInt(ele.scrollTop), ele.clientHeight)
  return ele.scrollHeight - parseInt(ele.scrollTop) - ele.clientHeight < 2;
}
