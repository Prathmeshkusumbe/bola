'use client';
import Modal from '@/components/common/Modal';
import { createContext, useState } from 'react';
import useModal from '../CustomHooks/useModal';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, handleModal, modalContent] = useModal();

  return (
    <ModalContext.Provider value={[modal, handleModal, modalContent]}>
      {/* <> */}
      {children}
      <div id="modal-root">{modal ? <Modal /> : null}</div>
      {/* </> */}
    </ModalContext.Provider>
  );
};