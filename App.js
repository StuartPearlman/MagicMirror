import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera, DangerZone, FaceDetector, Permissions,
} from 'expo';

let styles;

export default class App extends React.Component {
  static propTypes = {
    countDownSeconds: PropTypes.number,
    motionInterval: PropTypes.number, // ms between each device motion reading
    motionTolerance: PropTypes.number, // allowed variance in acceleration
    cameraType: PropTypes.number, // front vs rear facing camera
  };

  static defaultProps = {
    countDownSeconds: 5,
    motionInterval: 500, // ms between each device motion reading
    motionTolerance: 1, // allowed variance in acceleration
    cameraType: Camera.Constants.Type.front, // front vs rear facing camera
  };

  state = {
    hasCameraPermission: null,
    faceDetecting: false, // when true, we look for faces
    faceDetected: false, // when true, we've found a face
    countDownSeconds: 5, // current available seconds before photo is taken
    countDownStarted: false, // starts when face detected
    pictureTaken: false, // true when photo has been taken
    motion: null, // captures the device motion object
    detectMotion: false, // when true we attempt to determine if device is still
  };

  countDownTimer = null;

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount() {
    this.motionListener = DangerZone.DeviceMotion.addListener(this.onDeviceMotion);

    setTimeout(() => { // MH - tempm - wait a few seconds for now before detecting motion
      this.detectMotion(true);
    }, 1000);
  }

  componentWillUpdate(nextProps, nextState) {
    const { detectMotion, motion } = this.state;
    const { motionTolerance } = this.props;

    if (detectMotion && nextState.motion && motion) {
      if (
        Math.abs(nextState.motion.x - motion.x) < motionTolerance
          && Math.abs(nextState.motion.y - motion.y) < motionTolerance
          && Math.abs(nextState.motion.z - motion.z) < motionTolerance
      ) {
        // still
        this.detectFaces(true);
        this.detectMotion(false);
      } else {
        // moving
      }
    }
  }

  detectMotion = (doDetect) => {
    const { motionInterval } = this.props;
    const { faceDetecting } = this.state;

    this.setState({
      detectMotion: doDetect,
    });

    if (doDetect) {
      DangerZone.DeviceMotion.setUpdateInterval(motionInterval);
    } else if (!doDetect && faceDetecting) {
      this.motionListener.remove();
    }
  };

  onDeviceMotion = (rotation) => {
    this.setState({
      motion: rotation.accelerationIncludingGravity,
    });
  };

  handleFaceDetectionError = () => {
    //
  };

  handleFacesDetected = ({ faces }) => {
    const { faceDetected, countDownStarted } = this.state;

    if (faces.length === 1) {
      this.setState({
        faceDetected: true,
      });

      if (!faceDetected && !countDownStarted) {
        this.initCountDown();
      }
    } else {
      this.setState({ faceDetected: false });
      this.cancelCountDown();
    }
  };

  initCountDown = () => {
    this.setState({
      countDownStarted: true,
    });

    this.countDownTimer = setInterval(this.handleCountDownTime, 1000);
  };

  cancelCountDown = () => {
    const { countDownSeconds } = this.props;
    clearInterval(this.countDownTimer);

    this.setState({
      countDownSeconds,
      countDownStarted: false,
    });
  };

  handleCountDownTime = () => {
    const { countDownSeconds } = this.state;

    if (countDownSeconds > 0) {
      const newSeconds = countDownSeconds - 1;

      this.setState({
        countDownSeconds: newSeconds,
      });
    } else {
      this.cancelCountDown();
      this.takePicture();
    }
  };

  takePicture = () => {
    this.setState({
      pictureTaken: true,
    });

    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    }
  };

  onPictureSaved = () => {
    this.detectFaces(false);
  };

  detectFaces(doDetect) {
    this.setState({
      faceDetecting: doDetect,
    });
  }

  render() {
    const {
      hasCameraPermission, faceDetecting, faceDetected, pictureTaken, countDownSeconds,
    } = this.state;

    const { cameraType } = this.props;

    if (hasCameraPermission === null) {
      return <View />;
    }

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={cameraType}
          onFacesDetected={faceDetecting ? this.handleFacesDetected : undefined}
          onFaceDetectionError={this.handleFaceDetectionError}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.fast,
            detectLandmarks: FaceDetector.Constants.Mode.none,
            runClassifications: FaceDetector.Constants.Mode.none,
          }}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              position: 'absolute',
              bottom: 0,
            }}
          >
            <Text
              style={styles.textStandard}
            >
              {faceDetected ? 'Face Detected' : 'No Face Detected'}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              display: faceDetected && !pictureTaken ? 'flex' : 'none',
            }}
          >
            <Text
              style={styles.countdown}
            >
              {countDownSeconds}
            </Text>
          </View>

        </Camera>
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStandard: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  countdown: {
    fontSize: 40,
    color: 'white',
  },
});
