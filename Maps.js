import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerLayout } from 'react-native-gesture-handler';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import Sidebar from './Sidebar';

const specificCoords = {
  latitude: 10.821487179487,
  longitude: 90.048732583518,
};

// Coordinates for unsafe zones (Example coordinates)
const unsafeZoneCoordinates = [
  { latitude: 10.5, longitude: 89.5 },
  { latitude: 10.5, longitude: 90.5 },
  { latitude: 11.5, longitude: 90.5 },
  { latitude: 11.5, longitude: 89.5 },
];

const circleRadius = 50000; // Radius of the circle in meters

export default function Maps() {
  const route = useRoute();
  const { location } = route.params;
  const drawerRef = React.createRef();

  const [region, setRegion] = useState({
    latitude: location ? location.latitude : specificCoords.latitude,
    longitude: location ? location.longitude : specificCoords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: location ? location.latitude : specificCoords.latitude,
    longitude: location ? location.longitude : specificCoords.longitude,
  });

  const [clickedPosition, setClickedPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecenter = () => {
    const newRegion = {
      ...specificCoords,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    setMarkerPosition(specificCoords);
    setClickedPosition(null);
    setDistance(null);
  };

  const handleRedirectToPulicat = () => {
    const newRegion = {
      latitude: 17.69,
      longitude: 83.30,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    setMarkerPosition(newRegion);
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

  const handleForecast = () => {
    const getData = async () => {
      try {
        const API_URL = 'http://192.168.43.211:5000/api/forecast';
        const response = await axios.post(API_URL, { ssh_data: [clickedPosition.latitude, clickedPosition.longitude] });
        setForecast(response.data.forecast);
      } catch (error) {
        setError(`Error fetching forecast: ${error.response ? error.response.data.error : error.message}`);
      } finally {
        setForecastLoading(false);
      }
    };

    if (!clickedPosition) {
      console.error('Clicked position is not defined.');
      return;
    }

    setForecastLoading(true);
    setError(null);
    getData();
  };

  useEffect(() => {
    handleForecast();
  }, [modalVisible]);

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
                title="Clicked Position"
                pinColor="green"
              />
              <Polyline
                coordinates={[markerPosition, clickedPosition]}
                strokeColor="#000"
                strokeWidth={2}
              />
            </>
          )}

          {/* Unsafe Zone Circles */}
          {unsafeZoneCoordinates.map((coord, index) => (
            <Circle
              key={index}
              center={coord}
              radius={circleRadius}
              strokeColor="red"
              strokeWidth={2}
              fillColor="rgba(255, 0, 0, 0.2)" // Light red fill color
            />
          ))}

        </MapView>

        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => drawerRef.current.openDrawer()}
        >
          <Ionicons name="menu" size={32} color="black" />
        </TouchableOpacity>

        <Button title="Recenter" onPress={handleRecenter} />

        {/* Icon to redirect to Pulicat Lake */}
        <TouchableOpacity
          style={styles.routeButton}
          onPress={handleRedirectToPulicat}
        >
          <Ionicons name="navigate" size={32} color="white" />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Distance: {distance} km</Text>
              {forecastLoading ? (
                <Text style={styles.modalText}>Loading...</Text>
              ) : forecast !== null ? (
                <>
                  <Text style={styles.modalText}>Forecast Value: {forecast}</Text>
                  <Text
                    style={[
                      styles.modalText,
                      forecast >= 11 ? styles.notSafeText : styles.safeText
                    ]}
                  >
                    {forecast >= 11 ? 'Not Safe Zone' : 'Safe Zone'}
                  </Text>
                </>
              ) : (
                <Text style={styles.modalText}>No data</Text>
              )}
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.forecastButton}
                onPress={() => handleForecast()}
              >
                <Text style={styles.forecastButtonText}>Get Forecast</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  hamburgerButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  routeButton: {
    position: 'absolute',
    bottom: 40,
    right: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  safeText: {
    color: 'green',
  },
  notSafeText: {
    color: 'red',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  forecastButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  forecastButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
