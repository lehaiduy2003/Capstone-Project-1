import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';



const Splash = () => {
  return (
    <View style={styles.container}>
      <LottieView style={styles.splashContainer} source={require('../assets/animation/eco_splash_v2.json')} autoPlay loop />
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeImage: {
    width: 200,
    height: 200,
  },
  splashContainer: {
    height: 300,
    width: 300,
  }
})