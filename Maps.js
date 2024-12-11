import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const boatIconRef = useRef(null);

  useEffect(() => {
    if (isNavigating && clickedPosition) {
      // Start animation when navigation begins
      const interval = setInterval(() => {
        setAnimationProgress((prev) => {
          const newProgress = prev + 0.01;
          if (newProgress >= 1) {
            clearInterval(interval);
            setIsNavigating(false); // Stop navigation when it reaches the destination
            return 1;
          }

          // Log the interpolated position
          const interpolatedPosition = {
            latitude: markerPosition.latitude + (clickedPosition.latitude - markerPosition.latitude) * newProgress,
            longitude: markerPosition.longitude + (clickedPosition.longitude - markerPosition.longitude) * newProgress,
          };
          console.log(`Boat Position: ${interpolatedPosition.latitude}, ${interpolatedPosition.longitude}`);

          return newProgress;
        });
      }, 100);
    }
  }, [isNavigating]);

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
    setIsNavigating(false); // Stop navigation
    setAnimationProgress(0); // Reset animation progress
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
    setIsNavigating(false); // Stop navigation
    setAnimationProgress(0); // Reset animation progress
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
    if (modalVisible) {
      handleForecast();
    }
  }, [modalVisible]);

  const startNavigation = () => {
    setIsNavigating(true);  // Start navigation
    setAnimationProgress(0);  // Reset animation progress
    setModalVisible(false);  // Hide the modal when navigation starts
  };
  

  const interpolatedPosition = clickedPosition ? {
    latitude: markerPosition.latitude + (clickedPosition.latitude - markerPosition.latitude) * animationProgress,
    longitude: markerPosition.longitude + (clickedPosition.longitude - markerPosition.longitude) * animationProgress,
  } : markerPosition;

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
            <Marker
              coordinate={clickedPosition}
              title="Clicked Position"
              pinColor="green"
            />
          )}
          {isNavigating && clickedPosition && (
            <>
              <Marker
                coordinate={interpolatedPosition}
                title="Boat"
                ref={boatIconRef}
                pinColor="blue"
              >
                <Ionicons name="boat" size={32} color="blue" />
              </Marker>
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

        <Button title=" " onPress={handleRecenter} />

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
                    style={[styles.modalText, forecast >= 11 ? styles.notSafeText : styles.safeText]}
                  >
                    {forecast >= 11 ? 'Not Safe' : 'Safe'}
                  </Text>
                </>
              ) : (
                error && <Text style={styles.errorText}>{error}</Text>
              )}

              <TouchableOpacity
                style={styles.forecastButton}
                onPress={handleForecast}
              >
                <Text style={styles.forecastButtonText}>Get Forecast</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationButton}
                onPress={startNavigation}  // Navigation starts here, and modal closes
              >
                <Text style={styles.navigationButtonText}>Start Navigation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
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
  },
  map: {
    flex: 1,
  },
  hamburgerButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 1,
  },
  routeButton: {
    position: 'absolute',
    bottom: 70,
    right: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  forecastButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  forecastButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  navigationButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  navigationButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
