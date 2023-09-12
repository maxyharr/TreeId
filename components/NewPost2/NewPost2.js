import React, { useEffect } from 'react';
import PhotoPicker from './PhotoPicker';
import PostTitle from './PostTitle';
import LocationPicker from './LocationPicker';
import { useNavigation } from '@react-navigation/native';
import { Button, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useApi } from '../../contexts/AppContext';
import Notes from './Notes';
import { ScrollView } from 'react-native-gesture-handler';
import constants from '../../constants';

const NewPost2 = () => {
  const navigation = useNavigation();
  const { api } = useApi();

  const [ form, setForm ] = React.useState({
    title: '',
    mediaAssets: []
  });

  const finish = async () => {
    if (form.title === '') return alert('Please enter a title');
    if (form.mediaAssets.length === 0) return alert('Please select at least one photo');

    await api.addPost(form);
    navigation.navigate('Home');
  }

  useEffect(() => {
    navigation.setOptions({
      title: 'New Tree',
      headerRight: () => (
        <Button
          onPress={() => finish()}
          title="Confirm"
        />
      )
    });
  })

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'position' : null}
      enabled
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={{ margin: 20 }}>
          <PostTitle form={form} onChange={setForm} />
          <PhotoPicker form={form} onChange={setForm} />
          <LocationPicker form={form} onChange={setForm} />
          <Notes form={form} onChange={setForm} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default NewPost2;
