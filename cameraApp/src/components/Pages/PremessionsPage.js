import {View, Text, StyleSheet, Button, Linking} from 'react-native';
import React from 'react';
import {request_camera_premession} from '../../AppPremessions/camera-premessions';

const PremessionsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Please Allow Camera Premessions To Continue
      </Text>
      <Button title={'give premession'} onPress={request_camera_premession} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'yellow',
    marginBottom: '2%',
  },
  container: {
    backgroundColor: 'red',
    height: '100%',
    alignItems: 'center',
    paddingTop: '20%',
  },
});

export default PremessionsPage;
