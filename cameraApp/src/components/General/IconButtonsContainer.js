import {View, StyleSheet} from 'react-native';
import React from 'react';
import {GeneralIcon, VectorIconType} from './Icons';
import {PressableOpacity} from 'react-native-pressable-opacity';
const IconButtonsContainer = ({
  style,
  IconColor = 'black',
  IconSize = 50,
  Buttons,
}) => {
  return (
    <View style={[style, styles.shadowProp]}>
      {Buttons.map((button, index) => {
        return (
          <PressableOpacity key={index} onPress={button.onPress}>
            <GeneralIcon
              Type={
                button.type ? button.type : VectorIconType.MatterialCommunity
              }
              name={button.name}
              size={IconSize}
              color={button.color ? button.color : IconColor}
            />
          </PressableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowOffset: {width: -2, height: 10},
    shadowColor: 'black',
    elevation: 1,
    borderWidth: 0.8,
  },
});

export default IconButtonsContainer;
