"use client";
import { checkCred } from '@/app/(firebase)/firebaseAuth';
import { decode_token, setCookie, setSiteCookie } from '@/helper/generalHelper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { handleDecodedToken } from '../store/authReducer';
import { nameRegex, usernameRegex } from '@/helper/regex';

function Login() {

  const [lInputs, setLInputs] = useState({username:'', pass:'', showPass:false});
  const [reqIn, setReqIn] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  function handleInput(e){
    setLInputs({...lInputs, [e.target.name]: e.target.value });
  }

  function changeShowPass(){
    setLInputs({ ...lInputs, showPass: !lInputs.showPass });
  }

  async function lformSubmit(e){
    e.preventDefault();
    console.log('testing')
    let resV = validateInput();
    if(!resV){
      return;
    }
    setReqIn(true);
    setMsg('Processing please wait...');
    let res = await checkCred(lInputs.username, lInputs.pass);
    setReqIn(false);
    if(res.status){
      setSiteCookie('authToken', res.token);
      const decodedToken = await decode_token(res.token);
      console.log(res.token,'token');
      setMsg(<div className='text-green-500'>Logged in successfully. redirecting...</div>);
      dispatch(handleDecodedToken(decodedToken.token));
      //alert('set token, state')
      router.push('/chat')
    }
    else{
      setMsg(<div className='text-rose-500'>Invalid credentials.</div>);
    }
  }

  function validateInput(){
    if(!(lInputs.username) || !usernameRegex.test(lInputs.username)){
      setMsg(<div className='text-rose-500'>Invalid inputs</div>);
      return false;
    }
    if (!(lInputs.pass)) {
      setMsg(<div className='text-rose-500'>Password is required</div>);
      return false;
    }
    return true;
  }

  return (
    <div className='flex items-center min-h-screen pl-4 pr-4'>
      <div className='bg-slate-200 text-slate-900 w-full max-w-[400px] pl-5 pr-5 pt-6 ml-auto mr-auto'>
      <div className=''>
        <h1 className='text-2xl text-center'>Login</h1>
          {msg  && <div className='text-lg pt-3'>{msg}</div> }
        <div className=' pt-6'>
          <form onSubmit={(e)=>lformSubmit(e)}>
            <div className='field pb-4'>
              <div className='label'><label>Username or Email</label></div>
                <input className='rounded focus:outline-none w-full h-10 pl-2' name='username' onChange={(e) => handleInput(e)} placeholder='Username'></input>
            </div>
            <div className='field pb-6'>
              <div className='label'><label>Password</label></div>
                <input className='rounded focus:border-slate-400 focus:outline-none w-full h-10 pl-2' name='pass' onChange={(e) => handleInput(e)} type={lInputs.showPass ? 'text' : 'password'} placeholder='Password'></input>
            </div>
            <div className='field pb-6'>
              <input className='w-4 h-4' type='checkbox' name='showPass' onChange={changeShowPass}></input>
                &nbsp;<label className='-mt-4 inline-block'>Show Password</label>
            </div>
            <div className='pb-6'>
              <button disabled={reqIn} className='border border-slate-500 bg-white pl-4 pr-4 pt-1 pb-1 rounded-lg'>{reqIn ? 'checking...':'Login'}</button>
            </div>
            <div className='pb-6'>
              <Link className='blue' href={'/register'}>Create an account</Link>
              <Link className='blue' href={'/forgot-password'}>&nbsp;/ forgot password</Link>
            </div>
          </form>
        </div>

      </div>
    </div>
    </div>
  )
}

export default Login
