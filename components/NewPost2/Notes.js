import React from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const Notes = ({ form, onChange }) => {
  if (!form) return null;

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <TextInput
        placeholder="Notes"
        multiline={true}
        style={{
          fontSize: 20,
          marginBottom: 10,
          backgroundColor: 'white',
          padding: 10,
          height: 100
        }}
        value={form.notes}
        onChangeText={text => onChange({ ...form, notes: text })}
      />
    </View>
  )
}

export default Notes;
