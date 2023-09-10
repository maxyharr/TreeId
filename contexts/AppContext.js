import React from 'react';
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AppContext = React.createContext();

export const useFirebase = () => {
  return React.useContext(AppContext);
};

export const get = async (collectionName, id) => {
  const collectionRef = collection(db, collectionName);
  try {
    const docRef = await getDoc(collectionRef, id);
    if (docRef.exists()) {
      return {
        id: docRef.id,
        collection: collectionName,
        ...docRef.data()
      };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document: ', error);
  }
};

export const index = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({
        id: doc.id,
        collection: collectionName,
        ...doc.data()
      });
    });
    return docs;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};

export const add = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return get(collectionName, docRef);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

export const update = async (collectionName, id, data) => {
  const collectionRef = collection(db, collectionName);
  try {
    const docRef = await updateDoc(collectionRef, id, data);
    return get(collectionName, docRef.id);
  } catch (error) {
    console.error('Error updating document: ', error);
  }
};

export const AppProvider = ({ children }) => {
  return (
    <AppContext.Provider value={{ db, index, get, add, update }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
