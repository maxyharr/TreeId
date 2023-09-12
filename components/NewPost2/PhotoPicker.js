import React from 'react';
import { View, Text, Button, FlatList, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const PhotoPicker = ({ form, onChange }) => {
  if (!form) return null;

  const IMAGE_WIDTH = 100;
  const IMAGE_HEIGHT = IMAGE_WIDTH;

  const pickAssets = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const assets = result.assets;
      onChange({ ...form, mediaAssets: assets });
    }
  };

  const deleteAsset = (asset) => {
    const assets = form.mediaAssets.filter(a => a.uri != asset.uri);
    onChange({ ...form, mediaAssets: assets });
  }

  return (
    <View style={{flex: 1}}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Photos</Text>
        <Button title="Add" onPress={pickAssets}/>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        <FlatList
          data={form.mediaAssets}
          style={{ paddingTop: 10, paddingBottom: 10, paddingRight: 10 }}
          horizontal={true}
          keyExtractor={item => item.uri}
          ListEmptyComponent={() => (
            <View style={{ height: IMAGE_HEIGHT }}>
              <Text style={{ color: 'gray' }}>No photos selected yet</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={{ marginRight: 10 }}>
              {item.type == 'image' && (
                <Image
                  style={{
                    width: IMAGE_WIDTH,
                    height: IMAGE_HEIGHT,
                    borderRadius: 10,
                    borderWidth: 1,
                  }}
                  source={{ uri: item.uri }}
                />
              )}
              {item.type == 'video' && (
                <Video style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 10, borderWidth: 1 }} source={{ uri: item.uri }} />
              )}
              <TouchableOpacity style={{ position: 'absolute', right: -6, top: -6 }} onPress={() => deleteAsset(item)}>
                <View style={{backgroundColor: 'lightgray', borderWidth: 3, borderColor: 'lightgray', justifyContent: 'center', alignItems: 'center', width: 25, height: 25, borderRadius: '50%'}}>
                  <FontAwesome name="times" size={15} style={{ color: 'gray' }}/>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  )
}

export default PhotoPicker;
