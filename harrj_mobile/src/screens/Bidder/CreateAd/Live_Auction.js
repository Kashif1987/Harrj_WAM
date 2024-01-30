import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Image, View } from "react-native";
import { Appbar } from "react-native-paper";
import { connect } from "react-redux";
import { compose } from "redux";
import images from "../../../assets/images/images";
import LiveNow from './LiveNow';
import ScheduleLive from './ScheduleLiveAuction';

const Tab = createMaterialTopTabNavigator();

class LiveAuction extends React.Component {


    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}>

                <Appbar.Header
                    style={{ backgroundColor: 'white', elevation: 0 }}
                >
                    <Appbar.BackAction
                        onPress={(props) => { this.props.navigation.goBack(null) }}
                    />

                    {/* Harrj Logo */}

                    <View style={{ flex: 1 }}>
                        <Image style={{ resizeMode: 'contain', width: 75, }}
                            source={images.ic_harjj_logo} />
                    </View>
                </Appbar.Header>
                <NavigationContainer>
                    <Tab.Navigator
                        defaultScreenOptions={{
                            swipeEnabled: true,
                        }}
                    >
                        <Tab.Screen name="Schedule" component={ScheduleLive} />
                        <Tab.Screen name="Live Now" component={LiveNow} />
                    </Tab.Navigator>
                </NavigationContainer>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    loginUser: state.authReducer.loginUser
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),

)(LiveAuction);