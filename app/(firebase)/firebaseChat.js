'use server'
import { db } from "./firebaseConfig";
import { collection, addDoc, updateDoc, query, where, getDocs, serverTimestamp, doc, onSnapshot, collectionGroup } from "firebase/firestore";

export async function getChatMembers(userId) {
  const memCol = collection(db, 'members');
  let q = query(memCol, where("userId", "==", userId));
  let querySnapshot = await getDocs(q);
  if (querySnapshot) {
    const secret = process.env.JWT_SECRET_KEY;
    let data = querySnapshot.docs[0].data();
    return { status: true, data };
  }
  return { status: false };
}

export async function getUsersFromSearchString(searchString) {

  const memCol = collection(db, 'users');
  const q = query(
    memCol,
    where('username', '>=', searchString),
    where('username', '<=', searchString + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);
  console.log(searchString, querySnapshot)
  if (querySnapshot.size <= 0) {
    return false;
  } else {
    return querySnapshot.docs[0].data();
  }
}