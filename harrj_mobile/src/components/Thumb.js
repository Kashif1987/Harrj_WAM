import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const THUMB_RADIUS = 10;

const Thumb = () => {
    return (
        <View style={styles.root} />
    );
};

const styles = StyleSheet.create({
    root: {
        width: THUMB_RADIUS * 2,
        height: THUMB_RADIUS * 2,
        borderRadius: 15,
        borderWidth: 4,
        borderColor: '#4499ff',
        backgroundColor: '#ffffff',
        elevation: 3
    },
});

export default memo(Thumb);