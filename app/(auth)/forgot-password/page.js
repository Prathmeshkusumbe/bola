'use client'
import { foggotPassResendOtpSubmitDb, foggotPassVerifyOtpDb, foggotPassVerifyOtpSubmitDb, forgotPassEmailSubmitDb, handleForgotPassSubmitDb } from '@/app/(firebase)/firebaseAuth';
import { regexEmail } from '@/helper/constant_helper';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleForgotPassVerifyOtp } from '../store/authReducer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function ForgotPassword() {
  const [msg, setMsg] = useState('');
  const [inputs, setInputs] = useState({
    email:''
  })
  const [reqIn, setReqIn] = useState(false);
  const [resendOn, setResendOn] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const emailSentStore = useSelector((state)=>state.auth.forgotPassVerifyOtp);
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(5);
  const [initialInterval, setInitialInterval] = useState(5)
  const [showResend, setShowResend] = useState(false);
  const [ab, setAb] = useState(false);
  const router = useRouter();

  console.log(emailSentStore,'emailSentStore')
  function handleInput(e){
    setInputs({...inputs, [e.target.name]:e.target.value})
  }
  async function foggotPassEmailSubmit(e){
    e.preventDefault();
    setMsg('');
    if (!(inputs.email)) {
      setMsg(<div className='text-rose-500'>Email is required.</div>);
      return false;
    }
    if (!(inputs.email.match(regexEmail))) {
      setMsg(<div className='text-rose-500'>Please enter valid Email.</div>);
      return false;
    }
    setReqIn(true);
    const res = await forgotPassEmailSubmitDb(inputs.email);
    setReqIn(false);
    if (res.status) {
      alert('please submit an otp sent at your email');
      dispatch(handleForgotPassVerifyOtp({email:inputs.email, otpSent:true}))
      setEmailSent(true);
    } else {
      alert(res.msg)
    }
  }

  const foggotPassVerifyOtpSubmit = async(e)=>{
    e.preventDefault();
    //setReqIn(true);
    const res = await foggotPassVerifyOtpDb(inputs.email, otp);
    setReqIn(false);
    if (res.status) {
      if(res.status == 'expired'){
        alert(res.msg);
        router.push('/login');
        return;
      }
      if(res.status == 'AB'){
        alert(res.msg);
        return;
      }
      else if (res.status ='wrongOtp'){
        alert(res.msg);
        return;
      }
      else{
        alert(res.msg);
        console.log(res.dff,res)
        return;
      }
    }else{
      alert(res.msg);
    }
  }

  useEffect(() => {
    if (timer > 0) {
      setShowResend(false);
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      }
    } else {
      setShowResend(true);
    }
  }, [timer]);

   useEffect(()=>{
    if(ab){
      dispatch(handleForgotPassVerifyOtp({ inputs: null, otpSent: null }));
      router.push('/login')
    }
  },[ab]);

  const handResend = async () => {
    if (timer == 0) {
      setTimer(initialInterval * 2);
      console.log(emailSentStore)
      const res = await foggotPassResendOtpSubmitDb(emailSentStore.email);
      console.log(res, 'testres')
      // if (res.status) {
      //   if (res.status == 'AB') {
      //     alert(res.msg);
      //   }
      //   else if(res.status) {
      //     alert(res.msg);
      //   }else{
      //     alert(res.msg);
      //   }
      // } else {
      //   console.log('check end')
      //   alert(res.msg);
      // }
      alert(res.msg);
    }

  }

  return (
    <div className='flex items-center min-h-screen pt-10 pb-10 pl-4 pr-4'>
      <div className='bg-slate-200 text-slate-900 w-full max-w-[400px] pl-5 pr-5 pt-6 ml-auto mr-auto'>
        <div className=''>
          {!emailSent &&
          <>
          <h1 className='text-2xl text-center'>Forgot Password</h1>
          <p className='pt-2'>Please enter your registered email.</p>
          {msg && <div className='text-lg pt-3'>{msg}</div>}
          <div className=' pt-6'>
            <form onSubmit={(e) => foggotPassEmailSubmit(e)}>
              <div className='field pb-4'>
                <div className='label'><label>Email*</label></div>
                <input className='rounded focus:outline-none w-full h-10 pl-2' name='email' onChange={(e) => handleInput(e)} placeholder='Email'></input>
              </div>
              <div className='pb-6'>
                <button disabled={reqIn} className='border border-slate-500 bg-white pl-4 pr-4 pt-1 pb-1 rounded-lg'>{reqIn ? 'checking...' : 'submit'}</button><Link className='blue' href={'/login'}>&nbsp;<span className='text-blue-600'><b>&nbsp; / &nbsp;Login</b></span></Link>
              </div>
            </form>
          </div>
          </>
          }
          {emailSent &&
            <>
              <h1 className='text-2xl text-center'>Forgot Password</h1>
              <p className='pt-2'>Please enter otp sent at your email.</p>
              {msg && <div className='text-lg pt-3'>{msg}</div>}
              <div className=' pt-6'>
                <form onSubmit={(e) => foggotPassVerifyOtpSubmit(e)}>
                  <div className='field pb-4'>
                    <div className='label'><label>Otp*</label></div>
                    <input className='rounded focus:outline-none w-full h-10 pl-2' name='otp' onChange={(e) => setOtp(e.target.value)} placeholder='Otp'></input>
                    <div onClick={handResend} className='mt-2'>
                      <span className={`${showResend ? 'opacity-100 cursor-pointer' : 'opacity-50'} mt-2 `}>Resend otp </span>{timer}
                    </div>
                  </div>
                  <div className='pb-6'>
                    <button disabled={reqIn} className='border border-slate-500 bg-white pl-4 pr-4 pt-1 pb-1 rounded-lg'>{reqIn ? 'checking...' : 'submit'}</button><Link className='blue' href={'/login'}>&nbsp;<span className='text-blue-600'><b>&nbsp; / &nbsp;Login</b></span></Link>
                  </div>
                </form>
              </div>
            </>
          }
        </div>


      </div>
    </div>
  )
}

export default ForgotPassword