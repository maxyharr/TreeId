import React from 'react';
import { View, Text, TextInput } from 'react-native';

const PostTitle = () => {
  const [title, setTitle] = React.useState('');

  return (
    <View>
      <TextInput
        autoFocus={true}
        placeholder="Tree Name"
        style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, backgroundColor: 'white', padding: 10 }}
        value={title}
        onChangeText={text => setTitle(text)}
      />
    </View>
  )
}

export default PostTitle;
