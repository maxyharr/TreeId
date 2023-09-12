import { debounce } from 'lodash-es';
import React from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { useApi } from '../../contexts/AppContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PostTitle = ({ form, onChange }) => {
  if (!form) return null;

  const { trefleApi } = useApi();

  const [plants, setPlants] = React.useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState({});

  const loadPlants = React.useCallback(async (text) => {
    debounce(async () => {
      const result = await trefleApi.searchPlants(text);
      if (!result.error) {
        setPlants(result.data.filter(p => !!p.common_name));
      }
    }, 500)();
  })

  return (
    <View style={{flex: 1, zIndex: 1}}>
      <Autocomplete
        data={plants}
        placeholder='Tree Name'
        defaultValue={JSON.stringify(selectedPlant) == '{}' ? '' : selectedPlant.common_name}
        onChangeText={loadPlants}
        renderResultList={() => (
          <View style={{ position: 'absolute', backgroundColor: 'white', left: 0, right: 0 }}>
            {plants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                onPress={() => {
                  setSelectedPlant(plant);
                  setPlants([]);
                  onChange({ ...form, title: plant.common_name });
                }}
              >
                <View style={{ margin: 10, flexDirection: 'row' }}>
                  <Image source={{ uri: plant.image_url }} style={{ width: 50, height: 50, marginRight: 10 }} />
                  <View>
                    <Text>{plant.common_name}</Text>
                    <Text style={{ color: 'gray' }}>{plant.genus}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
