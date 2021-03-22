import React from 'react';
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import * as handpose from '@tensorflow-models/handpose'
//require('@tensorflow/tfjs-backend-webgl');

export default class CocoSsdScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      isModelReady: false,
      predictions: null,
      camera: null
    };
  }

  //텐서플로우 모델 로딩.
  async componentDidMount() {
    await tf.ready();
    this.setState({ isTfReady: true,});

    this.model = await handpose.load(); 
    this.setState({ isModelReady: true });
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
});
