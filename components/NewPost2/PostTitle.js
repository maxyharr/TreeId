import { debounce } from 'lodash-es';
import React from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { useApi } from '../../contexts/AppContext';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import utils from '../../utils';

const PostTitle = ({ form, onChange }) => {
  if (!form) return null;
  const deviceHeight = utils.deviceHeight();

  const { trefleApi } = useApi();

  const [plants, setPlants] = React.useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState({});

  const loadPlants = debounce(async (text) => {
    if (text === '') return setPlants([]);
    console.log('searching...', text)
    const result = await trefleApi.searchPlants(text);
    if (!result.error) {
      setPlants(result.data.filter(p => !!p.common_name));
    }
  }, 1000);

  const handlePlantSelected = (plant) => {
    setSelectedPlant(plant);
    onChange({ ...form, title: plant.common_name, treflePlant: plant });
    setPlants([]);
  }

  return (
    <View style={{flex: 1, zIndex: 1}}>
      <Autocomplete
        data={plants}
        placeholder='Tree Name'
        defaultValue={JSON.stringify(selectedPlant) == '{}' ? '' : selectedPlant.common_name}
        onChangeText={loadPlants}
        renderResultList={() => (
          <ScrollView
            style={{ backgroundColor: 'white', left: 0, right: 0, maxHeight: deviceHeight / 2, position: 'absolute', zIndex: 1, borderWidth: 1, borderColor: 'gray', borderTopWidth: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
          >
            {plants.map((plant) => (
              <TouchableOpacity
                key={plant.slug}
                onPress={() => handlePlantSelected(plant)}
              >
                <View style={{ margin: 10, paddingBottom: 10, borderBottomColor: 'gray', borderBottomWidth: 1, flexDirection: 'row' }}>
                  <Image source={{ uri: plant.image_url }} style={{ width: '50%', aspectRatio: 1, marginRight: 10 }} />
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
            ))}
          </ScrollView>
        )}
        containerStyle={{ zIndex: 1, backgroundColor: 'white' }}
      />


      {/* <TextInput
        placeholder="Tree Name"
        style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, backgroundColor: 'white', padding: 10 }}
        value={form.title}
        onChangeText={text => onChange({ ...form, title: text })}
      /> */}
    </View>
  )
}

export default PostTitle;
