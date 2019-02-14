import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, Text, View, StatusBar,
} from 'react-native';
import {
  Camera, FaceDetector, Permissions, Brightness,
} from 'expo';

let styles;

export default class CameraFaceDetector extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  state = {
    hasCameraPermission: null,
    hasBrightnessPermission: null,
    faceDetected: false,
    isFaceDetectedTimeoutActive: false,
  };

  async componentWillMount() {
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: brightnessStatus } = await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS);

    this.setState({
      hasCameraPermission: cameraStatus === 'granted',
      hasBrightnessPermission: brightnessStatus === 'granted',
    });
  }

  handleFacesDetected = async ({ faces }) => {
    const { isFaceDetectedTimeoutActive, hasBrightnessPermission } = this.state;

    if (isFaceDetectedTimeoutActive) {
      return;
    }

    if (faces.length) {
      if (hasBrightnessPermission) {
        await Brightness.setSystemBrightnessAsync(1);
      }

      this.setState({
        faceDetected: true,
        isFaceDetectedTimeoutActive: true,
      });

      setTimeout(() => this.setState({ isFaceDetectedTimeoutActive: false }), 5000);
    } else {
      if (hasBrightnessPermission) {
        await Brightness.setSystemBrightnessAsync(0);
      }

      this.setState({ faceDetected: false });
    }
  };

  render() {
    const { hasCameraPermission, faceDetected } = this.state;
    const { children } = this.props;

    if (hasCameraPermission === null) {
      return <View />;
    }

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.front}
          onFacesDetected={this.handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Mode.none,
            runClassifications: FaceDetector.Constants.Mode.none,
          }}
        >
          <View style={styles.blackBackground}>
            {faceDetected && children}
          </View>
        </Camera>
      </View>
    );
  }
}

styles = StyleSheet.create({
  blackBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
});
