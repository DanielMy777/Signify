import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const SignifyHeader = ({style, title = 'Signify'}) => {
  return (
    <View style={{...styles.header, ...style}}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    top: '0%',
    position: 'relative',
    width: '100%',
    backgroundColor: 'black',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 40,
    fontFamily: 'RubikMoonrocks-Regular',
  },
});
export default SignifyHeader;
