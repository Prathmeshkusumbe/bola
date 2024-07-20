'use server'
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import { generateOTP } from "./general_controller";
import { addOtpToFb } from "@/app/(firebase)/firebaseAuth";

export const getUser = async (token) => {
  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //const res = await user;
  return user;
}

export const sendEmailVerification = async (inputs) => {
  const otp = await generateOTP();
  console.log(inputs,'inputs')
  const res = await addOtpToFb(otp, inputs.email);
  if (res.status) {
    if (res.status == 'AB') {
      console.log(res.msg);
      return res;
    }
    else {
      const eRes = await sendHTMLEmail(inputs.email,`otp: ${otp}`, 'test subject');
      if (eRes){
        console.log('testp deserve')
        return {status:true};
      }else{
        return {status:false, msg:'Email send failed'};
      }

    }
  } else {
    console.log('testp')
    return res;
  }
  //await sendHTMLEmail(inputs.email,`otp: ${otp}`, 'test subject');
}

export const sendHTMLEmail = async (to, emailMessage, subject) => {

  console.log(process.env.APP_EMAIL_ADDRESS)
  console.log(process.env.APP_EMAIL_PASSWORD)
  //console.log(process.env.JWT_SECRET_KEY);
  //return;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.APP_EMAIL_ADDRESS,
      pass: process.env.APP_EMAIL_PASSWORD,
    },
  });

  const message = {
    from: process.env.APP_EMAIL_ADDRESS,
    to: to,
    subject: subject,
    text: subject,
    html: emailMessage,
  };

  try {
    await transporter.sendMail(message);
    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};


