import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { DrawerLayout } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from './Sidebar';

const marinaBeachCoords = {
  latitude: 13.0475,
  longitude: 80.2824,
};

export default function Maps() {
  const route = useRoute();
  const { location } = route.params;
  const drawerRef = React.createRef();

  const [region, setRegion] = useState({
    latitude: location ? location.latitude : marinaBeachCoords.latitude,
    longitude: location ? location.longitude : marinaBeachCoords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: location ? location.latitude : marinaBeachCoords.latitude,
    longitude: location ? location.longitude : marinaBeachCoords.longitude,
  });

  const [clickedPosition, setClickedPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRecenter = () => {
    const newRegion = {
      ...marinaBeachCoords,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    setMarkerPosition(marinaBeachCoords);
    setClickedPosition(null);
    setDistance(null);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setClickedPosition({ latitude, longitude });
    const distance = calculateDistance(
      markerPosition.latitude,
      markerPosition.longitude,
      latitude,
      longitude
    );
    setDistance(distance.toFixed(2)); // Round to 2 decimal places
    setModalVisible(true); // Show modal on click
  };

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => <Sidebar closeMenu={() => drawerRef.current.closeDrawer()} />}
    >
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={markerPosition}
            title="You are here"
          />
          {clickedPosition && (
            <>
              <Marker
                coordinate={clickedPosition}
                title={`Clicked Point`}
                pinColor="red"
              />
              <Polyline
                coordinates={[markerPosition, clickedPosition]}
                strokeColor="red"
                strokeWidth={2}
              />
            </>
          )}
        </MapView>
        <TouchableOpacity style={styles.menuIcon} onPress={() => drawerRef.current.openDrawer()}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
          <Ionicons name="locate-outline" size={24} color="white" />
        </TouchableOpacity>
        {distance && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>Distance: {distance} km</Text>
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Distance Details</Text>
              <Text style={styles.modalText}>Distance: {distance} km</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  menuIcon: {
    position: 'absolute',
    top: 20, // Lifted a few spaces above
    left: 20,
    zIndex: 10,
    backgroundColor: '#6200EE', // Application's default primary color
    padding: 10,
    borderRadius: 50, // Circular shape
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#6200EE', // Application's default primary color
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: '#6200EE',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  distanceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18, // Increased font size
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
});
