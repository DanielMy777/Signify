import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';

class VectorIconType {
  static MatterialCommunity = 'MaterialCommunityIcons';
  static IonIcons = 'IonIcons';
  static MaterialIcons = 'MaterialIcons';
  static FontAwesome = 'FontAwesome';
}

const GeneralIcon = ({
  Type = VectorIconType.MatterialCommunity,
  name,
  size,
  color,
  style,
}) => {
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
    if (type == VectorIconType.MaterialIcons) {
      return (
        <MaterialIcons size={size} name={name} style={style} color={color} />
      );
    }
    if (type == VectorIconType.FontAwesome) {
      return (
        <FontAwesome size={size} name={name} style={style} color={color} />
      );
    }

    throw 'IconType not supported';
  };

  return create_icon(Type, name, size, color, style);
};

module.exports = {
  VectorIconType,
  GeneralIcon,
};
