import React from 'react';
import { View, TextInput } from 'react-native';

const PostTitle = ({ form, onChange }) => {
  if (!form) return null;

  return (
    <View>
      <TextInput
        placeholder="Tree Name"
        style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, backgroundColor: 'white', padding: 10 }}
        value={form.title}
        onChangeText={text => onChange({ ...form, title: text })}
      />
    </View>
  )
}

export default PostTitle;
