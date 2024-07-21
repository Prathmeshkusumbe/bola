'use server'
import { generateOTP } from "@/controllers/general_controller";
import { db } from "./firebaseConfig";
import { collection, addDoc, updateDoc, query, where, getDocs, serverTimestamp, doc, onSnapshot, collectionGroup, deleteDoc, orderBy } from "firebase/firestore";
import jwt from 'jsonwebtoken';
import { sendHTMLEmail } from "@/controllers/user_controler";

export async function checkCred(username, pass){
  const userCol = collection(db,'users');
  let q = query(userCol, where("username", "==", username));
  let rateLimit = 1;
  let querySnapshot = await getDocs(q);

  if(querySnapshot.empty){
    console.log('in')
    q = query(userCol, where("email", "==", username));
    querySnapshot = await getDocs(q);
  }
  if (!querySnapshot.empty){
    let data = querySnapshot.docs[0].data();
    let limit = process.env.MAX_LOGIN_RATE_LIMIT;
    if(data?.rateLimit && data?.rateLimit >= limit){
      const dbMili = data.rateLimitTime.toMillis();
      const currMili = new Date();
      const diffInmilli = currMili - dbMili;
      const hour = (diffInmilli / 1000) / 60 / 60;
      if(hour < 24){
        return {status:false};
      }else{
        const {rateLimit, rateLimitTime, ...rest} = data;
        const docRef = doc(db, 'users', querySnapshot.docs[0].id);
        console.log(rest, 'hour')
        await updateDoc(docRef, { rateLimit:0 })
        return { status: false };
      }
    }
  }
  if(!querySnapshot.empty && pass === querySnapshot.docs[0].data().pass){
    let data = querySnapshot.docs[0].data();
    const secret = process.env.JWT_SECRET_KEY;
    const {pass, ...rest} = data;
    console.log(rest,'rest')
    const token = jwt.sign(rest, secret);
    console.log(token);
    return {status:true, token};
  }
  if (!querySnapshot.empty && pass !== querySnapshot.docs[0].data().pass) {
    let data = querySnapshot.docs[0].data();
    let time = new Date();
    if(data?.rateLimit){
      rateLimit = data?.rateLimit + 1;
    }
    const docRef = doc(db, 'users', querySnapshot.docs[0].id);
    await updateDoc(docRef, { ...data, rateLimit, rateLimitTime: time})
    return { status: false};
  }
  return {
    status: false
  };
}

export async function checkUsernameDb(username){
  try{
    const userCol = collection(db, 'users');
    const q = query(userCol, where('username', '==', username));
    let querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return true
    }
    return false
  }
  catch(e){
    return 'failed'
  }
}

export async function checkEmailDb(email) {
  try {
    const userCol = collection(db, 'users');
    const q = query(userCol, where('email', '==', email));
    let querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { status: true, data: querySnapshot.docs[0].data()}
    }
    return {status:false}
  }
  catch (e) {
    return {status:false, msg:'Something went wrong'}
  }
}

export async function addOtpToFb(otp, email){
  var currentdate = new Date();
  console.log(email,'email')
  const q = query(collection(db, 'otpVerification'), where('email', '==', email));
  let querySnapshot = await getDocs(q);
  let resendCount = -1;
  if (!querySnapshot.empty) {
    const data = querySnapshot.docs[0].data();
    resendCount = data.resend;
    console.log(data,'data')
    console.log('here')
    querySnapshot.forEach(async (document)=>{
      await deleteDoc(doc(db,'otpVerification', document.id));
    })
  }
  if(resendCount == 3){
    return {status:'AB', msg:'Your account is bloked due to no of failed attempts'}
  }
  try{
    const res = await addDoc(collection(db, 'otpVerification'), { otp, email, createdAt: currentdate, resend: resendCount + 1 });
    return { status: true }
  }catch(e){
    return {status:false, msg:'Something went wrong'}
  }

}

export async function validateEmailVeriFicationOtp(otp,email) {
  try {
    const userCol = collection(db, 'otpVerification');
    const q = query(userCol, where('email', '==', email), orderBy('createdAt', 'desc'));
    let querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const row = querySnapshot.docs[0];
      const data = row.data();
      if(data?.otp === otp){
        return {status:true}
      }
      else{
        return { status: false, msg: 'wrong otp' }
      }
    }else{
      return { status: false, msg: 'somthing went wrong1' }
    }
  }catch (e) {
    return { status: false, msg: 'somthing went wrong2' }
  }
}

