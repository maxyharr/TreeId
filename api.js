import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
  where,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import firebaseConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  signInAnonymously,
  getAuth
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import utils from './utils';
import * as geofire from 'geofire-common';
// import 'react-native-get-random-values' // polyfill for uuid (crypto.getRandomValues)
// import { v4 as uuid } from 'uuid';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    console.error('Error initializing auth: ', error);
  }
}


const storeImages = async (mediaAssets) => {
  const userImagesPath = `images/${auth.currentUser.uid}/`;
  const promises = []

  // upload images that haven't been uploaded yet
  const assetsWithDownloadUrls = mediaAssets.filter(a => a.downloadUrl);
  const assetsWithoutDownloadUrls = mediaAssets.filter(a => !a.downloadUrl);
  for (const asset of assetsWithoutDownloadUrls) {
    const { uri, fileName } = asset;
    const fileRef = ref(storage, `${userImagesPath}${fileName}`);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      promises.push(uploadBytesResumable(fileRef, blob));
    } catch (error) {
      console.error('Error blobbing image: ', error);
      return { data: null, error };
    }
  }

  try {
    await Promise.all(promises);
    const combinedAssets = [...assetsWithDownloadUrls];
    for (const asset of assetsWithoutDownloadUrls) {
      const { fileName } = asset;
      const fileRef = ref(storage, `${userImagesPath}${fileName}`);
      const downloadUrl = await getDownloadURL(fileRef);
      combinedAssets.push({ ...asset, downloadUrl });
    }

    return { data: combinedAssets, error: null };
  } catch (error) {
    if (error.code != 'storage/quota-exceeded')
      console.error('Error storing images: ', error);
    return { data: mediaAssets, error };
  }
}

const api = {
  signInAnonymously: async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      return { data: user, error: null };
    } catch (error) {
      console.error('Error signing in anonymously: ', error);
      return { data: null, error };
    }
  },
  getPosts: async ({latitude, longitude, latitudeDelta, longitudeDelta}) => {
    const center = [latitude, longitude];
    const radiusInM = utils.getRadiusInMeters(latitudeDelta, longitudeDelta);
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = query(
        collection(db, 'posts'),
        orderBy('location.geoHash'),
        startAt(b[0]),
        endAt(b[1]));

      promises.push(getDocs(q));
    }
    try {
      const snapshots = await Promise.all(promises);
      const matchingDocs = [];
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get('location.latitude');
          const lng = doc.get('location.longitude');

          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push({
              id: doc.id,
              collection: 'posts',
              ...doc.data()
            });
          }
        }
      }
      return { data: matchingDocs, error: null }
    } catch (error) {
      console.error('Error getting posts: ', error);
      return { data: null, error };
    }
  },
  getCurrentUsersPosts: async () => {
    try {
      const q = query(collection(db, 'posts'), where('userId', '==', auth.currentUser.uid));
      const snapshots = await getDocs(q);
      const posts = snapshots.docs.map(doc => {
        return {
          id: doc.id,
          collection: 'posts',
          ...doc.data()
        }
      });
      return { data: posts, error: null };
    } catch (error) {
      console.error('Error getting current user\'s posts: ', error);
      return { data: null, error };
    }
  },
  addPost: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'posts'), { ...data, userId: auth.currentUser.uid });
      const post = {
        id: docRef.id,
        collection: 'posts',
        ...data,
      }

      storeImages(data.mediaAssets).then(result => {
        if (result.error) return;

        const newMediaAssets = result.data;
        data = { ...data, mediaAssets: newMediaAssets }
        updateDoc(docRef, data);
      });

      return {data: post, error: null};
    } catch (error) {
      console.error('Error adding post: ', error);
      return {data: null, error};
    }
  },
  updatePost: async (postId, data) => {
    try {
      const docRef = doc(db, 'posts', postId);
      await updateDoc(docRef, { ...data, userId: auth.currentUser.uid });
      const post = {
        id: docRef.id,
        collection: 'posts',
        ...data,
      }

      storeImages(data.mediaAssets).then(result => {
        if (result.error) return;

        const newMediaAssets = result.data;
        data = { ...data, mediaAssets: newMediaAssets }
        updateDoc(docRef, data);
      });

      return {data: post, error: null};
    } catch (error) {
      console.error('Error updating post: ', error);
      return {data: null, error};
    }
  },
  getPost: async (postId) => {
    try {
      const docRef = doc(db, 'posts', postId);
      const document = await getDoc(docRef);
      const post = {
        id: document.id,
        collection: 'posts',
        ...document.data()
      }
      return { data: post, error: null };
    } catch (error) {
      console.error('Error getting post: ', error);
      return { data: null, error };
    }
  },
  deletePost: async (postId) => {
    try {
      const docRef = doc(db, 'posts', postId);
      await deleteDoc(docRef);
      return { data: null, error: null };
    }
    catch (error) {
      console.error('Error deleting post: ', error);
      return { data: null, error };
    }
  }
}

export default api;
