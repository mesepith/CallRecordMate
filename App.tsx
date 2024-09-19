import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Contacts from 'react-native-contacts';
import axios from 'axios';

export default function App() {
  const IP = '42.108.74.159'; // Your backend IP
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch contacts on component mount
  useEffect(() => {
    // Request permission to access contacts
    Contacts.requestPermission().then(permission => {
      if (permission === 'authorized') {
        Contacts.getAll()
          .then(contacts => {
            // Sort contacts by name
            const sortedContacts = contacts.sort((a, b) => 
              (a.givenName + ' ' + a.familyName).localeCompare(b.givenName + ' ' + b.familyName)
            );
            setContacts(sortedContacts);
            setFilteredContacts(sortedContacts); // Initialize filtered contacts
          })
          .catch(error => {
            console.error('Error fetching contacts', error);
          });
      } else {
        alert('Permission to access contacts was denied');
      }
    });
  }, []);

  // Filter contacts based on search text
  const filterContacts = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = contacts.filter(contact => {
        const contactName = (contact.givenName + ' ' + contact.familyName).toLowerCase();
        const contactPhone = contact.phoneNumbers.map(phone => phone.number).join(' ');
        return contactName.includes(text.toLowerCase()) || contactPhone.includes(text);
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

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
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or phone number"
        value={searchText}
        onChangeText={filterContacts}
      />
      <FlatList
        data={filteredContacts}
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
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
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
