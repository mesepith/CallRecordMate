import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {

  const IP='42.108.74.159'; //VI 52

  const [phoneNumber, setPhoneNumber] = React.useState('');

  const startCall = () => {
    axios.post('http://'+IP+'/start-call', { to: phoneNumber })
      .then(response => {
        alert('Call started successfully');
      })
      .catch(error => {
        alert('Error starting call: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Call Record Mate</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholderTextColor="#888"
      />
      <Button title="Start Call" onPress={startCall} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF', // Set background color to white
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#000', // Set text color to black
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: '#000', // Set input text color to black
  },
});
