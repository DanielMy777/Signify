import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import {VectorIconType, GeneralIcon} from './Icons';
const HomePageButtons = ({
  Label,
  FontSize = 20,
  onPress,
  style,
  IconName,
  IconType = VectorIconType.MatterialCommunity,
  IconSize = 30,
  TextColor = 'black',
}) => {
  return (
    <AwesomeButtonRick
      type="primary"
      onPress={onPress}
      backgroundColor="#fcf003"
      textColor={TextColor}
      textSize={FontSize}
      stretch={true}
      backgroundDarker="#fcca03"
      backgroundShadow={null}
      style={style}>
      {IconName && (
        <GeneralIcon
          name={IconName}
          Type={IconType}
          size={IconSize}
          color={TextColor}
          style={{left: -8}}
        />
      )}
      <Text style={{fontSize: FontSize, color: TextColor, fontWeight: 'bold'}}>
        {Label}
      </Text>
    </AwesomeButtonRick>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default HomePageButtons;
