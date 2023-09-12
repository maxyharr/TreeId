import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";
import 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const api = {
  getPosts: async ({latitude, longitude, latitudeDelta, longitudeDelta}) => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef,
      where('location.latitude', '>=', latitude - latitudeDelta),
      where('location.latitude', '<=', latitude + latitudeDelta),
    );
    try {
      const querySnapshot = await getDocs(q);
      const docs = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().location.longitude < longitude - longitudeDelta) return;
        if (doc.data().location.longitude > longitude + longitudeDelta) return;
        docs.push({
          id: doc.id,
          collection: 'posts',
          ...doc.data()
        });
      });
      return {data: docs, error: null};
    } catch (error) {
      console.error('Error getting posts: ', error);
      return {data: null, error};
    }
  },
  addPost: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'posts'), data);
      const doc = get('posts', docRef);
      return {data: doc, error: null};
    } catch (error) {
      console.error('Error adding post: ', error);
      return {data: null, error};
    }
  }
}

export default api;
