
import { currentDateTime, isNullUndefinedOrEmpty, isScrolledBottom } from '@/helper/generalHelper'
import React, { useEffect, useRef, useState } from 'react'
import MembersModal from './ConnectMembersModal'
import { useContext } from 'react';
import { ModalContext } from '@/app/context/ModalContext';
import { useDispatch, useSelector } from 'react-redux';
import { handleMembersList, selectMemberToChat } from '@/app/(dahboard)/store/dashboardReducer';
import { getChatMembersPagi } from '@/app/(firebase)/firebaseChat';
import InfiniteScroll from '../common/InfiniteScroll';

function ConnectedMemberList({ userSearchRes }) {

  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.auth.decodedToken);
  const connectedMembers = useSelector((state)=>state.dashboardReducer.connectedMembers);
  const memberListRef = useRef(null);
  const [sortedConnectedMembers, setSortedConnectedMembers] = useState({loading:1, data:[]});
  const [disableScrollListener, setDisableScrollListener] = useState(false);
  const [pause, setPause] = useState(false);

  const getChatConnectionLabel = (connectionDetail) => {
    if (connectionDetail?.group) {

    } else {
      const member = connectionDetail.members.filter((ele) => ele != currUser.username);
      return member[0];
    }
  }

  const handleMemberClick = (member) => {
    dispatch(selectMemberToChat({action:'add', member}))
  }

  const getTimeString = (time) => {
    const currentTime = currentDateTime()
    const timestamp = new Date(time);
    let timeString;

    if(timestamp.getYear() < currentTime.getYear()){
      return `${timestamp.getDate()}-${timestamp.getMonth()+1}-${timestamp.getFullYear()}`;
    }
    if(timestamp.getDay < currentTime.getDay){
      timeString = `${timestamp.getDay()} ${timestamp.getMonth()}`;
    }else timeString = `${timestamp.getHours()}:${timestamp.getMinutes()}`;

    return timeString;
  }

  useEffect(()=>{

    if (!isNullUndefinedOrEmpty(connectedMembers?.data)){
      let data = [...connectedMembers?.data];
      data.sort((a, b)=> b.modifiedAt - a.modifiedAt);
      setSortedConnectedMembers({ ...sortedConnectedMembers, data})
    }

  },[connectedMembers])

  return (
    <div ref={memberListRef} className='memberList-height overflow-y-auto'>
      {connectedMembers.loading ?
        <div>loading</div>
      :
        !isNullUndefinedOrEmpty(sortedConnectedMembers.data) ?
          <div>
            <InfiniteScroll currUser={currUser} forwardRef={memberListRef} api={getChatMembersPagi} stateToUpdate={handleMembersList} sortedConnectedMembers={sortedConnectedMembers} />
            {sortedConnectedMembers.data.map((user, i) => (
              <div onClick={()=>handleMemberClick(user)} key={i} className="cursor-pointer px-6 py-5 border-b border-slate-100 dark:border-slate-700">
                <div className='flex'>
                  <div className='flex-1'>
                    <span className="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px]">
                    {getChatConnectionLabel(user)}
                    </span>
                  </div>
                  <div className="flex-none ltr:text-right rtl:text-end">
                    <span className="block text-xs text-slate-400 dark:text-slate-400 font-normal">{getTimeString(user?.modifiedAt)}</span>
                      {user?.unreadCount[currUser.username] && user?.unreadCount[currUser.username] !== 0 &&
                      <span className="inline-flex flex-col items-center justify-center text-[10px] font-medium w-4 h-4 bg-[#FFC155] text-white rounded-full">{user.unreadCount[currUser.username]}</span>
                    }
                  </div>
                </div>
              </div>
            ))
            }
          </div>
        :
        <div>Not connected to anyone yet.</div>
      }

    </div>
  )
}

export default ConnectedMemberList