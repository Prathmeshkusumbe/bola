import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isWork: false
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    handleIsWork:(state, actiom) => {
      state.isWork = 'yes'
    }
  }
})

export const {
  handleIsWork
} = layoutSlice.actions;

export default layoutSlice.reducer;