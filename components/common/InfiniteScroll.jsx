import { isScrolledBottom } from '@/helper/generalHelper';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

function InfiniteScroll(props) {

  const [disableScrollListener, setDisableScrollListener] = useState(false);
  const [pause, setPause] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.forwardRef?.current && !disableScrollListener) {
      props.forwardRef?.current?.addEventListener('scroll', handleMemberClickScroll)
    }
    return () => {
      props.forwardRef?.current?.removeEventListener('scroll', handleMemberClickScroll);
    };
  }, [props.forwardRef, props.sortedConnectedMembers, pause, disableScrollListener])

  async function handleMemberClickScroll() {
    console.log('req')
    if (pause) return;
    if (isScrolledBottom(props.forwardRef.current)) {
      console.log('req2')
      let lastVisible = props.sortedConnectedMembers.data[props.sortedConnectedMembers.data.length - 1];
      console.log(lastVisible.id);
      setPause(true);
      let res = await props.api(props.currUser.username, lastVisible.id);
      console.log('res', res);
      if (res.status)
        dispatch(props.stateToUpdate({ action: 'append', data: res.data }));
      else {
        setDisableScrollListener(true);
        props.forwardRef?.current?.removeEventListener('scroll', handleMemberClickScroll);
      }
      setPause(false);

    }
  }
  return (
    null
  )
}

export default InfiniteScroll