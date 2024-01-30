import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet, Text,
    View,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    Button,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { Appbar, IconButton, Menu, Provider } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";
import { compose } from "redux";
import ValidationComponent from '../../../ValidationComponent';
import { getProductListAction } from '../../actions/getProductList.action';
import images from '../../assets/images/images';
import { Checkbox } from 'react-native-paper';
import Explore_Btn from '../../components/Explore_btn';
import { DrawerActions } from '@react-navigation/native';
import BottomNav from '../../components/BottomNavigation';
import RangeSlider from 'rn-range-slider';
import CustomCheckBox from "../../components/CustomCheckBox";
import Thumb from '../../components/Thumb';
import Rail from '../../components/Rail';
import RailSelected from '../../components/RailSelected';
import Label from '../../components/Label';
import Notch from '../../components/Notch';

const styles = require('../../assets/css/style');

// for onRefresh 
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
class Products extends React.Component {

    stateName = {
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

    state = { activeIndex: 0 }


    // OnRefresh

    _onRefresh = () => {
        this.setState({ refreshing: true },
            () => { this.filterList }
        );
        wait(1500).then(() => {
            this.setState({ refreshing: false })
        })
    }

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            productList: [],
            refreshing: false,
            customer_id: '',
            name: '',
            auction_type: '',
            category_id: '',
            isChecked: false,
            watchCheck: false,
            mobileCheck: false,
            laptop: false,
            camera: false,
            vehicle: false,
            sub_category_id: '',
        };

