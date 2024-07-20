'use server'
import Cookies from "js-cookie";
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET_KEY;

export async function decode_token_action(token) {
  try{
    const Vtoken = jwt.verify(token, secret);
    console.log('verified token', Vtoken);
    return ({ status: 1, token:Vtoken });
  }
  catch(e){
    return ({ status: 0});
  }
}