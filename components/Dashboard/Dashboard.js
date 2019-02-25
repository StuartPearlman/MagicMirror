import React from 'react';
import { StyleSheet, View } from 'react-native';
import CameraFaceDetector from '../CameraFaceDetector/CameraFaceDetector';
import Weather from '../Weather/Weather';
import Clock from '../Clock/Clock';
import Transit from '../Transit/Transit';
import DailyQuote from '../DailyQuote/DailyQuote';

let styles;

export default function DashBoard() {
  return (
    <CameraFaceDetector>
      <View style={styles.container}>
        <Clock />
        <Weather />
        <Transit />
        <DailyQuote />
      </View>
    </CameraFaceDetector>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
