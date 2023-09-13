import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  startAt,
  endAt,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import firebaseConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import utils from './utils';
import * as geofire from 'geofire-common';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const storeImages = async (mediaAssets) => {
  const asset = mediaAssets[0];

  const { uri, assetId } = asset;


  const fileRef = ref(storage, `images/${assetId}`);

  try {
    const response = await fetch(uri);

    const blob = await response.blob();

    const uploadResult = await uploadBytesResumable(fileRef, blob);

    const downloadUrl = await getDownloadURL(uploadResult.ref);

    const newMediaAssets = [{ ...asset, downloadUrl }];

    return { data: newMediaAssets, error: null };
  } catch (error) {
    console.error('Error storing images: ', error);
    return { data: null, error };
  }
}

const api = {
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
  addPost: async (data) => {
    try {
      const result = await storeImages(data.mediaAssets);
      if (result.error) return {data: null, error: result.error};
      const newMediaAssets = result.data;
      data = { ...data, mediaAssets: newMediaAssets }
      const docRef = await addDoc(collection(db, 'posts'), data);
      const doc = {
        id: docRef.id,
        collection: 'posts',
        ...data,
      }
      return {data: doc, error: null};
    } catch (error) {
      console.error('Error adding post: ', error);
      return {data: null, error};
    }
  }
}

export default api;
