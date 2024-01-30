import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';



export default class Explore_Btn extends React.Component {
    statee = {
        names: [
            {
                id: 0,
                name: 'All',
            },
            {
                id: 1,
                name: 'Normal',
            },
            {
                id: 2,
                name: 'Live',
            },
        ]
    }

    tabChangeFunc = (id, name) => {
        this.setState({ activeIndex: id, })
    }
    state = { activeIndex: 0 };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                <View style={{ padding: 10, flexDirection: 'row', }}>
                    {
                        this.statee.names.map((item, index) =>
                        (
                            <TouchableOpacity
                                key={item.id}
                                // onPress={() => { this.setState({ activeIndex: item.id }), console.log(item.name) }}
                                onPress={() => { this.tabChangeFunc(item.id, item.name); }}
                                style={this.state.activeIndex === item.id ? Products.btnActive : styles.btn}>
                                <Text style={this.state.activeIndex === item.id ? styles.activetext : styles.text}> {item.name} </Text>
                            </TouchableOpacity>
                        )
                        )

                    }
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        // backgroundColor: '#DDDDDD',
        // borderColor: '#dc00ff',
        // borderRadius: 10,
        // borderWidth: 1,
        // padding: 10,
        // marginHorizontal: 5,
        flex: 1
    },
    btnActive: {
        alignItems: 'center',
        // backgroundColor: '#dc00ff',
        // borderColor: '#dc00ff',
        // borderRadius: 10,
        // borderWidth: 1,
        // marginHorizontal: 5,
        flex: 1
        // padding: 10,
        // elevation: 10,

    },
    activetext: {
        color: '#2D2C71',
        fontFamily: 'Rubik-Medium',
        alignSelf: 'center',
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2D2C71',
    },
    text: {
        color: 'black',
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
    }
});
