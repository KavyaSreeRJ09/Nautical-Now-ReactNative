import React, { useState, useEffect } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

export default function SlidingMessage({ message, visible }) {
  const [slideAnim] = useState(new Animated.Value(100)); // Start off-screen

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide into view
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 100, // Slide out of view
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.messageContainer, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.messageText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    zIndex: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});