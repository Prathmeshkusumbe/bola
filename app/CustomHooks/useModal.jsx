import React, { useState } from 'react'

function useModal() {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleModal = (content, modalVlaue) => {
    console.log('hiii', modal)
    setModal(!modal)
    if (content){
      setModalContent(content)
    }else{
      setModalContent('')
    }
  }

  return (
    [modal, handleModal, modalContent]
  )

}

export default useModal