import React from 'react';
import PhotoPicker from './PhotoPicker';
import PostTitle from './PostTitle';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import { useFirebase } from '../../contexts/AppContext';

const NewPost2 = () => {
  const navigation = useNavigation();
  const { add } = useFirebase();

  const [ form, setForm ] = React.useState({
    title: '',
    mediaAssets: []
  });

  const finish = async () => {
    if (form.title === '') return alert('Please enter a title');
    if (form.mediaAssets.length === 0) return alert('Please select at least one photo');

    await add('posts', form);
    navigation.navigate('Home');
  }

  navigation.setOptions({
    title: 'New Tree',
    headerRight: () => (
      <Button
        onPress={() => finish()}
        title="Confirm"
      />
    )
  });

  return (
    <ScrollView style={{ flex: 1, margin: 20 }}>
      <PostTitle form={form} onChange={setForm} />
      <PhotoPicker form={form} onChange={setForm} />
      {/* TODO: Display map to select location */}
    </ScrollView>
  )
}

export default NewPost2;
