import RNCallKeep from 'react-native-callkeep';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import axios from 'axios';

export default function App() {
  const IP = 'call-record-mate.zahiralam.com/'; // Your backend URL
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false); // To control call state
  const [callDuration, setCallDuration] = useState(0); // Timer for call duration
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    const options = {
      ios: {
        appName: 'CallRecordMate',
        includesCallsInRecents: false,
      },
    };

    RNCallKeep.setup(options); // Setup CallKeep
  }, []);

  useEffect(() => {
    Contacts.checkPermission().then(permission => {
      if (permission === 'authorized') {
        fetchContacts();
      } else if (permission === 'undefined') {
        requestContactsPermission();
      } else if (permission === 'denied') {
        alert('Permission to access contacts was denied. Please enable it in settings.');
      }
    });
  }, []);

  useEffect(() => {
    let timer;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  const fetchContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        const sortedContacts = contacts.sort((a, b) => (a.givenName + ' ' + a.familyName).localeCompare(b.givenName + ' ' + b.familyName));
        setContacts(sortedContacts);
        setFilteredContacts(sortedContacts);
      })
      .catch(error => {
        console.error('Error fetching contacts', error);
      });
  };

  const requestContactsPermission = () => {
    Contacts.requestPermission().then(permission => {
      if (permission === 'authorized') {
        fetchContacts();
      } else {
        alert('Permission to access contacts was denied');
      }
    });
  };

  const filterContacts = (text) => {
    setSearchText(text);

    if (text) {
      const lowerCaseText = text.toLowerCase();
      const normalizedSearchText = text.replace(/\D/g, '');

      const filtered = contacts.filter(contact => {
        const fullName = `${contact.givenName} ${contact.familyName || ''}`.toLowerCase().trim();
        const nameMatch = fullName.includes(lowerCaseText);
        const contactPhoneNumbers = contact.phoneNumbers.map(phone => normalizePhoneNumber(phone.number));
        const phoneMatch = contactPhoneNumbers.some(number => number.includes(normalizedSearchText));

        return nameMatch || phoneMatch;
      });

      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const normalizePhoneNumber = (number) => {
    return number.replace(/\D/g, ''); // Remove all non-numeric characters
  };

  const startCall = () => {
    if (phoneNumber) {
      setIsCalling(true);

      axios.post('https://' + IP + '/start-call', { to: phoneNumber })
        .then(response => {
          console.log('Call started successfully');
          if (Platform.OS === 'ios') {
            RNCallKeep.setCurrentCallActive(true);  // Indicate call is active
            RNCallKeep.setAudioRouteToSpeaker(true); // Force speaker
          }
        })
        .catch(error => {
          console.error('Error starting call:', error.message);
          alert('Error starting call: ' + error.message);
        });
    } else {
      alert('Please select a contact to call');
    }
  };

  const selectContact = (contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      setPhoneNumber(normalizePhoneNumber(contact.phoneNumbers[0].number));
      setSelectedContactId(contact.recordID);
    } else {
      alert('Selected contact does not have a phone number');
    }
  };

  return (
    <View style={styles.container}>
      {isCalling ? (
        <View style={styles.callScreen}>
          <Text style={styles.callTitle}>Calling...</Text>
          <Text style={styles.timer}>Call Duration: {callDuration} seconds</Text>
          <Button title="End Call" onPress={() => setIsCalling(false)} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>Call Record Mate</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or phone number"
            value={searchText}
            onChangeText={(text) => filterContacts(text)}
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center', color: '#000' },
  searchInput: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, paddingHorizontal: 8, color: '#000' },
  contactItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  contactText: { fontSize: 18, color: '#000' },
  callScreen: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  callTitle: { fontSize: 24, marginBottom: 10 },
  timer: { fontSize: 20, marginBottom: 20 },
});
