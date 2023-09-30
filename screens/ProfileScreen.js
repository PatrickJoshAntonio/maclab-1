import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';

const Stack = createNativeStackNavigator();

const ProfileScreen = () => {
  const [visibleName, setVisibleName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const handleSave = async () => {
    const user = initializeApp.auth().currentUser;

    if (user) {
      const userId = user.uid;
      try {
        await initializeApp.firestore().collection('users').doc(userId).set({
          visibleName,
          bio
        });
        console.log('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>Choose your image</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter Visible Name"
        value={visibleName}
        onChangeText={setVisibleName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Bio"
        value={bio}
        onChangeText={setBio}
        multiline={true}
        numberOfLines={4}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  imagePickerButton: {
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePickerText: {
    color: 'blue',
  },
});

export default ProfileScreen;