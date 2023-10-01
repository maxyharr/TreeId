import { debounce } from 'lodash-es';
import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import utils from '../../utils';
import trefleApi from '../../trefleApi';
import { FontAwesome } from '@expo/vector-icons';
import TrefleDetails from '../TrefleDetails';

const DataSearch = ({ form, onChange }) => {
  if (!form) return null;
  const deviceHeight = utils.deviceHeight();
  const [plants, setPlants] = React.useState([]);
  const [loadingPlants, setLoadingPlants] = React.useState(false);

  React.useEffect(() => {
    if (form.treflePlant) return;

    (async () => {
      if (form.title) {
        handleChangeText(form.title);
      }
    })()
  }, [form.title]);

  const handleChangeText = async (text) => {
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
    onChange({ ...form, treflePlant: plant });
    setPlants([]);
  }

  return (
    <View style={{flex: 1}}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Scientific Details
        </Text>
        {!form.treflePlant && plants.length > 0 && <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => setPlants([])}>
            <FontAwesome name="times" size={20} style={{ color: 'gray' }}/>
          </TouchableOpacity>
        </View>}

        { !form.treflePlant && plants.length == 0 && !loadingPlants && (
          <Button title="Search" onPress={() => handleChangeText(form.title)} />
        )}

      </View>
      { form.treflePlant && (
        <View>
          <TrefleDetails treflePlant={form.treflePlant} button={() => (
            <TouchableOpacity onPress={() => onChange({ ...form, treflePlant: null })}>
              <FontAwesome name="times" size={20} style={{ color: 'gray' }}/>
            </TouchableOpacity>
          )} />
        </View>
      )}
      { !loadingPlants && !form.treflePlant && plants.length > 0 && (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ backgroundColor: 'white', maxHeight: deviceHeight / 2, zIndex: 1, borderWidth: 1, borderColor: 'gray', borderRadius: 10 }}
          >
            {
              plants.map((plant) => (
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
              )
            )}
          </ScrollView>
        </View>
      ) }
      {loadingPlants && (
        <View style={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 10 }}>
          <Text style={{ padding: 10 }}>Loading...</Text>
        </View>
      )}
    </View>
  )
}

export default DataSearch;
