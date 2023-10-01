import React, { useEffect } from 'react';
import PhotoPicker from './PhotoPicker';
import DataSearch from './DataSearch';
import LocationPicker from './LocationPicker';
import { useNavigation } from '@react-navigation/native';
import { Button, KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import Notes from './Notes';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import api from '../../api';

const UpsertPost = ({ route }) => {
  const { params } = route;
  const postId = params?.postId;
  const [ postLoading, setPostLoading ] = React.useState(false);

  const navigation = useNavigation();
  const [ form, setForm ] = React.useState({
    title: '',
    mediaAssets: [],
  });

  const finish = async () => {
    if (form.title === '') return alert('Please enter a title');
    if (form.mediaAssets.length === 0) return alert('Please select at least one photo');

    // Upload each of the mediaAssets to
    if (postId) {
      await api.updatePost(postId, form);
      navigation.goBack();
    } else {
      await api.addPost(form);
      navigation.navigate('Map');
    }
  }

  useEffect(() => {
    if (postId) {
      setPostLoading(true);
      (async () => {
        const result = await api.getPost(postId);
        if (!result.error) {
          const post = result.data
          setForm(post);
        }
        setPostLoading(false);
      })()
    }
  }, [postId])

  useEffect(() => {
    let title = 'New Tree';
    let buttonText = 'Confirm';

    if (postId) {
      title = 'Edit Tree';
      buttonText = 'Save';
    }

    navigation.setOptions({
      title,
      headerRight: () => (
        <Button
          onPress={() => finish()}
          title={buttonText}
          disabled={form.title === '' || form.mediaAssets.length === 0}
        />
      )
    });
  }, [form, postId])

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps='handled'
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={50}
    >
      {postId && postLoading ? <Text>Loading...</Text> : (
        <View style={{ margin: 20 }}>
          <View style={{ marginBottom: 10 }} >
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Tree Name
              </Text>
              <Text style={{ fontWeight: 'normal', fontSize: 14 }}> (Required)</Text>
            </View>
            <TextInput
              placeholder="Name of tree"
              value={form.title}
              onChangeText={text => setForm({ ...form, title: text })}
              style={{ backgroundColor: 'white', padding: 10, borderWidth: 1, fontSize: 14, borderColor: 'lightgray' }}
            />
          </View>
          <DataSearch form={form} onChange={setForm} />
          <PhotoPicker form={form} onChange={setForm} />
          <LocationPicker form={form} onChange={setForm} />
          <Notes form={form} onChange={setForm} />
        </View>
      )}
    </KeyboardAwareScrollView>
  )
}

export default UpsertPost;
