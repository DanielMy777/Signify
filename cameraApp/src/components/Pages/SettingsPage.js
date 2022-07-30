import {View, Text} from 'react-native';
import React from 'react';
import TextTranslator from '../General/TextTranslator';
import FontName from '../General/FontName';
const SettingsPage = () => {
  return (
    <View>
      <TextTranslator
        textStyle={{fontSize: 25, fontFamily: FontName.BabyBlock}}
        text={'meow hatola sli '.toUpperCase()}
      />
    </View>
  );
};

export default SettingsPage;
