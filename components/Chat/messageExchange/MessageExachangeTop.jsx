import React from 'react'
import { Icon } from '@iconify/react';
import { darkBlue } from '@/app/cofig/styleConfig';
import { useSelector } from 'react-redux';

function MessageExachangeTop() {

  let member = useSelector((state)=> state.dashboardReducer.selectedMember.member);
  const currUser = useSelector((state) => state.auth.decodedToken);
  console.log('member', member);
  let membername = member.members.find(ele=>ele !== currUser.username);
  return (
    <div>
      <header className="border-b border-slate-100 dark:border-slate-700">
        <div className="flex py-6 md:px-6 px-3 items-center">
          <div className="flex-1">
            <div className="flex space-x-3 rtl:space-x-reverse">
              {/* <div className="flex-none">
                <div className="h-10 w-10 rounded-full relative">
                  <span className=" status ring-1 ring-white inline-block h-[10px] w-[10px] rounded-full absolute -right-0 top-0
                    bg-secondary-500">
                  </span>
                  <img src="/assets/user-2.2006f1b4.jpg" alt="" className="w-full h-full object-cover rounded-full" />
                </div>
              </div> */}
              <div className="flex-1 text-start">
                <span className="block text-slate-800 dark:text-slate-300 text-sm font-medium mb-[2px] truncate">{membername}</span>
                {/* <span className="block text-slate-500 dark:text-slate-300 text-xs font-normal">Active now</span> */}
              </div>
            </div>
          </div>
          <div className="flex-none flex md:space-x-3 space-x-1 items-center rtl:space-x-reverse">
            <div className={`msg-action-btn flex justify-center  items-center w-[2rem] h-[2rem] rounded-full dark:bg-slate-900`}>
              <Icon width='15' icon="wpf:videocall" />
            </div>
            <div className="msg-action-btn">

            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default MessageExachangeTop