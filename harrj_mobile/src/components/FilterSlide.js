import React from "react";
import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import ReactNativeModal from "react-native-modal";




class FilterSlide extends React.Component {

    state = {
        isVisible: false,
    }

    render() {
        return (
            <View>
                <ReactNativeModal
                    isVisible={this.state.isVisible}
                    animationIn={"fadeIn"}
                    animationOut={"fadeOut"}
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    useNativeDriver={true}
                    style={{ width: 200, alignSelf: 'flex-end', margin: 5 }}
                >
                    <View style={styles.modal}>
                        <Text style={styles.text}>This is Filter</Text>
                        <Button
                            title="Close"
                            onPress={() => {
                                this.setState({ isVisible: false })
                            }}
                        />
                    </View>
                </ReactNativeModal>
            </View>
        )
    }
}

export default FilterSlide;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        height: '100%'
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00BCD4",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        // marginTop: 80,
        // marginLeft: 40,

    },
    text: {
        color: '#3f2949',
        marginTop: 10
    }
});  