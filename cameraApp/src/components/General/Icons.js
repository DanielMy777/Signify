import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import React from 'react';

class VectorIconType {
  static MatterialCommunity = 'MaterialCommunityIcons';
  static IonIcons = 'IonIcons';
}

const GeneralIcon = ({Type, name, size, color, style}) => {
  const create_icon = (type, name, size, color, style) => {
    if (type == VectorIconType.MatterialCommunity) {
      return (
        <MaterialCommunityIcons
          size={size}
          color={color}
          name={name}
          style={style}
        />
      );
    }
    if (type == VectorIconType.IonIcons) {
      return <IonIcon name={name} size={size} color={color} style={style} />;
    }

    throw 'IconType not supported';
  };

  return create_icon(Type, name, size, color, style);
};

module.exports = {
  VectorIconType,
  GeneralIcon,
};
