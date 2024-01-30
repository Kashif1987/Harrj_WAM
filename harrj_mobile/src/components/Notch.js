import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const Notch = props => {
  return (
    <View style={styles.root} {...props} />
  );
};

export default memo(Notch);

const styles = StyleSheet.create({
  root: {
    width: 8,
    height: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4499ff',
    // borderLeftWidth: 5,
    // borderRightWidth: 5,
    borderTopWidth: 1.5,
  },
}); 