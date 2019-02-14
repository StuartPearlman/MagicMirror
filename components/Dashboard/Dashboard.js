import React from 'react';
import { Text, View } from 'react-native';
import CameraFaceDetector from '../CameraFaceDetector/CameraFaceDetector';

export default function DashBoard() {
  return (
    <CameraFaceDetector>
      <View>
        <Text style={{ color: 'white' }}>FACE DETECTED</Text>
      </View>
    </CameraFaceDetector>
  );
}
