'use client'
import { addUserToFb, getJWTSignedToken, validateEmailVeriFicationOtp } from '@/app/(firebase)/firebaseAuth';
import { handleIsWork } from '@/store/layoutReducer';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleDecodedToken, handleEmailVerificationOtp } from '../store/authReducer';
import { sendEmailVerification } from '@/controllers/user_controler';
import { setSiteCookie } from '@/helper/generalHelper';

function OtpVerification() {
  const [msg, setMsg] = useState();
  const [inputs, setInputs] = useState({otp:''});
  const [reqIn, setReqIn] = useState('');
  const emailVerificationData = useSelector((state) => state.auth.emailVerificationOtp);
  const [timer, setTimer] = useState(5);
  const [initialInterval, setInitialInterval] = useState(5)
  const [showResend, setShowResend] = useState(false);
  const [ab,setAb] = useState(false);
  const dispatch = useDispatch()
  const router = useRouter();
  dispatch(handleIsWork());
  async function handleInput(e){
    setInputs({...inputs, [e.target.name]:e.target.value});
  }

  const oformSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs.otp, emailVerificationData.inputs.email)
    const res = await validateEmailVeriFicationOtp(inputs.otp, emailVerificationData.inputs.email);
    console.log(res);
    if(res.status){
      const userData = JSON.parse(JSON.stringify(emailVerificationData.inputs));
      delete userData['cpass'];
      delete userData['showPass'];
      const res = await addUserToFb(userData);
      if(res.status){
      //if (true) {
        delete userData['pass'];
        const tokenRes = await getJWTSignedToken(userData);
        console.log(tokenRes,'tokenRes')
        setSiteCookie('authToken', tokenRes.token);
        dispatch(handleDecodedToken(userData));
        //alert('set token, state')
        router.push('/chat');
        alert('user added successfully')
      }else{
        alert('something went wrong')
      }
    }
    else{
      alert(res.msg)
    }
  }

  useEffect(()=>{
    if (!emailVerificationData.otpSent){
      router.push('/login')
    }
    //dispatch(handleEmailVerificationOtp({ inputs:null, otpSent: 1 }));
  }, [emailVerificationData.otpSent])

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
      dispatch(handleEmailVerificationOtp({ inputs: null, otpSent: null }));
      router.push('/login')
    }
  },[ab])

  const handResend = async () => {
    if(timer == 0){
      setTimer(initialInterval * 2);
      console.log(emailVerificationData)
      const res = await sendEmailVerification(emailVerificationData.inputs);
      console.log(res,'testres')
      if (res.status) {
        if (res.status == 'AB') {
          console.log(res,'res');
          alert(res.msg);
          const userData = JSON.parse(JSON.stringify(emailVerificationData.inputs));
          delete userData['cpass'];
          delete userData['showPass'];
          userData.status='AB';
          setAb(true);
          await addUserToFb(userData);
          //return res;
        }
        else {
          //const eRes = await sendHTMLEmail(inputs.email,`otp: ${otp}`, 'test subject');
          console.log('check else')
          if (true) {
            alert('otp sent successfully');
            //return true;
          } else {
            alert(res.msg);
          }
        }
      } else {
        console.log('check end')
        alert(res.msg);
        //return res;
      }
    }

  }
  return (
    <>
      {emailVerificationData.otpSent &&
        <div className='flex items-center min-h-screen pt-10 pb-10 pl-4 pr-4'>
          <div className='bg-slate-200 text-slate-900 w-full max-w-[400px] pl-5 pr-5 pt-6 ml-auto mr-auto'>
            <div className=''>
              <h1 className='text-2xl text-center'>Otp Verification</h1>
              <p className='pt-2'>Please enter otp sent at your email.</p>
              {msg && <div className='text-lg pt-3'>{msg}</div>}
              <div className=' pt-6'>
                <form onSubmit={(e) => oformSubmit(e)}>
                  <div className='field pb-4'>
                    <div className='label'><label>Otp</label></div>
                    <input className='rounded focus:outline-none w-full h-10 pl-2' name='otp' onChange={(e) => handleInput(e)} placeholder='otp'></input>
                    <div onClick={handResend} className='mt-2'>
                      <span className={`${showResend ? 'opacity-100 cursor-pointer' : 'opacity-50'} mt-2 `}>Resend otp </span>{timer}
                    </div>
                  </div>
                  <div className='pb-6'>
                    <button disabled={reqIn} className='border border-slate-500 bg-white pl-4 pr-4 pt-1 pb-1 rounded-lg'>{reqIn ? 'checking...' : 'submit'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default OtpVerification