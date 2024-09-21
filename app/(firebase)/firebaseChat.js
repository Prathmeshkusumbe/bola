'use server'
import { currentDateTime } from "@/helper/generalHelper";
import { db } from "./firebaseConfig";
import { collection, addDoc, updateDoc, query, where, getDocs, serverTimestamp, doc, onSnapshot, collectionGroup, orderBy, limit, startAfter, getDoc } from "firebase/firestore";
import { uid } from "uid";

export async function getChatMembers(currUsername) {
  const memCol = collection(db, 'connectedMembers');
  const limit1 = parseInt(process.env.NEXT_PUBLIC_MAX_LIMIT_FETCH_MEMBER);
  let q = query(memCol, where("members", "array-contains", currUsername), orderBy("modifiedAt", "desc"), limit(limit1));
  let querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    //const secret = process.env.JWT_SECRET_KEY;
    let data = querySnapshot.docs.map((doc) => {
      let docData = doc.data();
      // let connected = 0;
      // delete docData['pass'];
      // delete docData['rateLimit'];
      // delete docData['rateLimitTime'];
      // currUserConnectedTo.find((ele) => ele == docData.username) ? connected = 1 : '';
      // docData['connected'] = connected;
      return { id: doc.id, ...docData, msgs:null };

    })
    return { status: true, data };
  }
  return { status: false };
}

export async function getChatMembersPagi(currUsername, lastVisible) {
  let lastVisibleSnap = doc(db, 'connectedMembers', lastVisible);
  lastVisibleSnap = await getDoc(lastVisibleSnap)
  const memCol = collection(db, 'connectedMembers');
  const limit1 = parseInt(process.env.NEXT_PUBLIC_MAX_LIMIT_FETCH_MEMBER);
  let q = query(memCol,
    where("members", "array-contains", currUsername),
    orderBy("modifiedAt", "desc"),
    limit(limit1),
    startAfter(lastVisibleSnap));
  let querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    //const secret = process.env.JWT_SECRET_KEY;
    let data = querySnapshot.docs.map((doc) => {
      let docData = doc.data();
      // let connected = 0;
      // delete docData['pass'];
      // delete docData['rateLimit'];
      // delete docData['rateLimitTime'];
      // currUserConnectedTo.find((ele) => ele == docData.username) ? connected = 1 : '';
      // docData['connected'] = connected;
      return { id: doc.id, ...docData, msgs: null };

    })
    return { status: true, data };
  }
  return { status: false };
}

export async function getUsersFromSearchString(searchString, currUser) {

  const userCol = collection(db, 'users');
  const q = query(
    userCol,
    where('username', '>=', searchString),
    where('username', '<=', searchString + '\uf8ff')
  );
  const querySnapshotUser = await getDocs(q);
  if (querySnapshotUser.size <= 0) {
    return {status:false};
  } else {
    const memCol = collection(db, 'connectedMembers');
    const q = query(memCol, where('members', 'array-contains', currUser));
    const querySnapshotMembers = await getDocs(q);
    const currUserConnectedTo = [];
    if (!querySnapshotMembers.empty) {
      querySnapshotMembers.docs.map((doc)=>{
        let data = doc.data();
        currUserConnectedTo.push(data.members.find(ele=>ele.useranme != currUser));
      })
    }
    let data = querySnapshotUser.docs.map( (doc) => {
        let docData = doc.data();
        let connected = 0;
        delete docData['pass'];
        delete docData['rateLimit'];
        delete docData['rateLimitTime'];
        currUserConnectedTo.find((ele)=>ele==docData.username) ? connected=1 : '';
        docData['connected'] = connected;
        return { id: doc.id, ...docData,};

    })
    return {status:true, data:[...data]}
  }
}

async function checkSearChedUserIsConnected(searchedUser, currUser){
  const memCol = collection(db, 'connectedMembers');
  let q = query(memCol,
          where('members', 'array-contains', searchedUser),
          where('members', 'array-contains', currUser),
          where('type', '==', 'single')
          );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size <= 0) {
    return 0;
  } else {
    return 1
  }
}

export async function createChatMemebers(currUser, memberUser){

  //try {
    const timeStamp = currentDateTime().getTime();
    const memberData = {
      members:[currUser,memberUser],
      reqSender:currUser,
      reqSentAt: timeStamp,
      reqStatus: 'pending',
      connection: 'pending',
      type:'single',
      unreadCount:{currUser:0, memberUser:1}
    }
    const res = await addDoc(collection(db, 'connectedMembers'), { ...memberData });
    if (res) {
      const msgInfo = {
        msgContent: 'Hi',
        msgType:'text',
        sender: currUser,
        receiver: memberUser,
        id: uid(),
        //memberId: selectedMember?.member?.id,
      }
      memberData.id = res.id;
      memberData.msgs = [msgInfo];
      console.log('res2', msgInfo, res.id);
      let res2 = await sendMsgDb(msgInfo, res.id);
      console.log('res2', res2);
      return {status:true, memberData:memberData }
    } else {
      return { status: false, msg: 'something went wrong' }
    }
  //} catch (e) {
    //return { status: false, msg: 'something went wrong' }
  //}

}

export async function fetchMsg(id){
  const msgRef = collection(db, `connectedMembers/${id}/messages`);
  const msgData = await getDocs(msgRef);
  if(!msgData.empty){
    let data = msgData.docs.map((doc) => {
      let docData = doc.data();
      return { id: doc.id, ...docData, };
    })
    return { status: true, data: [...data] }
  }else{
    return { status: false }
  }
}

export async function sendMsgDb(msg,id){
  console.log(msg, id)
  //try{
    const msgsRef = collection(db, `connectedMembers/${id}/messages`);
    const res = await addDoc(msgsRef, {...msg, sentAt: new Date().getTime()})
    return {status:1, id:res.id}
  //}catch(e){
   // return { status: 0}
  //}
}