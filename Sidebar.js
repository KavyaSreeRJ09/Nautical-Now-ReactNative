import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Sidebar({ closeMenu }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Edit Profile')}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Home')}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Settings')}>
        <Text>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
        <Text style={styles.closeButtonText}>Close Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'black',
  },
});
