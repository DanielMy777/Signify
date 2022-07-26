import {View, Text} from 'react-native';
import React from 'react';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';

const HomePageButtons = ({Text, FontSize = 20, onPress, style}) => {
  return (
    <AwesomeButtonRick
      type="primary"
      onPress={onPress}
      backgroundColor="#fcf003"
      textColor="black"
      textSize={FontSize}
      stretch={true}
      backgroundDarker="#fcca03"
      backgroundShadow={null}
      style={style}>
      {Text}
    </AwesomeButtonRick>
  );
};

export default HomePageButtons;
