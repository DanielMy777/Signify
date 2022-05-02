import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const SignifyHeader = ({
  style,
  title = 'Signify',
  fontSize = styles.headerTitle.fontSize,
  color = styles.headerTitle.color,
}) => {
  return (
    <View style={{...styles.header, ...style}}>
      <Text style={{...styles.headerTitle, fontSize, color}}>{title}</Text>
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
    fontSize: 30,
    fontFamily: 'RubikMoonrocks-Regular',
  },
});
export default SignifyHeader;
