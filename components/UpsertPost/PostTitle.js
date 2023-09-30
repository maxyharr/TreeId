import { debounce } from 'lodash-es';
import React from 'react';
import { View, Text, Image } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import utils from '../../utils';
import trefleApi from '../../trefleApi';

const PostTitle = ({ form, onChange }) => {
  if (!form) return null;
  const deviceHeight = utils.deviceHeight();
  const [plants, setPlants] = React.useState([]);
  const [loadingPlants, setLoadingPlants] = React.useState(false);

  const handleChangeText = async (text) => {
    onChange({ ...form, title: text, treflePlant: null });
    debounceLoadPlants(text);
  }

  const debounceLoadPlants = React.useCallback(
    debounce(
      async text => loadPlants(text),
      300,
    ),
  []);

  const loadPlants = async (text) => {
    setLoadingPlants(true);
    const result = await trefleApi.searchPlants(text);
    if (!result.error) {
      setPlants(result.data.filter(p => !!p.common_name));
    }
    setLoadingPlants(false);
  }

  const handlePlantSelected = (plant) => {
    onChange({ ...form, title: plant.common_name, treflePlant: plant });
    setPlants([]);
  }

  return (
    <View style={{flex: 1, zIndex: 1}}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Tree Name
        </Text>
        <Text style={{ fontWeight: 'normal', fontSize: 14 }}> (Required)</Text>
      </View>
      <Autocomplete
        containerStyle={{ zIndex: 1, backgroundColor: 'white' }}
        style={{ paddingLeft: 10, borderRadius: 10 }}
        inputContainerStyle={{ borderColor: 'gray' }}
        data={plants}
        value={form.title}
        onChangeText={handleChangeText}
        renderResultList={() => {
          return (
            <ScrollView
              style={{ backgroundColor: 'white', position: 'absolute', left: 0, right: 0, maxHeight: deviceHeight / 2, zIndex: 1, borderWidth: 1, borderColor: 'gray', borderTopWidth: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
            >
              { !loadingPlants && plants.map((plant) => (
                  <TouchableOpacity
                    key={plant.slug}
                    onPress={() => handlePlantSelected(plant)}
                  >
                    <View style={{ margin: 10, paddingBottom: 10, borderBottomColor: 'gray', borderBottomWidth: 1, flexDirection: 'row' }}>
                      <Image
                        source={{ uri: plant.image_url }}
                        style={{ width: '50%', aspectRatio: 1, marginRight: 10, backgroundColor: 'lightgray', borderRadius: 10 }}
                      />
                      <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        <View>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={{ fontSize: 20, marginBottom: 10 }}>{plant.common_name}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={{ marginRight: 5, fontWeight: 'bold' }}>Family:</Text>
                            <Text style={{  }}>{plant.family}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={{ marginRight: 5, fontWeight: 'bold' }}>Genus:</Text>
                            <Text style={{  }}>{plant.genus}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          )
        }}
      />
      {loadingPlants && (
        <View style={{ backgroundColor: 'white', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          <Text style={{ padding: 10 }}>Loading...</Text>
        </View>
      )}
    </View>
  )
}

export default PostTitle;
