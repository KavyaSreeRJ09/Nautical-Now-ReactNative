import React, { useEffect } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const WaveBackground = () => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={{ transform: [{ translateX: translateX }] }}>
        <Svg height={height} width={width * 2} viewBox={`0 0 ${width * 2} ${height}`}>
          <Path
            d={`M0,${height * 0.75} Q${width / 2},${height} ${width},${height * 0.75} T${width * 2},${height * 0.75} V${height} H0 Z`}
            fill="#1e90ff"
            fillOpacity="0.5"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default WaveBackground;
