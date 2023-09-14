import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AddTreeButton = ({ onPress }) => (
  <TouchableOpacity style={styles.addTreeButton} onPress={onPress}>
    <FontAwesome name="plus" size={24} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  addTreeButton: {
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTreeButtonText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddTreeButton;
