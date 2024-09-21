import React from 'react'
import MessageExachangeTop from './MessageExachangeTop'
import MessageExchangeBottom from './MessageExchangeBottom'
import MessageExchangeScreen from './MessageExchangeScreen'
import { useSelector } from 'react-redux';

function MessageExchange() {

  const selectedMember = useSelector((state) => state.dashboardReducer.selectedMember);
  return (
    selectedMember.member ?
      <>
        <MessageExachangeTop />
        <MessageExchangeScreen />
        <MessageExchangeBottom />
      </>
    : <div>select member to chat</div>
  )
}

export default MessageExchange