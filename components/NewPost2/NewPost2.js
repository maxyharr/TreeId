import React from 'react';
import { View } from 'react-native';
import PhotoPicker from './PhotoPicker';
import PostTitle from './PostTitle';
import { ScrollView } from 'react-native-gesture-handler';


const NewPost2 = () => {
  return (
    <ScrollView style={{ flex: 1, margin: 20 }}>
      <PostTitle />
      <PhotoPicker />
    </ScrollView>
  )
}

export default NewPost2;
