import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Contacts from 'react-native-contacts';
import axios from 'axios';

export default function App() {
  const IP = '42.108.74.159'; // Your backend IP
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch contacts on component mount
  useEffect(() => {
    // Request permission to access contacts
    Contacts.requestPermission().then(permission => {
      if (permission === 'authorized') {
        Contacts.getAll()
          .then(contacts => {
            setContacts(contacts);
          })
          .catch(error => {
            console.error('Error fetching contacts', error);
          });
      } else {
        alert('Permission to access contacts was denied');
      }
    });
  }, []);

  const startCall = () => {
    if (phoneNumber) {
      axios.post('http://' + IP + '/start-call', { to: phoneNumber })
        .then(response => {
          alert('Call started successfully');
        })
        .catch(error => {
          alert('Error starting call: ' + error.message);
        });
    } else {
      alert('Please select a contact to call');
    }
  };

  const selectContact = (contact) => {
    // Assuming the first phone number is used
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      setPhoneNumber(contact.phoneNumbers[0].number);
    } else {
      alert('Selected contact does not have a phone number');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Call Record Mate</Text>
      <FlatList
        data={contacts}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectContact(item)} style={styles.contactItem}>
            <Text style={styles.contactText}>{item.givenName} {item.familyName}</Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactText: {
    fontSize: 18,
    color: '#000',
  },
});
