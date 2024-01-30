import React from "react";
import { StyleSheet, View } from 'react-native';

export default function CustomCard(props) {

    return (
        <View style={style.cardStyle}>
            <View style={style.cardContent}>
                {props.children}
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    cardStyle: {
        borderTopEndRadius: 50,
        borderTopStartRadius: 50,
        borderBottomEndRadius: 50,
        borderBottomStartRadius: 50,
        elevation: 5,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        // marginVertical: 6,
        backgroundColor: 'white',
        height: '100%',
        marginHorizontal: 10,
        width: '90%',
        alignSelf: 'center'
    },
    cardContent: {
        marginHorizontal: 5,
        marginVertical: 20,
    }
});
