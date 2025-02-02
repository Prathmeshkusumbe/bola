import { handleMembersList, selectMemberToChat } from '@/app/(dahboard)/store/dashboardReducer';
import { sendMsgDb } from '@/app/(firebase)/firebaseChat';
import { te } from '@/helper/generalHelper';
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uid } from 'uid';

function MessageExchangeBottom() {
  const [msgTextarea, setMsgTextarea] = useState('');
  const [msgType, setMsgType] = useState('text');
  const currUser = useSelector((state) => state.auth.decodedToken);
  const selectedMember = useSelector((state) => state.dashboardReducer.selectedMember);
  const memberUsername = selectedMember.member.members.find((ele) => ele !== currUser.username);
  const dispatch = useDispatch();

  const [ws, setWs] = useState(null); // WebSocket client connection
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Create WebSocket connection when component mounts
    const socket = new WebSocket('ws://localhost:3000/api/websocket');

    // Set the WebSocket connection to state once it is established
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(socket); // Update state with the WebSocket connection
    };

    // Listen for incoming messages from WebSocket server
    socket.onmessage = (event) => {
      const incomingMsg = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, incomingMsg]);
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const handleSendMsg = async () => {
    msgTextarea.trim();
    if (msgTextarea.length > 2000) {
      te('msg is too long');
      return;
    }

    if (msgTextarea === '') return;

    const msgInfo = {
      msgContent: msgTextarea,
      msgType,
      sender: currUser.username,
      receiver: memberUsername,
      id: uid(),
    };

    // Send the message via WebSocket
    sendMessage(msgInfo);

    // Update state and Redux store (for UI)
    dispatch(selectMemberToChat({ action: 'appendMsgs', data: { ...msgInfo } }));
    dispatch(selectMemberToChat({ action: 'scrollDownMsgScreen', value: new Date().getTime() }));
    dispatch(handleMembersList({ action: 'appendMsgs', data: { ...msgInfo }, id: selectedMember?.member?.id }));

    // Clear the message textarea
    setMsgTextarea('');

    // Send the message to the database (Firebase or elsewhere)
    const res = await sendMsgDb(msgInfo, selectedMember?.member?.id);
    if (!res.status) {
      te('msg send failed');
    }
    console.log(res, 'res');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMsg();
    }
  };

  // Function to send the message through WebSocket
  const sendMessage = (msgInfo) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msgInfo)); // Send the message over the WebSocket connection
      setMsgTextarea(''); // Clear the input
    }
  };

  return (
    <div>
      <div className="md:px-6 px-4 sm:flex md:space-x-4 sm:space-x-2 rtl:space-x-reverse border-t md:pt-6 pt-4 border-slate-100 dark:border-slate-700">
        <div className="flex-none sm:flex hidden md:space-x-3 space-x-1 rtl:space-x-reverse">
          <div className="h-8 w-8 cursor-pointer bg-slate-100 dark:bg-slate-900 dark:text-slate-400 flex flex-col justify-center items-center text-xl rounded-full">
            <Icon width="15" icon="grommet-icons:attachment" />
          </div>
          <div className="h-8 w-8 cursor-pointer bg-slate-100 dark:bg-slate-900 dark:text-slate-400 flex flex-col justify-center items-center text-xl rounded-full">
            <Icon icon="f7:smiley" />
          </div>
        </div>
        <div className="flex-1 relative flex space-x-3 rtl:space-x-reverse">
          <div className="flex-1">
            <textarea
              onKeyPress={handleKeyPress}
              onChange={(e) => setMsgTextarea(e.target.value.trim())}
              type="text"
              placeholder="Type your message..."
              className="focus:ring-0 focus:outline-0 block w-full bg-transparent dark:text-white resize-none"
              value={msgTextarea}
            />
          </div>
          <div className="flex-none md:pr-0 pr-3">
            <button
              onClick={handleSendMsg}
              type="button"
              className="h-8 w-8 bg-slate-900 text-white flex flex-col justify-center items-center text-lg rounded-full"
            >
              <Icon icon="mingcute:send-line" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageExchangeBottom;
