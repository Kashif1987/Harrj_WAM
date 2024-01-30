import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import images from '../assets/images/images';

const CollapseView = ({ title, description }) => {

    const [collapsed, setCollapsed] = useState(true);
    const [maxLines, setMaxLines] = useState(0);
    const animationHeight = useRef(new Animated.Value(10)).current;

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const collapseView = () => {
        Animated.timing(animationHeight, {
            duration: 1000,
            toValue: 0,
            useNativeDriver: false,
            isInteraction: false,
            delay: 2,
        }).start();
    }

    const expandView = () => {
        setMaxLines(null)
        Animated.timing(animationHeight, {
            duration: 1000,
            toValue: 260,
            useNativeDriver: false,
            delay: 2
        }).start();
    }

    useEffect(() => {
        if (collapsed) {
            collapseView()
        } else {
            expandView()
        }
    }, [collapsed]);

    return (
        <View style={{ overflow: 'hidden', borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5, marginVertical: 10, backgroundColor: 'white' }}>
            <TouchableOpacity
                onPress={toggleCollapsed}
                style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 12, paddingHorizontal: 12 }}>
                <Text
                    style={{
                        fontSize: 16, fontFamily: 'Rubik-Normal'
                    }}
                >{title}</Text>
                <Image style={{ width: 20, height: 20, }}
                    source={images.ic_down_arrow} />
            </TouchableOpacity>
            <Animated.View style={{ maxHeight: animationHeight }}>
                <Text
                    style={{
                        paddingHorizontal: 15, textAlign: 'left', fontFamily: 'Rubik-Medium', fontSize: 14, paddingBottom: 10
                    }}
                >{description}</Text>
            </Animated.View>

        </View>
    );
}


export default CollapseView;
