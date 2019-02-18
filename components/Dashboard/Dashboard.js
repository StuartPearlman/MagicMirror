import React from 'react';
import { StyleSheet, View } from 'react-native';
import CameraFaceDetector from '../CameraFaceDetector/CameraFaceDetector';
import Clock from '../Clock/Clock';

let styles;

export default function DashBoard() {
  return (
    <CameraFaceDetector>
      <View style={styles.container}>
        <Clock />
      </View>
    </CameraFaceDetector>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
