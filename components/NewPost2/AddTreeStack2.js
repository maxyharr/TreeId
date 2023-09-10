import React from 'react';
import { Button, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import NewPost2 from './NewPost2';

const Stack = createStackNavigator();

const AddTreeStack2 = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <Button
              onPress={() => console.log('You need to set up navigation manually in your screen.')}
              title="Next"
            />
          )
        }}
      >
        <Stack.Screen name="New Tree" component={NewPost2} />
      </Stack.Navigator>
    </View>
  )
}

export default AddTreeStack2;
