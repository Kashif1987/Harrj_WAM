import { Slider } from "@mui/material";
import React from "react";
import { Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Video from "react-native-video";
import { getProductInfo } from "../actions/getProductInfo.action";

class SliderCarousel extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            progress: false,
            productDetail: [],
            productInfo: [],

            imagelist: [
                "https://m.media-amazon.com/images/I/61FxsUbnavL._SL1500_.jpg",
                "https://img.poorvika.com/1600_JPG/Smart-Technology/Oneplus/OnePlus-Watch/OnePlus%20Watch.jpg",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            ]
        };

    }

    getProductInfo = () => {
        try {
            const { navigation, dispatch } = this.props;
            console.log("navigation")
            console.log(navigation.getParam('product_id'))

            // const { navigate } = this.props.navigation; 
            const product_ID = navigation.getParam('product_id')


            dispatch(getProductInfo(product_ID))
                .then((response) => {
                    console.log("dispatch response getProduct: ");
                    console.log(response);
                    if (response && typeof response !== "undefined" && response !== "") {
                        // this.setState({ progress: false });
                        this.setState({ productInfo: response.data });
                    } else {
                        // this.setState({ progress: false });
                        Alert.alert('something went wrong..!!');
                    }
                })
                .catch((error) => {
                    // this.setState({ progress: false });
                    console.log("dispatch error: ");
                    console.log(error);
                    Alert.alert(error.message);
                });
        } catch (errorCatch) {
            Alert.alert(errorCatch.message);
            // this.setState({ progress: false });
        }
    }



    render() {
        return (
            <View>
                {this.state.productInfo && this.state.productInfo.length > 0 &&
                    this.state.productInfo.map((productItem) => (
                        <ScrollView
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <Image
                                width={200}
                                height={200}
                                source={{ uri: this.state.imagelist }}
                            />
                            <Video

                            />

                        </ScrollView>
                    ))}
            </View>
        )
    }
}


export default SliderCarousel;