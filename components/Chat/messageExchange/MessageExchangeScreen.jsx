import { handleMembersList, selectMemberToChat } from '@/app/(dahboard)/store/dashboardReducer';
import { fetchMsg } from '@/app/(firebase)/firebaseChat';
import { isNullUndefinedOrEmpty, te } from '@/helper/generalHelper';
import { Icon } from '@iconify/react'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function MessageExchangeScreen() {

  const selectedMember = useSelector((state)=>state.dashboardReducer.selectedMember);
  const currUser = useSelector((state) => state.auth.decodedToken);
  const dispatch = useDispatch();
  const scrollBottomMsgScreen = useSelector((state)=>state.dashboardReducer.scrollBottomMsgScreen);
  const chatScreenRef = useRef(null);

  useEffect(()=>{
    if(isNullUndefinedOrEmpty(selectedMember?.member?.msgs)){
      getMsgs();
    }

  },[selectedMember]);

  async function getMsgs(){
    const res = await fetchMsg(selectedMember?.member?.id);
    if(res.status){
      dispatch(selectMemberToChat({ action: 'addMsgs', data: res.data }));
      dispatch(handleMembersList({ action: 'addMsgs', data: res.data, id: selectedMember?.member?.id }));
    }
    else te('failed while fetching msg')
  }

  useEffect(()=>{
    if (scrollBottomMsgScreen){
      if (chatScreenRef.current) {
        chatScreenRef.current.scrollTop = chatScreenRef.current.scrollHeight;
      }
    }
  },[scrollBottomMsgScreen])

  return selectedMember?.member?.msgs ?
    <div ref={chatScreenRef} className="msgs overflow-y-auto msg-height pt-6 space-y-6">
      {selectedMember?.member?.msgs.map((msg,i)=>
        <div key={i} >
          {msg?.sender !== currUser.username ?
            <div className="block md:px-6 px-4">
              <div className="flex space-x-2 items-start group rtl:space-x-reverse">
                <div className="flex-1 flex space-x-4 rtl:space-x-reverse">
                  <div>
                    <div className="text-contrent p-3 bg-slate-100 dark:bg-slate-600 dark:text-slate-300 text-slate-600 text-sm font-normal mb-1 rounded-md flex-1 whitespace-pre-wrap break-all">
                    {msg.msgContent}
                    </div>
                    <span className="font-normal text-xs text-slate-400 dark:text-slate-400">12:20 pm</span>
                  </div>
                  <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <div className="relative inline-block">
                      <div className="block w-full " data-headlessui-state="">
                        <button className="block w-full" id="headlessui-menu-button-:r4:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                          <div className="label-className-custom">
                            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-600 dark:text-slate-300 text-slate-900 flex flex-col justify-center items-center text-xl rounded-full">
                              <Icon icon="tabler:dots" />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div className="block md:px-6 px-4">
              <div className="flex space-x-2 items-start justify-end group w-full rtl:space-x-reverse">
                <div className="no flex space-x-4 rtl:space-x-reverse">
                  <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    <div className="relative inline-block"><div className="block w-full " data-headlessui-state="">
                      <button className="block w-full" id="headlessui-menu-button-:r6:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                        <div className="label-className-custom">
                          <div className="h-8 w-8 bg-slate-300 dark:bg-slate-900 dark:text-slate-400 flex flex-col justify-center items-center text-xl rounded-full text-slate-900">
                            <Icon icon="tabler:dots" />
                          </div>
                        </div>
                      </button>
                    </div>
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap break-all">
                    <div className="text-contrent p-3 bg-slate-300 dark:bg-slate-900 dark:text-slate-300 text-slate-800 text-sm font-normal rounded-md flex-1 mb-1">
                      {msg.msgContent}
                    </div>
                    <span className="font-normal text-xs text-slate-400">10:35 pm</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      )}
    </div>
    : <div className="msgs overflow-y-auto msg-height pt-6 space-y-6">loading</div>
}

export default MessageExchangeScreen