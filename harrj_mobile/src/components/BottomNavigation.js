import PropTypes from 'prop-types';
import React from "react";
import { Image, View } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";



class BottomNav extends React.Component {

    constructor(props) {
        super(props);
    }

    state = { activeIndex: 0 };

    render() {
        return (

            <TouchableOpacity
                style={{
                    height: '100%', justifyContent: 'center', width: '100%'
                }}
                onPress={this.props.onPress}
            >

                <Image
                    source={this.props.icon}
                    style={{
                        tintColor: this.props.color,
                        height: 24, width: 24,
                    }}
                />
                {/* <Ionicons
                        name={this.props.icon}
                        size={28}
                        color={this.props.color}
                    /> */}

            </TouchableOpacity>


        )

    }
}
BottomNav.propTypes = { onPress: PropTypes.func, icon: PropTypes.object.isRequired, color: PropTypes.string };



export default BottomNav;