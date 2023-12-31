import React from 'react';
import { View, Text, Button, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import ImageView from "react-native-image-viewing";

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
      // Add assets to current assets
      const assets = [...form.mediaAssets, ...result.assets];
      onChange({ ...form, mediaAssets: assets });
    }
  };

  const deleteAsset = (asset) => {
    Alert.alert('Remove', 'Are you sure you want to remove this iamge?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: async () => {
        const assets = form.mediaAssets.filter(a => a.uri != asset.uri);
        onChange({ ...form, mediaAssets: assets });
      } }
    ]);

  }

  const [imageViewVisible, setImageViewVisible] = React.useState(false);
  const [imageViewIndex, setImageViewIndex] = React.useState(0);
  const onTouchImage = (index) => {
    setImageViewIndex(index);
    setImageViewVisible(true);
  }

  return (
    <View style={{flex: 1}}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Photos</Text>
          <Text style={{ fontWeight: 'normal', fontSize: 14 }}> (Required)</Text>
        </View>
        <Button title="Add" onPress={pickAssets}/>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        <FlatList
          data={form.mediaAssets}
          style={{ flex: 1, paddingTop: 10, paddingBottom: 10, paddingRight: 10 }}
          horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View style={{ height: IMAGE_HEIGHT }}>
              <Text style={{ color: 'gray' }}>No photos selected, at least one needed</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={{ marginRight: 10 }}>
              {item.type == 'image' && (
                <TouchableOpacity onPress={() => onTouchImage(index)} activeOpacity={1}>
                  <Image
                    style={{
                      width: IMAGE_WIDTH,
                      height: IMAGE_HEIGHT,
                      borderRadius: 10,
                      borderWidth: 1,
                      backgroundColor: 'black'
                    }}
                    source={{ uri: item.downloadUrl || item.uri }}
                  />
                </TouchableOpacity>
              )}
              {item.type == 'video' && (
                <Video style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT, borderRadius: 10, borderWidth: 1 }} source={{ uri: item.uri }} />
              )}
              <TouchableOpacity style={{ position: 'absolute', right: -6, top: -6 }} onPress={() => deleteAsset(item)} activeOpacity={1}>
                <View style={{backgroundColor: 'lightgray', borderWidth: 1, borderColor: 'white', justifyContent: 'center', alignItems: 'center', width: 25, height: 25, borderRadius: 50}}>
                  <FontAwesome name="times" size={12} style={{ color: 'gray' }}/>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <ImageView
        images={form.mediaAssets.map(asset => ({ uri: asset.downloadUrl || asset.uri }))}
        imageIndex={imageViewIndex}
        visible={imageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
    </View>
  )
}

export default PhotoPicker;
