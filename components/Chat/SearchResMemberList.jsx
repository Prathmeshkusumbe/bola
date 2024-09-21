import { isNullUndefinedOrEmpty } from '@/helper/generalHelper'
import React, { useState } from 'react'
import ConnectMembersModal from './ConnectMembersModal'
import { useContext } from 'react';
import { ModalContext } from '@/app/context/ModalContext';

function SearchResMemberList(props) {


  //console.log(test,' const test = useContext(ModalContext);')
  const [modal, handleModal, modalContent]= useContext(ModalContext);


  // console.log(modal, modalContent, handleModal);

  // console.log(modalContent,'modalContent')

  return (
    <div>
      {!isNullUndefinedOrEmpty(props.userSearchRes) &&
        <div>
            {props.userSearchRes.map(user=>
              (
                <div
                  key={user.username}
                  onClick={
                    ()=>{
                      handleModal(
                        <ConnectMembersModal
                          memberUsername={user.username}
                          setUserSearchRes={props.setUserSearchRes}
                          setMemberSearchInput={props.setMemberSearchInput}
                        />
                      )
                    }
                  }
                  className='py-5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 dark:hover:bg-opacity-70'>
                <div className='px-6'>{user.username}</div>
              </div>)
            )}
        </div>
      }

    </div>
  )
}

export default SearchResMemberList