import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  emailVerificationOtp: {inputs:null, otpSent:null},
  decodedToken: '',
  logOutUserFlag: 0,
  forgotPassVerifyOtp:{email:null, otpSent:null}
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers:{
    handleEmailVerificationOtp:(state, action)=>{
      console.log(action.payload,'action.payload')
      state.emailVerificationOtp = action.payload;
    },
    handleDecodedToken: (state, action) => {
      state.decodedToken = action.payload;
    },
    handleLogOutUserFlag: (state, action) => {
      state.logOutUserFlag = action.payload;
    },
    handleForgotPassVerifyOtp: (state, action) => {
      console.log(action.payload, 'action.payload')
      state.forgotPassVerifyOtp = action.payload;
    },
  }
})

export const {
  handleEmailVerificationOtp,
  handleDecodedToken,
  handleLogOutUserFlag,
  handleForgotPassVerifyOtp
} = authSlice.actions

export default authSlice.reducer