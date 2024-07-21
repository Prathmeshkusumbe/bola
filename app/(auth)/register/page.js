'use client'
import { checkCred, checkEmailDb, checkUsernameDb } from '@/app/(firebase)/firebaseAuth';
import { sendEmailVerification } from '@/controllers/user_controler';
import { setCookie, setSiteCookie } from '@/helper/generalHelper';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { handleEmailVerificationOtp } from '../store/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { nameRegex, regexEmail, regexStrongPassword, usernameRegex } from '@/helper/regex';


function Register() {
  const [inputs, setInputs] = useState({
  fname: '',
  lname:'',
  email:'',
  username: '',
  pass: '',
  cpass:'',
  showPass: false });
  const timeOutRef = useRef();
  const [reqIn, setReqIn] = useState(false);
  const [msg, setMsg] = useState('');
  const [usernameAvail, setUsernameAvail] = useState('pending');
  const router = useRouter();
  const dispatch = useDispatch();
  const emailVerificationOtp = useSelector(state => state.auth);

  function handleInput(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  function changeShowPass() {
    setInputs({ ...inputs, showPass: !inputs.showPass });
  }
  function handleUsername(e){
    setUsernameAvail('checking');
    clearTimeout(timeOutRef.current);
    setInputs({...inputs, username:e.target.value});
    timeOutRef.current = setTimeout(()=>{
      e.target.value && checkUsername(e.target.value);
    },1000)
  }

  async function checkUsername(username){
    if (!usernameRegex.test(username)) {
      console.log('early return')
      setUsernameAvail('not avail')
      return;
    }
    const res = await checkUsernameDb(username);
    res == 'failed' && setUsernameAvail('failed');
    res ? setUsernameAvail('avail') : setUsernameAvail('not avail');
    console.log(res);
  }

  async function rformSubmit(e) {
    e.preventDefault();
    console.log('testing')
    let resV = validateInput();
    if (!resV) {
      alert('please enter valid input')
      return;
    }
    setReqIn(true);
    setMsg('Processing please wait...');
    console.log(inputs.email, 'inputs.email');
    const emailRes = await checkEmailDb(inputs.email);
    setReqIn(false);

    console.log(emailRes,'emailRes');
    if(emailRes.status){
      const data = emailRes.data;
      if(data?.status == 'AB'){
        alert('Your account is blocked due to no of failed attempts');

        return;
      }else{
        alert('already registered');
        return;
      }
    }else{
      if (emailRes?.msg){
        alert(emailRes?.msg);
        return;
      }
    }
    setReqIn(true);
    const res = await sendEmailVerification(inputs);
    setReqIn(false);
    setMsg('');
    console.log('res', res)
    if (res){
      console.log('working', inputs);
      dispatch(handleEmailVerificationOtp({inputs, otpSent:1}));
      router.push('/otp-verification');
    }
    else{
      console.log('email send failed.');
    }
  }

  function validateInput() {
    // if (!usernameRegex.test(inputs.username)) {
    //   //setUsernameAvail('not avail');

    //   console.log('her', inputs)
    //   return;
    // }
    if(!(inputs.fname) || !nameRegex.test(inputs.fname)){
      setMsg(<div className='text-rose-500'>Please enter valid first name</div>);
      return false;
    }
    if((inputs.lname) && !nameRegex.test(inputs.lname)){
      setMsg(<div className='text-rose-500'>Please enter valid last name</div>);
      return false;
    }
    if (!(inputs.email)) {
      setMsg(<div className='text-rose-500'>Email is required.</div>);
      return false;
    }
    if (!regexEmail.test(inputs.email)) {
      setMsg(<div className='text-rose-500'>Please enter valid Email.</div>);
      return false;
    }
    if (!(inputs.username)) {
      setMsg(<div className='text-rose-500'>Username is required</div>);
      return false;
    }
    if (!usernameRegex.test(inputs.username)) {
      setMsg(<div className='text-rose-500'>Please enter valid Username.</div>);
      return false;
    }
    if (!(inputs.pass)) {
      setMsg(<div className='text-rose-500'>Password is required</div>);
      return false;
    }
    if (!(inputs.pass.match(regexStrongPassword))) {
      setMsg(<div className='text-rose-500'>Please enter valid password</div>);
      return false;
    }
    if (!(inputs.cpass)) {
      setMsg(<div className='text-rose-500'>Confirm Password is required</div>);
      return false;
    }
    if (!(inputs.cpass == inputs.cpass)) {
      setMsg(<div className='text-rose-500'>Password & Confirm Password should be same.</div>);
      return false;
    }
    if (!(usernameAvail=='avail')){
      setMsg(<div className='text-rose-500'>Please check username availability</div>);
      return false;
    }
    return true;
  }

  return (
    <div className='flex items-center min-h-screen pt-10 pb-10 pl-4 pr-4'>
      <div className='bg-slate-200 text-slate-900 w-full max-w-[400px] pl-5 pr-5 pt-6 ml-auto mr-auto'>
        <div className=''>
          <h1 className='text-2xl text-center'>Regiter</h1>
          <p className='pt-2'>"*" indicates required field.</p>
          {msg && <div className='text-lg pt-3'>{msg}</div>}
          <div className=' pt-6'>
            <form onSubmit={(e) => rformSubmit(e)}>
              <div className='field pb-4'>
                <div className='label'><label>First Name*</label></div>
                <input className='rounded focus:outline-none w-full h-10 pl-2' name='fname' onChange={(e) => handleInput(e)} placeholder='First Name'></input>
              </div>
              <div className='field pb-4'>
                <div className='label'><label>Last Name</label></div>
                <input className='rounded focus:outline-none w-full h-10 pl-2' name='lname' onChange={(e) => handleInput(e)} placeholder='Last Name'></input>
              </div>
              <div className='field pb-4'>
                <div className='label'><label>Email*</label></div>
                <input className='rounded focus:outline-none w-full h-10 pl-2' name='email' onChange={(e) => handleInput(e)} placeholder='Email'></input>
              </div>
              <div className='field pb-4'>
                <div className='label'><label>Username*</label></div>
                <input className='rounded focus:outline-none w-full h-10 pl-2' name='username' onChange={(e) => handleUsername(e)} placeholder='Username'></input>
                {(usernameAvail == 'checking') && (inputs.username) && <div className='text-slate-600 font-bold'>Checking username availability.</div> }
                {usernameAvail == 'avail' && <div className='text-green-600 font-bold'>Username available.</div>}
                {usernameAvail == 'not avail' && <div className='text-rose-600 font-bold'>Username not available.</div>}
              </div>
              <div className='field pb-6'>
                <div className='label'><label>Password*</label></div>
                <input className='rounded focus:border-slate-400 focus:outline-none w-full h-10 pl-2' name='pass' onChange={(e) => handleInput(e)} type={inputs.showPass ? 'text' : 'password'} placeholder='Password'></input>
                <div className='text-xs'>Password should be min of 8 characters. & it should have atleast one aplhabet and one numric value.</div>
              </div>
              <div className='field pb-6'>
                <div className='label'><label>Confirm Password*</label></div>
                <input className='rounded focus:border-slate-400 focus:outline-none w-full h-10 pl-2' name='cpass' onChange={(e) => handleInput(e)} type={inputs.showPass ? 'text' : 'password'} placeholder='Password'></input>
              </div>
              <div className='field pb-6'>
                <input className='w-4 h-4' type='checkbox' name='showPass' onChange={changeShowPass}></input>
                &nbsp;<label className='-mt-4 inline-block'>Show Password</label>
              </div>
              <div className='pb-6'>
                <button disabled={reqIn} className='border border-slate-500 bg-white pl-4 pr-4 pt-1 pb-1 rounded-lg'>{reqIn ? 'checking...' : 'Register'}</button>&nbsp; / &nbsp;Already have account<Link className='blue' href={'/login'}>&nbsp;<span className='text-blue-600'><b>Login</b></span></Link>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register