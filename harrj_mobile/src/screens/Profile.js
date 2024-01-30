import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Keychain from 'react-native-keychain';

import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView} from 'react-native';
import {Appbar, Divider} from 'react-native-paper';
import SimpleToast from 'react-native-simple-toast';
import {getMyBiderProductList} from '../actions/getMyBiderProduct.action';
import {MyAdsListAction} from '../actions/myAds.action';
import images from '../assets/images/images';
import strings from '../translations/translateConstant';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      token: '',
      role: '',
      user_id: '',
      name: '',
      progress: true,
      userName: '',
      email_id: '',
      mobileNo: '',
      bidderList: [],
      myAdsList: [],
      title: '',
      search_title: '',
    };
  }

  componentDidMount() {
    this.getprofileData();
    this.BidListFun();
    this.getMyAdsList();
  }

  // get user profile

  getprofileData() {
    AsyncStorage.getItem('userName').then(value => {
      this.setState({userName: value});
    });

    AsyncStorage.getItem('userEmail_id').then(value => {
      this.setState({email_id: value});
    });

    AsyncStorage.getItem('userMobileId').then(value => {
      this.setState({mobileNo: value});
    });
  }

  // get user bids

  BidListFun = async () => {
    console.log('bid List');

    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        console.log('Auth Token:', authToken);

        var userID = sessionData.user_id;
        console.log('userID:', userID);

        dispatch(getMyBiderProductList(authToken, userID, this.state.title))
          .then(response => {
            console.log('dispatch response getBidProduct: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({bidderList: response.data});
            } else {
              this.setState({progress: false});
              SimpleToast.show(strings.someError, SimpleToast.SHORT);
            }
          })
          .catch(error => {
            console.log('dispatch error: ');
            console.log(error);
          });
      });
    } catch (errorCatch) {
      console.log('Bidder List Try Catch');
      console.log(errorCatch);

      this.setState({progress: false});
    }
  };

  // Get user Ads

  getMyAdsList = async () => {
    try {
      const {dispatch} = this.props;
      console.log('navigation');

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        var customer_id = sessionData.user_id;

        dispatch(
          MyAdsListAction(authToken, customer_id, this.state.search_title),
        )
          .then(response => {
            console.log('dispatch response My Ads List: ');
            console.log(response);

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({myAdsList: response.data});
            } else {
              SimpleToast.show(strings.someError, SimpleToast.SHORT);
            }
          })
          .catch(error => {
            console.log('My Ads List dispatch error: ');
            console.log(error);
            SimpleToast.show(strings.someError, SimpleToast.SHORT);
          });
      });
    } catch (errorCatch) {
      console.log(errorCatch);
      SimpleToast.show(strings.someError, SimpleToast.SHORT);
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}>
        <ImageBackground
          source={images.harrj_bg}
          resizeMode="stretch"
          style={{height: '100%'}}>
          <ScrollView>
            <Appbar.Header
              style={{backgroundColor: 'transparent', elevation: 0}}>
              <Appbar.BackAction
                onPress={() => {
                  this.props.navigation.goBack(null);
                }}
              />
              <Appbar.Content
                title={strings.MyProfile}
                titleStyle={{
                  color: '#505B98',
                  fontFamily: 'Cairo-Bold',
                  fontSize: 24,
                }}
              />
              <Appbar.Action 
                onPress={() => {
                  this.props.navigation.navigate('profileUpdate');
                }}
                icon={images.editIcon}
                size={24}
                color="#505B98"
              />
            </Appbar.Header>

            {/* Divider */}

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                marginTop: '5%',
              }}>
              <Divider
                style={{height: 1, backgroundColor: '#7d7eaf', flex: 1}}
              />
              <Text
                style={{
                  color: '#7d7eaf',
                  fontFamily: 'Cairo-Bold',
                  textAlign: 'center',
                  fontSize: 20,
                  marginHorizontal: 10,
                }}>
                {strings.MyDetails}
              </Text>

              <Divider
                style={{height: 1, backgroundColor: '#7d7eaf', flex: 1}}
              />
            </View>

            {/* Name */}

            <View style={{flexDirection: 'row', marginTop: 25}}>
              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  borderColor: '#505B98',
                  width: '28%',
                }}>
                <Text
                  style={{
                    color: '#505B98',
                    fontFamily: 'Cairo-Bold',
                    textAlign: 'left',
                    fontSize: 18,
                  }}>
                  {strings.Name}
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  borderColor: '#505B98',
                  width: '65%',
                }}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={{
                    color: '#505B98',
                    fontFamily: 'Cairo-Bold',
                    textAlign: 'left',
                    fontSize: 18,
                    paddingHorizontal: 10,
                  }}>
                  {this.state.userName}
                </Text>
              </View>
            </View>

            {/* Email ID */}

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  borderColor: '#505B98',
                  width: '28%',
                }}>
                <Text
                  style={{
                    color: '#505B98',
                    fontFamily: 'Cairo-Bold',
                    textAlign: 'left',
                    fontSize: 18,
                  }}>
                  {strings.Email}
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  borderColor: '#505B98',
                  width: '65%',
                }}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={{
                    color: '#505B98',
                    fontFamily: 'Cairo-Bold',
                    textAlign: 'left',
                    fontSize: 18,
                    paddingHorizontal: 10,
                  }}>
                  {this.state.email_id}
                </Text>
              </View>
            </View>

            {/* Mobile No. */}

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  borderColor: '#505B98',
                  width: '28%',
                }}>
                <Text
                  style={{
                    color: '#505B98',
                    fontFamily: 'Cairo-Bold',
                    textAlign: 'left',
                    fontSize: 18,
                  }}>
                  {strings['MobileNo.']}
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 0.5,
                  borderRadius: 8,
                  backgroundColor: 'white',
                  marginLeft: 10,
                  borderColor: '#505B98',
                  width: '65%',
                }}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={2}
                  style={{
                    color: '#505B98',
                    fontFamily: 'Cairo-Bold',
                    textAlign: 'left',
                    fontSize: 18,
                    paddingHorizontal: 10,
                  }}>
                  {this.state.mobileNo}
                </Text>
              </View>
            </View>

            {/* My Bids Divider */}

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                marginTop: '5%',
              }}>
              <Divider
                style={{height: 1, backgroundColor: '#7d7eaf', flex: 1}}
              />
              <Text
                style={{
                  color: '#7d7eaf',
                  fontFamily: 'Cairo-Bold',
                  textAlign: 'center',
                  fontSize: 20,
                  marginHorizontal: 10,
                }}>
                {strings.MyBids}
              </Text>

              <Divider
                style={{height: 1, backgroundColor: '#7d7eaf', flex: 1}}
              />
            </View>

            {/* My Bids List */}

            <FlatList
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              numColumns={2}
              data={this.state.bidderList}
              renderItem={({item, index}) => (
                <View>
                  {(() => {
                    if (index < 4) {
                      return (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              // marginLeft: 10,
                              marginTop: 5,
                            }}>
                            <View
                              style={{
                                backgroundColor: 'white',
                                height: 150,
                                width: 170,
                                borderRadius: 8,
                                elevation: 4,
                                marginBottom: 10,
                                marginHorizontal: 5,
                              }}>
                              <>
                                <Image
                                  // resizeMode='contain'
                                  style={{
                                    height: 85,
                                    width: 100,
                                    alignSelf: 'center',
                                    marginTop: 5,
                                    borderRadius: 4,
                                  }}
                                  source={{uri: item.product_img}}
                                />
                              </>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  marginHorizontal: 5,
                                }}>
                                <Text
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: 'Cairo-Bold',
                                    textAlign: 'left',
                                    fontSize: 14,
                                    width: 80,
                                  }}>
                                  {item.title}
                                </Text>
                                <Text
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: 'Cairo-Bold',
                                    textAlign: 'right',
                                    fontSize: 14,
                                    width: 60,
                                  }}>
                                  {item.bidCount} {strings.bids}
                                </Text>
                              </View>

                              <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={{
                                  fontFamily: 'Cairo-Bold',
                                  textAlign: 'left',
                                  fontSize: 14,
                                  marginHorizontal: 5,
                                  width: 120,
                                }}>
                                {strings.BidAmounts}: {item.bid_amount}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  })()}
                </View>
              )}
            />

            {/* View More */}

            {this.state.bidderList &&
              this.state.bidderList.length > 0 &&
              this.state.bidderList.map((item, index) => (
                <>
                  {(() => {
                    if (index > 0) {
                    } else {
                      return (
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'white',
                            width: 80,
                            alignItems: 'center',
                            borderRadius: 4,
                            alignSelf: 'flex-end',
                            marginRight: 20,
                            marginTop: 5,
                            borderWidth: 1,
                            borderColor: '#505B98',
                          }}
                          onPress={() => {
                            this.props.navigation.replace('my_order');
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Cairo-Bold',
                              color: '#505B98',
                              fontSize: 16,
                            }}>
                            {strings.ViewMore}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  })()}
                </>
              ))}

            {/* My Ads Divider */}

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                marginTop: '2%',
              }}>
              <Divider
                style={{height: 1, backgroundColor: '#7d7eaf', flex: 1}}
              />
              <Text
                style={{
                  color: '#7d7eaf',
                  fontFamily: 'Cairo-Bold',
                  textAlign: 'center',
                  fontSize: 20,
                  marginHorizontal: 10,
                }}>
                {strings.myProducts}
              </Text>

              <Divider
                style={{height: 1, backgroundColor: '#7d7eaf', flex: 1}}
              />
            </View>

            {/* My Ads List */}

            <FlatList
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              numColumns={2}
              data={this.state.myAdsList}
              renderItem={({item, index}) => (
                <View>
                  {(() => {
                    if (index < 4) {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            // marginLeft: 10,
                            marginTop: 5,
                          }}>
                          <View
                            style={{
                              backgroundColor: 'white',
                              // height: 150,
                              width: 170,
                              borderRadius: 8,
                              elevation: 4,
                              marginBottom: 10,
                              marginHorizontal: 5,
                            }}>
                            <>
                              <Image
                                // resizeMode='contain'
                                style={{
                                  height: 85,
                                  width: 100,
                                  alignSelf: 'center',
                                  marginTop: 5,
                                  borderRadius: 4,
                                }}
                                source={{uri: item.product_img}}
                              />
                            </>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 5,
                              }}>
                              <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={{
                                  fontFamily: 'Cairo-Bold',
                                  textAlign: 'left',
                                  fontSize: 14,
                                  width: 80,
                                }}>
                                {item.title}
                              </Text>
                            </View>

                            {(() => {
                              if (
                                item.auction_type == 'online' ||
                                item.auction_type == 'golivenow'
                              ) {
                                return <></>;
                              } else {
                                return (
                                  <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'Cairo-Bold',
                                      textAlign: 'left',
                                      fontSize: 14,
                                      marginHorizontal: 5,
                                      width: 120,
                                    }}>
                                    {strings.BidAmounts}: {strings.priceSymbol}
                                    {item.starting_price}
                                  </Text>
                                );
                              }
                            })()}
                          </View>
                        </View>
                      );
                    }
                  })()}
                </View>
              )}
            />

            {/* View More */}

            {this.state.myAdsList &&
              this.state.myAdsList.length > 0 &&
              this.state.myAdsList.map((item, index) => (
                <>
                  {(() => {
                    if (index > 0) {
                    } else {
                      return (
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'white',
                            width: 80,
                            alignItems: 'center',
                            borderRadius: 4,
                            alignSelf: 'flex-end',
                            marginRight: 20,
                            marginTop: 5,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: '#505B98',
                          }}
                          onPress={() => {
                            this.props.navigation.replace('my_products');
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Cairo-Bold',
                              color: '#505B98',
                              fontSize: 16,
                            }}>
                            {strings.ViewMore}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  })()}
                </>
              ))}
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(Profile);
