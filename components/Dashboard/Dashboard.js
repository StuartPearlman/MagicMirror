import React from 'react';
import { Text, View } from 'react-native';
import CameraFaceDetector from '../CameraFaceDetector/CameraFaceDetector';
import Clock from '../Clock/Clock';

export default function DashBoard() {
  return (
    <CameraFaceDetector>
      <View>
        <Text style={{ color: 'white' }}>FACE DETECTED</Text>
        <Clock />
      </View>
    </CameraFaceDetector>
  );
}
