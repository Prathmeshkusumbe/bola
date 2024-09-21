'use client'
import CurrentUser from '@/components/Chat/CurrentUser'
import SearchResMemberList from '@/components/Chat/SearchResMemberList'
import SearchMembers from '@/components/Chat/SearchMembers'
import Card from '@/components/common/Card'
import React, { useEffect, useState } from 'react'
import ConnectedMemberList from '@/components/Chat/ConnectedMemberList'
import { getChatMembers } from '@/app/(firebase)/firebaseChat'
import { useDispatch, useSelector } from 'react-redux'
import { handleMembersList } from '../store/dashboardReducer'
import MessageExchange from '@/components/Chat/messageExchange/MessageExchange'
import { collectionGroup, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/app/(firebase)/firebaseConfig'

function page() {
  const [userSearchRes, setUserSearchRes] = useState([]);
  const [memberSearchInput, setMemberSearchInput] = useState('');
  const [ws, setWs] = useState(null);
  const currUser = useSelector((state) => state.auth.decodedToken);
  const msgObjToSend = useSelector((state) => state.dashboardReducer.msgObjToSend);
  //const [connectionProcess,setConnectionProcess] = useState('idle');
  const dispatch = useDispatch();

  useEffect(()=>{
    callToGetChatMembers()
  },[])

  async function callToGetChatMembers(){
    const res = await getChatMembers(currUser.username);
    if(res.status){
      dispatch(handleMembersList({loading:0, action:'set', data:res.data}))
    }else dispatch(handleMembersList({ loading: 0, action:'set', data:[]}))
  }


  // useEffect(() => {

  //   const q = query(
  //     collectionGroup(db, 'messages'), // Collection group allows you to listen to all subcollections named 'messages'
  //     where('receiver', '==', currUser.username)
  //   );

  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     console.log(snapshot.docs.length);
  //     snapshot.docChanges().forEach((change) => {
  //       if (change.type === 'added') {
  //         const newMessage = change.doc.data();
  //         console.log('newMessage', newMessage);
  //         // Handle the new message (e.g., display it in the corresponding chat UI)
  //       }
  //     });
  //   });

  //   return () => unsubscribe(); // Cleanup the listener when the component unmounts
  // }, [currUser.username]);

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Register the user with the server
      socket.send(JSON.stringify({ type: 'register', userId: currUser.username }));
    };

    socket.onmessage = (event) => {
      const msgInfo = JSON.parse(event.data);
      console.log('msginfo',msgInfo);

      if(msgInfo?.action === 'newConnectionReq'){
        delete msgInfo.action;
        dispatch(handleMembersList({action:'add', data:msgInfo}));
      }

      // Convert the Blob to text
      // const reader = new FileReader();
      // reader.onload = function () {
      //   const newMessage = reader.result;
      //   console.log('Received from server:', newMessage);
      //   setMessages((prevMessages) => [...prevMessages, newMessage]);
      // };
      // reader.readAsText(blob);

    }

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  // const sendMessage = (msgInfo) => {
  //   if (ws) {
  //     ws.send(msgInfo);
  //     //setInput('');
  //   }
  // };

  useEffect(()=>{
    if(msgObjToSend)
      ws.send(JSON.stringify(msgObjToSend));
  },[msgObjToSend])

  return (
    <>
      <div className='flex h-full space-x-5'>
        <div className='flex-none w-[285px]'>
          <Card>
            <CurrentUser />
            <SearchMembers
              memberSearchInput={memberSearchInput}
              setMemberSearchInput={setMemberSearchInput}
              setUserSearchRes={setUserSearchRes}
              //connectionProcess={connectionProcess}
              //setConnectionProcess={setConnectionProcess}
            />
            <SearchResMemberList
              setMemberSearchInput={setMemberSearchInput}
              setUserSearchRes={setUserSearchRes}
              userSearchRes={userSearchRes}
              //connectionProcess={connectionProcess}
            />
            <ConnectedMemberList
              // connectionProcess={connectionProcess}
              // setUserSearchRes={setUserSearchRes}
              // setMemberSearchInput={setMemberSearchInput}
            />
          </Card>
        </div>
        <div className='flex-1'>
          <div className='flex h-full space-x-5'>
            <div className='flex-1'>
              <Card>
                <MessageExchange/>
              </Card>
            </div>
            <div className='flex-none w-[285px]'><Card>second columns second columns</Card></div>
          </div>
        </div>
      </div>
    </>

  )
}

export default page