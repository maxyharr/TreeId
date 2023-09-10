import React from 'react';
import { Button, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import NewPost2 from './NewPost2/NewPost2';

const Stack = createStackNavigator();

const AddTreeStack2 = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('ImageConfirmation')}
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
