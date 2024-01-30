import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#4499ff',
    borderRadius: 5,
    marginBottom: 2,
    elevation: 10,
  },
  text: {
    fontSize: 12,
    color: '#fff',
  },
});

export default memo(Label);