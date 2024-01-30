import React from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { compose } from "redux";
import { getCategoriesSubCategories } from "../actions/bidder/getCategories.action";
import { getProductListAction } from '../../src/actions/getProductList.action';


// for onRefresh 
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

class GridImage extends React.Component {

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
        wait(1000).then(() => {
            this.setState({ refreshing: false })
        })
    }

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            productList: [],
            refreshing: false,
            isLoading: true,
            categorieSubCategoryList: [],
            customer_id: '',
            name: '',
            auction_type: '',
            category_id: '',
            sub_category_id: '',

        };
        this.openProductDetail = this.openProductDetail.bind(this);
        this.getCategorySubCategory = this.getCategorySubCategory.bind(this);
        this.filterList = this.filterList.bind(this);

    }

    tabChangeFunc = (id, name) => {
        var auctionTypeStr = ''
        if (id === { active }) {
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



    getCategorySubCategory = () => {
        try {
            const { dispatch } = this.props;
            //   const { navigate } = this.props.navigation;

            dispatch(getCategoriesSubCategories())
                .then((response) => {
                    console.log("dispatch response getCategory: ");
                    console.log(response);
                    if (response && typeof response !== "undefined" && response !== "") {
                        this.setState({ progress: false });
                        this.setState({ categorieSubCategoryList: response.data })
                    } else {
                        this.setState({ progress: false });
                        Alert.alert('something went wrong..!!');
                        this.setState({ categorieSubCategoryList: [] })
                    }
                })
                .catch((error) => {
                    this.setState({ progress: false });
                    console.log("dispatch error: ");
                    console.log(error);
                    Alert.alert(error.message);
                });
        } catch (errorCatch) {
            Alert.alert(errorCatch.message);
            this.setState({ progress: false });
        }
    }


    componentDidMount() {
        // this.getCategorySubCategory()
        this.filterList(this.state.customer_id, this.state.name, this.state.auction_type, this.state.category_id, this.state.sub_category_id)

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
                        Alert.alert('something went wrong..!!');
                    }
                })
                .catch((error) => {
                    console.log("dispatch error: ");
                    console.log(error);
                });
        } catch (errorCatch) {
            Alert.alert(errorCatch.message);
        }

    }

    openProductDetail = () => {
        Actions.product_details();
    }

    render() {
        return (
            <View style={styles.container}>



                {/* Categaries List  */}
                <View>
                    <View
                        style={{
                            height: 30, justifyContent: 'center', marginTop: 50, maxHeight: 30
                        }}
                    >

                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>

                            <View style={{ padding: 10, flexDirection: 'row', }}>
                                {
                                    this.stateName.names.map((item, index) =>
                                    (
                                        <TouchableOpacity
                                            key={item.id}
                                            // onPress={() => { this.setState({ activeIndex: item.id }), console.log(item.name) }}
                                            onPress={() => { this.tabChangeFunc(item.id, item.name); }}
                                            style={this.state.activeIndex === item.id ? styles.btnActive : styles.btn}>
                                            <Text style={this.state.activeIndex === item.id ? styles.activetext : styles.text}> {item.name} </Text>
                                        </TouchableOpacity>
                                    )
                                    )

                                }
                            </View>
                        </View >

                    </View>
                    <FlatList
                        onRefresh={() => this._onRefresh()}
                        refreshing={this.state.refreshing}
                        data={this.state.productList}
                        keyExtractor={item => item.product_id}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                // onPress={this.openProductDetail}
                                style={styles.GridViewContainer}>
                                <View>
                                    <Image
                                        style={styles.ImageStyle}
                                        source={{ uri: item.product_img }} />
                                </View>
                                <Text>{item.title}</Text>
                            </TouchableOpacity>
                        }
                        numColumns={2}
                    />

                </View>

                {/* {this.state.categorieSubCategoryList && this.state.categorieSubCategoryList.length > 0 &&
                    this.state.categorieSubCategoryList.map((itemcategorieSubCategoryList) => (

                        <FlatList
                            data={this.state.categorieSubCategoryList}
                            keyExtractor={({ id }) => id}
                            renderItem={(itemcategorieSubCategoryList) => (
                                <Text style={{
                                    alignSelf: 'flex-start', fontFamily: 'Rubik-Regular', fontWeight: 'bold',
                                    color: '#000000', fontSize: 18,
                                    marginHorizontal: 15, marginTop: 15
                                }}>{itemcategorieSubCategoryList.category_name}</Text>

                            )}
                        />

                    ))} */}
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 2,
        marginTop: 10,
        marginBottom: 10,
    },

    GridViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        resizeMode: 'contain',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        elevation: 1,
    },
    ImageStyle: {
        height: 150,
        width: 150,
        borderRadius: 10,
        resizeMode: 'contain',
        marginVertical: '5%',
        marginHorizontal: '5%'
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


mapStateToProps = (state) => ({
    loginUser: state.authReducer.loginUser
})

mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),

)(GridImage);