import { DrawerActions } from "@react-navigation/native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Appbar, Divider, IconButton } from "react-native-paper";
import { Actions } from "react-native-router-flux";
import images from "../../assets/images/images";
import BottomNav from "../../components/BottomNavigation";

export default class MyReport extends React.Component {

    constructor(props) {
        super(props); 
        this.props = props;
        this.state = {
            my_reports: [
                {
                    key: 0, name: "iPhone 13 Pro", closedPrice: "1,30000", closedTime: '06:30 PM', ClosedDate: '17 Jan 22',
                    image: "http://99pngimg.com/wp-content/uploads/2021/09/iphone-13-Pro-PNG-images-1024x707.jpg"
                },
                {
                    key: 1, name: "MSI", closedPrice: "1,50000", closedTime: '04:30 PM', ClosedDate: '16 Jan 22',
                    image: "https://www.gamespot.com/a/uploads/scale_landscape/1551/15511094/3649375-msilaptop.jpg"
                },
                {
                    key: 2, name: "Rolex", closedPrice: "2,00000", closedTime: '01:30 PM', ClosedDate: '15 Jan 22',
                    image: "https://i.insider.com/61291ab29ef1e50018f86fed?width=1136&format=jpeg"
                },
            ]
        }
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

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>

                {/* App Bar */}

                <Appbar.Header
                    style={{ backgroundColor: 'white', elevation: 0 }}
                >

                    {/* Drawer button */}

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

                    <Appbar.Action
                        animated={false}
                        icon='filter'
                        color='#2D2C71'
                        onPress={() => { }} />

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
                        marginHorizontal: 15, marginBottom: 4,
                        alignSelf: 'center', flexDirection: 'row',
                        borderRadius: 15, borderColor: '#2D2C71', height: 45, borderWidth: 1,
                    }}>

                        <TextInput style={{ width: '88%', fontSize: 18, alignSelf: 'center', height: 45 }}
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

                        <Image style={{
                            alignSelf: 'center', tintColor: '#2d2c71',
                            height: 30, width: 30, marginHorizontal: 5
                        }}
                            source={images.search_icon} />

                        {/* <TouchableOpacity style={{ justifyContent: 'center', }}>
                            <Image style={{ height: 32, width: 40, right: 2 }}
                                source={images.SearchBg} />

                            <Image style={{ tintColor: 'white', alignSelf: 'center', position: 'absolute', height: 24, width: 24, }}
                                source={images.search_icon} />

                        </TouchableOpacity> */}

                    </View>
                </View>



                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}

                    data={this.state.my_reports}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) =>
                        <View style={{ marginVertical: 10, flex: 1, marginHorizontal: '3%' }}>

                            {/* Custom Card */}

                            <View style={styles.card}>

                                {/* Image */}

                                <View style={{ justifyContent: 'center', marginHorizontal: 3 }}>
                                    <Image style={styles.image}
                                        source={{ uri: item.image }}
                                    />
                                </View>

                                {/* Report Title and others */}

                                <View style={{ flexDirection: 'column', marginTop: '3%', marginBottom: '3%', marginLeft: 3, }}>

                                    {/* Title */}

                                    <Text style={styles.titleText}>{item.name}</Text>

                                    {/* Bid Price */}

                                    <Text style={styles.price}>1 Cr</Text>

                                    {/* Order Close Date and time */}

                                    <Text style={styles.mediumText}>Order Closed on :
                                        <Text style={styles.mediumText}> {item.ClosedDate}
                                            <Text style={styles.mediumText}> {item.closedTime}</Text></Text>
                                    </Text>

                                    {/* Price Close */}

                                    <Text style={styles.mediumText}>Price Closed at :
                                        <Text style={styles.mediumText}> {item.closedPrice}</Text>
                                    </Text>
                                </View>
                            </View>
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
        )
    }
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        elevation: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        width: '100%'
    },
    titleText: {
        fontSize: 18,
        fontFamily: 'Rubik-Bold',
        textAlign: 'justify'
        // textAlignVertical: 'center',
    },
    image: {
        resizeMode: 'contain',
        width: 130,
        height: 110,
        borderRadius: 10
    },

    regularText: {
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        textAlign: 'justify'
        // textAlignVertical: 'center'
    },
    mediumText: {
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
        marginTop: 10,
        textAlignVertical: 'center',
        textAlign: 'justify'

    },
    price: {
        fontSize: 18,
        fontFamily: 'Rubik-Regular',
        textAlignVertical: 'center',
        marginTop: 5,
        textAlign: 'justify'


    },
    priceText: {
        fontSize: 16,
        fontFamily: 'Rubik-Bold',
        textAlignVertical: 'center',
        marginBottom: 10,
        textAlign: 'justify'

    },
    bidNos: {
        fontSize: 14,
        fontFamily: 'Rubik-Medium',
        textAlignVertical: 'center',
        color: 'white',
        margin: 4,
        textAlign: 'justify'

    },
})
