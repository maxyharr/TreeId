import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TreeDetailsScreen = ({ route }) => {
  const { id } = route.params;

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>MarkerDetailsScreen</Text>
      <Image source={{ uri: id }} style={styles.image} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default TreeDetailsScreen;
