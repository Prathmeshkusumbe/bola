import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  connectedMembers:{loading:1, data:[]},
  selectedMember:{member:null,},
  scrollBottomMsgScreen:{scrollBottomMsgScreen:null},
  msgObjToSend:null,
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    handleMembersList: (state, action) => {
      if(action.payload.action == 'add')
        state.connectedMembers = {
        ...state.connectedMembers, data: [...state.connectedMembers.data, action.payload.data]
        };

      if(action.payload.action == 'append')
        state.connectedMembers = {
        ...state.connectedMembers, data: [...state.connectedMembers.data, ...action.payload.data]
        };

      if(action.payload.action == 'set')
        state.connectedMembers = {
        loading:0, data: [...action.payload.data]
        };

      if (action.payload.action == 'addMsgs'){
        const data = state.connectedMembers.data.map(ele=> {
          if(ele.id == action.payload.id){
            return {...ele, msgs:action.payload.data}
          }else return ele;
        });
        state.connectedMembers = {...state.connectedMembers, data:data}
      }

      if (action.payload.action == 'appendMsgs') {
        const data = state.connectedMembers.data.map(ele => {
          if (ele.id == action.payload.id) {
            return { ...ele, msgs: [...(ele?.msgs || []), action.payload.data] }
          } else return ele;
        });
        state.connectedMembers = { ...state.connectedMembers, data: data }
      }

    },

    selectMemberToChat: (state, action) => {
      if (action.payload.action == 'add')
        state.selectedMember = {
          member:{...action.payload.member}
        };

      if (action.payload.action == 'addMsgs')
        state.selectedMember = {
          member: { ...state.selectedMember.member, msgs:[...action.payload?.data] }
        };

      if (action.payload.action == 'appendMsgs'){
        state.selectedMember = {
          member: { ...state.selectedMember.member, msgs: [...(state.selectedMember.member.msgs || []), action.payload?.data] }
        };
      }

      if (action.payload.action == 'scrollDownMsgScreen') {
        state.scrollBottomMsgScreen.scrollBottomMsgScreen = action.payload.value;
      }

    },

    handleMsgObjToSend: (state, action) => {
      console.log(action);
      state.msgObjToSend = {...action.payload}
    },

  }
})

export const {
  handleMembersList,
  selectMemberToChat,
  handleMsgObjToSend
} = dashboardSlice.actions

export default dashboardSlice.reducer