export async function addUserToFb(user) {
  try{
    const res = await addDoc(collection(db, 'users'), { ...user });
    if(res){
      return { status: true}
    }else{
      return { status: false, msg: 'something went wrong' }
    }
  }catch(e){
    return {status:false, msg: 'something went wrong'}
  }
}

export const getJWTSignedToken =  (data) => {
  const secret = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(data, secret);
  return { status: true, token };
}

export const forgotPassEmailSubmitDb = async (email) => {
  console.log(email, 'email')
  const currrentdate = new Date();
  const q = query(collection(db, 'users'), where('email', '==', email));
  let querySnapshot = await getDocs(q);

  // try {
  //   const res = await addDoc(collection(db, 'otpVerification'), { otp, email, createdAt: currentdate, resend: resendCount + 1 });
  //   return { status: true }
  // } catch (e) {
  //   return { status: false, msg: 'Something went wrong' }
  // }

  if(!querySnapshot.empty){
    const otp = await generateOTP();
    const q = query(collection(db, 'otpVerifyForgotPass'), where('email', '==', email));
    let querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'otpVerifyForgotPass', document.id));
      })
    }
    const res = await addDoc(collection(db, 'otpVerifyForgotPass'), { email, otp, createdAt: currrentdate, resend: 0, wrongOtpCount:0})
    if(res){
      //const eRes = await sendHTMLEmail(email,`otp: ${otp}`, 'test subject');
      //if(eRes){
      if(true){
        return {status: true}
      }
      else{
        return {status: false, msg:'Something went wrong while sending email'}
      }
    }
    else{
      return {status: false, msg:'Something went wrong while adding otp in db'}
    }
  }else{
    return {status:false, msg: 'No account regestered with this email id'}
  }

}

export const foggotPassVerifyOtpDb = async (email, otp) => {
  const maxFailed = process.env.PUBLIC_MAX_FAILED_OTP_VERIFY
  const maxTimeToVerify = process.env.PUBLIC_MAX_TIME_TO_VERIFY_OTP;
  var currentdate = new Date();
  console.log(email, 'email')
  const q = query(collection(db, 'otpVerifyForgotPass'), where('email', '==', email));
  let querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const data = querySnapshot.docs[0].data();
    let wrongOtpCount = data?.wrongOtpCount ? data?.wrongOtpCount : 0;
    if(wrongOtpCount == maxFailed){
      return { status: 'AB', msg: 'Your account is blocked due to no of failed otp verification' }
    }
    if(data.otp == otp){
      const otpTimeMilli = data?.createdAt.toMillis();
      const currenTime = new Date();
      const diffInmilli = currenTime - otpTimeMilli;
      const mins = (diffInmilli / 1000) / 60;
      console.log(mins);
      if (mins > maxTimeToVerify){
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, 'otpVerifyForgotPass', document.id));
        })
        return { status: 'expired', msg:'otp expired'}
      }else{
        return { status: 'true', msg:'otp verified'}
      }

    }else{
      console.log(querySnapshot.docs[0].id,'testp')
      const docRef = doc(db, 'otpVerifyForgotPass', querySnapshot.docs[0].id);
      await updateDoc(docRef, { ...data, wrongOtpCount: wrongOtpCount +1})
      return { status: 'wrongOtp', msg: 'wrong otp', wrongOtpCount: wrongOtpCount + 1 }
    }
  }else{
    return { status: 'false', msg: 'Something went wrong'}
  }
}

export const foggotPassResendOtpSubmitDb = async (email) => {
  var currentdate = new Date();
  console.log(email, 'email')
  const q = query(collection(db, 'otpVerifyForgotPass'), where('email', '==', email));
  let querySnapshot = await getDocs(q);
  let resendCount = -1;
  if (!querySnapshot.empty) {
    const data = querySnapshot.docs[0].data();
    resendCount = data?.resend;
    console.log(data, 'data')
    console.log('here')
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'otpVerifyForgotPass', document.id));
    })
  }
  if (resendCount == 3) {
    return { status: 'AB', msg: 'Your account is bloked due to no of failed attempts' }
  }
  try {
    const otp = await generateOTP();
    const res = await addDoc(collection(db, 'otpVerifyForgotPass'), { otp, email, createdAt: currentdate, resend: resendCount + 1 });
    //const eRes = await sendHTMLEmail(email,`otp: ${otp}`, 'test subject');
    //if(eRes){
    if (true) {
      return {status:true, msg:'Please enter the otp sent at your email id.' }
    }else{
      return {status: false, msg:'Something went wrong' }
    }
  } catch (e) {
    return { status: false, msg: 'Something went wrong' }
  }
}