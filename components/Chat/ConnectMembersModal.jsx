import { handleMembersList, handleMsgObjToSend } from "@/app/(dahboard)/store/dashboardReducer";
import { createChatMemebers } from "@/app/(firebase)/firebaseChat";
import { ModalContext } from "@/app/context/ModalContext";
import { te, ts } from "@/helper/generalHelper";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

function ConnectMembersModal(props){

  const [modal, handleModal, modalContent] = useContext(ModalContext);
  const [addUserProcess, setAddUserProcess] = useState(false);
  const currUser = useSelector((state) => state.auth.decodedToken);
  const dispatch = useDispatch();

  const addMember = async() => {
    if (addUserProcess)
      return
    setAddUserProcess(true);
    // const msgInfo = {
    //   msgContent: 'Hi',
    //   msgType: 'text',
    //   sender: currUser,
    //   receiver: memberUser,
    //   id: uid(),
    //   //memberId: selectedMember?.member?.id,
    // }

    const res = await createChatMemebers(currUser.username, props.memberUsername);
    setAddUserProcess(false);
    if(res.status){
      ts(`Connection request to ${props.memberUsername} sent successfully`);
      dispatch(handleMembersList({action:'add', data:res.memberData}));
      let msgInfo = {...res.memberData, action:'newConnectionReq'};
      dispatch(handleMsgObjToSend(msgInfo));
      props.setUserSearchRes([]);
      props.setMemberSearchInput('')
    }else{
      te(`something went wrong`);
    }
    handleModal();
  }

  return <div className="dark:bg-slate-800 bg-white pt-10">
    <h1 className="text-center text-2xl">Send Request to '{props.memberUsername}' to connect with you?</h1>
    <div className="mt-10 text-center pb-10">
      <button onClick={addMember} className="border rounded-md px-8 py-2 mr-2">{addUserProcess ? "Processing" : "Yes"}</button>
      <button onClick={()=>!addUserProcess ? handleModal() : ''} className="border rounded-md px-8 py-2 ml-2">Cancel</button>
    </div>
  </div>
}

export default ConnectMembersModal;