        this.getProductInfo = this.getProductInfo.bind(this);
        this.filterList = this.filterList.bind(this);


    }

    openSearch = () => {
        Actions.search();
    }

    openNormalBid = () => {
        Actions.normal_bid();
    }

    openLiveBid = () => {
        Actions.live_bid();
    }

    openHome = () => {
        Actions.main_home();
    }

    // hide show Filter

    handleCheckBox = () => {
        console.log('Pressed')
        this.setState({ isChecked: !this.state.isChecked })
    }
    openMenu = () => this.setState({ isVisible: true });

    closeMenu = () => this.setState({ isVisible: false });

    handleCheckBox1 = () => {
        console.log('Pressed')
        this.setState({ watchCheck: !this.state.watchCheck })
    }

    handleCheckBox2 = () => {
        console.log('Pressed')
        this.setState({ mobileCheck: !this.state.mobileCheck })
    }

    handleCheckBox3 = () => {
        console.log('Pressed')
        this.setState({ camera: !this.state.camera })
    }

    handleCheckBox4 = () => {
        console.log('Pressed')
        this.setState({ vehicle: !this.state.vehicle })
    }

    tabChangeFunc = (id, name) => {
        var auctionTypeStr = ''
        if (id === 0) {
            auctionTypeStr = ''
        } else {
            if (id === 1) {
                auctionTypeStr = 'offline'
            } else {
                if (id === 2) {
                    auctionTypeStr = "online"
                }
            }
        }
        this.setState({ activeIndex: id, auction_type: auctionTypeStr });
        this.filterList(this.state.customer_id, this.state.name, auctionTypeStr, this.state.category_id, this.state.sub_category_id)
        // this.filterList(this.state.customer_id, this.state.name, this.state.auction_type, category_id_str, this.state.sub_category_id)
    }

    componentDidMount() {
        //this.getProductInfo();
        this.filterList(this.state.customer_id, this.state.name, this.state.auction_type, this.state.category_id, this.state.sub_category_id)
    }

    UNSAFE_componentWillMount() {

    }
    componentWillUnmount() {

    }

    getProductInfo = () => {
        try {
            const { dispatch } = this.props;
            const { navigate } = this.props.navigation;

            dispatch(getProductListAction(this.token))
                .then((response) => {
                    console.log("dispatch response getProduct: ");
                    console.log(response);
                    if (response && typeof response !== "undefined" && response !== "") {
                        this.setState({ progress: false });
                        this.setState({ productList: response.data });
                    } else {
                        this.setState({ progress: false });
                        // Alert.alert('something went wrong..!!');
                    }
                })
                .catch((error) => {
                    this.setState({ progress: false });
                    // console.log("dispatch error: ");
                    // console.log(error);
                    // Alert.alert(error.message);
                });
        } catch (errorCatch) {
            // Alert.alert(errorCatch.message);
            this.setState({ progress: false });
        }
    }

    filterList = (customer_id, name, auction_type, category_id, sub_category_id) => {
        try {
            const { dispatch } = this.props;

            dispatch(getProductListAction(customer_id, name, auction_type, category_id, sub_category_id))
                .then((response) => {
                    console.log("dispatch response getProduct: ");
                    console.log(response);
                    if (response && typeof response !== "undefined" && response !== "") {
                        this.setState({ productList: response.data });
                    } else {
                        this.setState({ progress: false });
                        // Alert.alert('something went wrong..!!');
                    }
                })
                .catch((error) => {
                    // console.log("dispatch error: ");
                    // console.log(error);
                });
        } catch (errorCatch) {
            // Alert.alert(errorCatch.message);
        }

    }



    render() {

        const { productList } = this.state;

        return (
            <Provider>
                <View style={{ backgroundColor: '#FAFAFA', flex: 1, }}>

                    <View>
                        {/* App Bar */}
                        <Appbar.Header
                            style={{ backgroundColor: 'white', elevation: 0 }}
                        >

                            {/* Drawer Icon */}

                            <Appbar.Action
                                icon={() =>
                                    <Image
                                        source={images.MenuIcon}
                                        style={{ height: 22, width: 22 }}
                                    />
                                }
                                animated={false}
                                onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}

                            />

                            {/* Harrj Logo */}

                            <View style={{ flex: 1 }}>
                                <Image style={{ resizeMode: 'contain', width: 75, }}
                                    source={images.ic_harjj_logo} />
                            </View>

                            {/* Filter Button */}

                            <Menu
                                contentStyle={{ padding: 10 }}
                                visible={this.state.isVisible}
                                onDismiss={this.closeMenu}
                                anchor={
                                    <IconButton
                                        style={{ alignSelf: 'flex-end' }}
                                        icon='filter'
                                        color='#2D2C71'
                                        onPress={
                                            console.log('Filter Pressed'),
                                            this.openMenu
                                        }
                                    />
                                }
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Rubik-Medium', fontSize: 18,
                                        marginBottom: 10, textAlign: 'justify',
                                    }}
                                >Categories</Text>

                                <View>
                                    <CustomCheckBox
                                        selected={this.state.isChecked}
                                        onPress={this.handleCheckBox}
                                        text="Watch"
                                        size={24}
                                    />
                                </View>

                                <View>
                                    <CustomCheckBox
                                        selected={this.state.watchCheck}
                                        onPress={this.handleCheckBox1}
                                        text="Laptop"
                                        size={24}
                                    />
                                </View>

                                <View>
                                    <CustomCheckBox
                                        selected={this.state.mobileCheck}
                                        onPress={this.handleCheckBox2}
                                        text="Vehicles"
                                        size={24}
                                    />
                                </View>

                                <View>
                                    <CustomCheckBox
                                        selected={this.state.vehicle}
                                        onPress={this.handleCheckBox4}
                                        text="Smart Phones"
                                        size={24}
                                    />
                                </View>

                                <View>
                                    <CustomCheckBox
                                        selected={this.state.camera}
                                        onPress={this.handleCheckBox3}
                                        text="Camera"
                                        size={24}
                                    />
                                </View>

                                <Text style={{
                                    marginTop: 10, fontFamily: 'Rubik-Medium',
                                    fontSize: 18, textAlign: 'justify',
                                }}>
                                    Price Range
                                </Text>

                                <RangeSlider
                                    style={{ width: 160, marginTop: 10 }}
                                    min={0}
                                    max={1000}
                                    step={1}
                                    disableRange={true}
                                    renderLabel={(value) => <Label text={value} />}
                                    renderNotch={() => <Notch />}
                                    floatingLabel={true}
                                    allowLabelOverflow={false}
                                    renderThumb={() => <Thumb />}
                                    renderRail={() => <Rail />}
                                    renderRailSelected={() => <RailSelected />}
                                    onValueChanged={(value) => console.log(value)}
                                />


                            </Menu>


                            {/* Notification Icon */}

                            <Appbar.Action
                                animated={false}
                                icon={() =>
                                    <Image style={{ height: 24, width: 22, alignSelf: 'flex-end', }}
                                        source={images.bell} />
                                }
                                onPress={() => { }} />


                        </Appbar.Header>

                        <View>
                            {/* Search Bar */}

                            <View style={{
                                width: '90%', marginBottom: 4,
                                alignSelf: 'center', flexDirection: 'row',
                                borderRadius: 15, borderColor: '#2D2C71', height: 45, borderWidth: 1,
                            }}>

                                <TextInput style={{ width: '88%', fontSize: 18, alignSelf: 'center', height: 40 }}
                                    placeholder='Search'
                                    placeholderTextColor="#37474F"
                                    autoCapitalize="none"
                                    ref="search_string"
                                    textAlignVertical='center'
                                    value={this.state.search_string}
                                    onChangeText={(itemValue) => this.setState({ search_string: itemValue })}
                                    keyboardType='default'
                                    returnKeyType='search'
                                />

                                {/* Search Button */}

                                <TouchableOpacity style={{ justifyContent: 'center', }}>
                                    <Image style={{ height: 32, width: 40, right: 2 }}
                                        source={images.SearchBg} />

                                    <Image style={{ tintColor: 'white', alignSelf: 'center', position: 'absolute', height: 24, width: 24, }}
                                        source={images.search_icon} />

                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>

                    <FlatList
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this._onRefresh()}
                                refreshing={this.state.refreshing}
                                colors={[
                                    '#2D2C71', '#EF493E',
                                ]}
                            />
                        }
                        keyExtractor={item => item.product_id}
                        numColumns={1}
                        data={productList}
                        renderItem={({ item }) =>
                            <View style={ProductStyle.container}>
                                <TouchableOpacity style={ProductStyle.GridViewContainer}
                                    onPress={() => { console.log(' pressed') }}
                                >
                                    <View style={{ justifyContent: 'center', }}>
                                        <Image
                                            style={ProductStyle.ImageStyle}
                                            source={{ uri: item.product_img }}
                                        />
                                    </View>
                                    <View style={ProductStyle.textContainer}>
                                        <Text style={ProductStyle.titleText}>{item.name}</Text>
                                        <Text style={ProductStyle.price}>Price: {item.final_price}</Text>
                                        <Text style={ProductStyle.mediumText}>End on: {item.end_date_time}</Text>
                                        <View style={ProductStyle.button}>
                                            <TouchableOpacity
                                                onPress={() => { console.log('Bid pressed') }}
                                            >
                                                <Text style={ProductStyle.regularText}>Bid</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        }
                    />

                    {/* Bottom Navigation */}

                    <View style={{
                        backgroundColor: '#2D2C71', flexDirection: 'row',
                        height: 70, justifyContent: 'space-around', alignItems: 'center',
                        borderTopWidth: 1, borderTopColor: '#E5E5E5',
                        marginTop: 'auto',
                    }}>

                        <BottomNav
                            icon={images.homeIcon}
                            color='grey'
                            onPress={this.openHome}
                        />

                        <BottomNav
                            icon={images.normalBidIcon}
                            color='grey'
                            onPress={this.openNormalBid}
                        />

                        {/* Create Ad Button */}

                        <View>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#2D2C71', height: 80, width: 80, borderRadius: 50, alignItems: 'center',
                                    justifyContent: 'center', marginBottom: 50, borderWidth: 1, borderColor: '#2D2C71',
                                }}
                            // onPress={this.openCreateAd}
                            >
                                <Image
                                    style={{
                                        position: 'absolute',
                                        zIndex: 1, opacity: 0.3,
                                    }}
                                    source={images.ic_harjj_logo1}
                                />

                                <Image
                                    style={{
                                        height: 75, width: 75, tintColor: 'white'
                                    }}
                                    source={images.createAd}
                                />
                            </TouchableOpacity>
                        </View>

                        <BottomNav
                            icon={images.liveBidIcon}
                            color='grey'
                            onPress={this.openLiveBid}
                        />

                        <BottomNav
                            icon={images.searchIcon}
                            color='grey'
                            onPress={this.openSearch}
                        />

                    </View>


                </View>
            </Provider>
        )
    }
}

const ProductStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 5,
        marginVertical: 5,
    },

    Modalcontainer: {
        // flex: 0.5,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        // height: '100%'
    },
    modal: {
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        height: '80%'
        // marginTop: 80,
        // marginLeft: 40,

    },
    text: {
        color: '#3f2949',
        marginTop: 10
    },

    GridViewContainer: {
        flex: 1,
        margin: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        elevation: 2,
        flexDirection: 'row',
        paddingVertical: 5,
    },
    ImageStyle: {
        height: 130,
        width: 130,
        borderRadius: 10,
        resizeMode: 'contain',
        marginVertical: '5%',
        marginHorizontal: '5%',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        marginVertical: 5,
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Rubik-Regular',
        textAlignVertical: 'center',
    },
    regularText: {
        fontSize: 18,
        fontFamily: 'Rubik-Medium',
        textAlignVertical: 'center',
        color: 'white'
    },
    mediumText: {
        fontSize: 16,
        fontFamily: 'Rubik-Medium',
        marginTop: 10,
        textAlignVertical: 'center'
    },
    price: {
        fontSize: 18,
        fontFamily: 'Rubik-Medium',
        marginTop: 10,
        textAlignVertical: 'center'
    },
    priceText: {
        fontFamily: 'Rubik-Regular',
        textAlignVertical: 'center'
    },
    button: {
        backgroundColor: '#CC1212',
        borderRadius: 30,
        height: 30,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
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

export default compose(
    connect(null, null),
)(Products);

