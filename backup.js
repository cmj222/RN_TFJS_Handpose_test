유즈스테이트 작업하기 전에 백업.

import React from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import * as handpose from '@tensorflow-models/handpose'

//require('@tensorflow/tfjs-backend-webgl');

import { Camera, Constants } from 'expo-camera'
import * as Permissions from 'expo-permissions';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

const TensorCamera = cameraWithTensors(Camera);

export default class CocoSsdScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      isModelReady: false,
      predictions: null,
      camera: null,
      model: null
    };
  }

  loadingModel = async() =>{
    const model = await handpose.load()
    return model
  }

  //텐서플로우 모델 로딩.
  componentDidMount = async () => {
    await tf.ready();
    this.setState({ isTfReady: true,});

    //this.model = await handpose.load(); 
    this.setState({ isModelReady: true });
    const model = await this.loadingModel()
    this.setState({ isModelReady: true });

    this.setState({model : model})
  }

  handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      const nextImageTensor = images.next().value

      //
      // do something with tensor here
      //this.model = await handpose.load(); 
      if (nextImageTensor) {
        const hand = await this.state.model.estimateHnads(nextImageTensor)
        console.log(hand)
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  render(){
    const { isTfReady, isModelReady } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
           TensorFlow.js ready? {isTfReady ? <Text>✌</Text> : ''}
        </Text>
        <Text style={styles.text}>
            Handpose model ready? {isModelReady ? (<Text style={styles.text}>✌</Text>
        ) : (
          <ActivityIndicator size='small' />
        )}
        </Text>
        
        <TensorCamera
         style={styles.camera}
	       type={Constants.Type.back}
         //type={Camera.Constants.Type.back}

	       // Tensor related props
	       cameraTextureHeight={1200}
	       cameraTextureWidth={1600} 
	       resizeHeight={120}
          //애플은 높이>너비였는데 안드는 반대...리사이즈의 높이너비관계는 애플을 따른것인가?
	       resizeWidth={160}
	       resizeDepth={3}

	       onReady={this.handleCameraStream}
	       autorender={true}
	      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    position: "absolute",
    left: 50,
    top: 100,
    width: 600 / 2,
    height: 800 / 2,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0
  }
});
