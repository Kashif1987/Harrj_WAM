import {DrawerActions} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {Appbar, Divider, IconButton, Menu, Provider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import images from '../../assets/images/images';
import BottomNav from '../../components/BottomNavigation';
import RangeSlider from 'rn-range-slider';
import CustomCheckBox from '../../components/CustomCheckBox';
import Thumb from '../../components/Thumb';
import Rail from '../../components/Rail';
import RailSelected from '../../components/RailSelected';
import Label from '../../components/Label';
import Notch from '../../components/Notch';
import strings from '../../translations/translateConstant';
// import ReactNativeModal from "react-native-modal";
import {Button} from 'react-native';
import {Modal} from 'react-native';
import ActionButton from 'react-native-circular-action-menu';
import {deleteBidsAction} from '../../actions/deleteBids.action';
import {Alert} from 'react-native';
import * as Keychain from 'react-native-keychain';
import ReactNativeModal from 'react-native-modal';
import {ImageBackground} from 'react-native';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {bidListByBidderService} from '../../actions/bidListByBidder.action';
import {getProductListAction} from '../../actions/getProductList.action';
import {getMyBiderProductList} from '../../actions/getMyBiderProduct.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {ActionSheet} from 'react-native-cross-actionsheet';
import Share from 'react-native-share';
import SimpleToast from 'react-native-simple-toast';
import {slackServiceFun} from '../../service/slack/slack';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import Progress from '../../components/Progress/progress';

// for onRefresh
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

class MyOrders extends React.Component {
  // OnRefresh

  _onRefresh = () => {
    this.setState({refreshing: true}, () => {
      this.BidListFun();
    });
    wait(1500).then(() => {
      this.setState({refreshing: false});
    });
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      userName: '',
      refreshing: false,
      isChecked: false,
      watchCheck: false,
      mobileCheck: false,
      laptop: false,
      camera: false,
      vehicle: false,
      isVisible: false,
      modalVisible: false,
      isSideMenuVisible: false,
      progress: false,
      bidder_id: 0,
      bid_id: 0,
      bidderList: [],
      title: '',
      my_orders: [
        {
          key: 0,
          name: 'iPhone 13 Pro',
          price: '1,10,000',
          orderTime: '12:00 PM',
          status: 'Not Awarded',
          orderDate: 'Ordered on Jan 01, 2022',
          image:
            'http://99pngimg.com/wp-content/uploads/2021/09/iphone-13-Pro-PNG-images-1024x707.jpg',
        },
        {
          key: 1,
          name: 'MSI',
          price: '80,000',
          orderTime: '04:30 PM',
          orderDate: 'Ordered on Dec 28, 2021',
          status: 'Awarded',
          image:
            'https://www.gamespot.com/a/uploads/scale_landscape/1551/15511094/3649375-msilaptop.jpg',
        },
        {
          key: 2,
          name: 'Rolex',
          price: '2,10,000',
          orderTime: '01:30 PM',
          orderDate: 'Dec 15 2021',
          status: 'Awarded',
          image:
            'https://i.insider.com/61291ab29ef1e50018f86fed?width=1136&format=jpeg',
        },
      ],
    };
    this.deleteBids = this.deleteBids.bind(this);
    this.BidListFun = this.BidListFun.bind(this);
  }

  componentDidMount = () => {
    this._onRefresh();
    this.getUserName();
    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
        if (value != null) {
          console.log('componentDidmount if');
          console.log(value);
          strings.setLanguage(value);
          if (value === 'en') {
            this.setState({UniversalLangString: 'Arabic'});
          } else {
            if (value === 'ar') {
              this.setState({UniversalLangString: 'English'});
            }
          }
        } else {
          console.log('componentDidmount  elses');
          this.setState({UniversalLangString: 'Arabic', selectedLan: true});
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }

    this.setState({});

    this.BidListFun();
    //this.MyBiderList();
  };

  // hide show Filter
  handleCheckBox = () => {
    console.log('Pressed');
    this.setState({isChecked: !this.state.isChecked});
  };
  openMenu = () => {
    // this.setState({ isVisible: true });
  };

  closeMenu = () => this.setState({isVisible: false});

  handleCheckBox1 = () => {
    console.log('Pressed');
    this.setState({watchCheck: !this.state.watchCheck});
  };

  handleCheckBox2 = () => {
    console.log('Pressed');
    this.setState({mobileCheck: !this.state.mobileCheck});
  };

  handleCheckBox3 = () => {
    console.log('Pressed');
    this.setState({camera: !this.state.camera});
  };

  handleCheckBox4 = () => {
    console.log('Pressed');
    this.setState({vehicle: !this.state.vehicle});
  };

  openSearch = () => {
    Actions.search();
  };

  openNormalBid = () => {
    Actions.normal_bid();
  };

  openLiveBid = () => {
    Actions.live_bid();
  };

  openHome = () => {
    Actions.home();
  };

  openLiveNow = () => {
    Actions.live_now();
  };

  openSchedule_live = () => {
    Actions.schedule_live();
  };

  openCreateAd = () => {
    // this.setCreateAdModalVisible(false)
    Actions.create_ad();
  };

  // Modal Show and Hide

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  // Delete API

  deleteBids = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(
          deleteBidsAction(authToken, this.state.bidder_id, this.state.bid_id),
        )
          .then(response => {
            console.log('dispatch response getProduct: ');
            console.log(response);

            this.setState({bidder_id: 0});
            this.setState({bid_id: 0});
            // this.BidListFun();
            // this.filterList(this.state.customer_id, this.state.name, this.state.auction_type, this.state.category_id, this.state.sub_category_id)

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({delele_List: response.data});
              this.BidListFun();
              SimpleToast.show(strings.successfull, SimpleToast.SHORT);
            } else {
              this.setState({progress: false});
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch(error => {
            this.setState({progress: false});
            // console.log('dispatch error: ');
            // console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  onPressDeleteConfirm = (bidder_id, bid_id) => {
    console.log('onPressDeleteConfirm: ');
    console.log(bidder_id, bid_id);

    this.setState({bidder_id: bidder_id, bid_id: bid_id});

    Alert.alert(strings.ConfirmDelete, strings.Areyousureyouwanttodelete, [
      {
        text: strings.Cancel,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: strings.ok, onPress: () => this.deleteBids()},
    ]);
  };

  // open Drawer Modal

  toggleSideMenu = () =>
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});

  // go to My Ads

  goToMyAds = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.replace('my_products');
  };

  // go to Contact us

  goToContactus = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.navigate('contact_us');
  };

  // go to Home

  goToHome = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.replace('home');
  };

  // go to About Harrj

  goToAboutHarrj = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.replace('about_harrj');
  };

  // go to Privacy Policy

  goToPrivacy = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.replace('privacy_policy');
  };

  // go to Share

  goToShare = async () => {
    const shareOptions = {
      title: strings.ShareHarrj,
      message: strings.checkOutHarrj,
      url: 'https://play.google.com/store/apps/details?id=com.harrj',
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      //   this.state.setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('Error =>', error);
      // this.state.setResult('error: ', error);
    }
  };

  // User Logout

  userLogoutFun = async () => {
    try {
      await Keychain.resetGenericPassword();
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('userName');
      AsyncStorage.removeItem('userRole');

      // this.props.navigation.replace('sign_in');
      this.props.navigation.replace('splash_screen');
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  // go to signin

  goToSignIn = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    Alert.alert(
      strings.signout,
      strings.signoutDisc,
      [
        {text: strings.no, style: 'cancel'},
        {
          text: strings.yes,
          onPress: () => {
            // Actions.sign_in();
            this.userLogoutFun();
          },
        },
      ],
      {cancelable: true},
    );
    return true;
  };

  // Action Sheet

  getActionSheet() {
    ActionSheet.options({
      title: strings.CreateAds,
      // message: "Choose Ad",
      tintColor: '#505B98',
      options: [
        {
          text: strings.NormalAds,
          onPress: () => {
            console.log('Normal Ad');
            Actions.create_ad();
          },
        },
        {
          text: strings.LiveAds,
          onPress: () => {
            console.log('Live Ad');

            ActionSheet.options({
              title: strings.CreateLiveAds,
              // message: "Choose Ad",
              tintColor: '#505B98',
              options: [
                {
                  text: strings.Livenow,
                  onPress: () => {
                    console.log('Live Now');
                    Actions.live_now();
                  },
                },
                {
                  text: strings.scheduleLive,
                  onPress: () => {
                    console.log('Schedule Live');
                    Actions.schedule_live();
                  },
                },
                // { text: 'Delete', destructive: true, onPress: () => console.log('delete') }
              ],
              cancel: {
                onPress: () => console.log('cancel'),
                text: strings.Close,
              },
            });
          },
        },
        // { text: 'Delete', destructive: true, onPress: () => console.log('delete') }
      ],
      cancel: {onPress: () => console.log('cancel'), text: strings.Close},
    });
  }

  // store Langauge

  storeLang = () => {
    console.log('Store Lang');

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
        if (value != null) {
          console.log('if');
          console.log(value);
          if (value && typeof value !== 'undefined' && value !== '') {
            if (value === 'ar') {
              strings.setLanguage('en');
              AsyncStorage.setItem('UniversalAppLanguage', 'en');
              this.setState({UniversalLangString: 'Arabic'});
              this.componentDidMount();
            } else {
              if (value === 'en') {
                strings.setLanguage('ar');
                AsyncStorage.setItem('UniversalAppLanguage', 'ar');
                this.setState({UniversalLangString: 'English'});
                this.componentDidMount();
              } else {
                console.log('if else');
                strings.setLanguage('en');
                AsyncStorage.setItem('UniversalAppLanguage', 'en');
                this.setState({UniversalLangString: 'Arabic'});
                this.componentDidMount();
              }
            }
          }
        } else {
          console.log('elses');
          strings.setLanguage('en');
          AsyncStorage.setItem('UniversalAppLanguage', 'en');
          this.setState({UniversalLangString: 'Arabic'});
          this.componentDidMount();
        }
      });
    } catch (error) {
      console.log(' Store Lang Catch error: ');
      console.log(error);
    }
    this.setState({});
    // RNRestart.Restart();
  };

  BidListFun = async () => {
    this.setState({progress: true});
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(async credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        console.log('Auth Token:', authToken);

        var userID = sessionData.user_id;
        console.log('userID:', userID);

        var error = 'BidListFun TESTING';

        // var statusType = 'error';
        // var errorLogData = '' + error + '';
        // var screenName = 'Product Detail';
        // var methodFunName = 'BidListFun';
        // var noteDesc = 'try-catch';
        // var callingServer = 'Client';
        // var apiUrl = '';
        // var apiMethod = '';
        // var apiRequestData =
        //   'authToken: ' + authToken + ',' + 'userID: ' + userID;
        // var apiResponseData = '';

        // var slackErrorResponse = await slackServiceFun.slackErrorFun(
        //   statusType,
        //   errorLogData,
        //   screenName,
        //   methodFunName,
        //   noteDesc,
        //   callingServer,
        //   apiUrl,
        //   apiMethod,
        //   apiRequestData,
        //   apiResponseData,
        // );

        dispatch(getMyBiderProductList(authToken, userID, this.state.title))
          .then(response => {
            console.log('dispatch response getProduct: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({bidderList: response.data, progress: false});
            } else {
              this.setState({progress: false});
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch(async error => {
            this.setState({progress: false});
            // console.log('dispatch error: ');
            // console.log(error);
            var statusType = 'error';
            var errorLogData = '' + error + '';
            var screenName = 'My Bids';
            var methodFunName = 'BidListFun';
            var noteDesc = 'dispatch';
            var callingServer = 'Client';
            var apiUrl = '';
            var apiMethod = '';
            var apiRequestData = '';
            var apiResponseData = '';

            // var slackErrorResponse = await slackServiceFun.slackErrorFun(
            //   statusType,
            //   errorLogData,
            //   screenName,
            //   methodFunName,
            //   noteDesc,
            //   callingServer,
            //   apiUrl,
            //   apiMethod,
            //   apiRequestData,
            //   apiResponseData,
            // );
          });
      });
    } catch (error) {
      // console.log('Bidder List Try Catch');
      // console.log(errorCatch);
      var statusType = 'error';
      var errorLogData = '' + error + '';
      var screenName = 'My Bids';
      var methodFunName = 'AddBidFun';
      var noteDesc = 'try-catch';
      var callingServer = 'Client';
      var apiUrl = '';
      var apiMethod = '';
      var apiRequestData = '';
      var apiResponseData = '';

      // var slackErrorResponse = await slackServiceFun.slackErrorFun(
      //   statusType,
      //   errorLogData,
      //   screenName,
      //   methodFunName,
      //   noteDesc,
      //   callingServer,
      //   apiUrl,
      //   apiMethod,
      //   apiRequestData,
      //   apiResponseData,
      // );

      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  // get User Name

  getUserName = () => {
    AsyncStorage.getItem('userName').then(value => {
      console.log('value');
      console.log(value);
      this.setState({userName: value});
    });
  };

  EmptyList = () => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 500,
      }}>
      <Image
        resizeMode="contain"
        style={{height: 100, width: 100, marginBottom: 10}}
        source={images.noAdFound}
      />

      <Text
        style={{
          fontFamily: 'Cairo-SemiBold',
          fontSize: 22,
          // marginLeft: 15,
          textAlign: 'justify',
        }}>
        {strings.noBidsFound}
      </Text>
    </View>
  );

  render() {
    return (
      <Provider>
        <View
          style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
          <Dialog visible={this.state.progress}>
            <DialogContent style={{width: '80%'}}>
              <Progress />
            </DialogContent>
          </Dialog>
          {/* App Bar */}

          <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
            {/* Drawer button */}

            <Appbar.Action
              icon={() => (
                <Image
                  source={images.MenuIcon}
                  style={{height: 22, width: 22, tintColor: '#505B98'}}
                />
              )}
              animated={false}
              onPress={this.toggleSideMenu}
            />

            {/* Harrj Logo */}

            <View style={{flex: 1}}>
              <Image
                style={{resizeMode: 'contain', width: 75}}
                source={images.ic_harjj_logo}
              />
            </View>

            {/* Filter Button */}

            {/* <View>
                            <IconButton
                                onPress={() => this.setModalVisible(true)}
                                style={{ alignSelf: 'flex-end' }}
                                icon='filter'
                                color='#2D2C71'
                            />
                            <Modal
                                animationType="fade"
                                visible={this.state.modalVisible}
                                onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
                            >
                                <View>
                                    <IconButton
                                        color='#2D2C71'
                                        style={{ alignSelf: 'flex-end' }}
                                        onPress={() => this.setModalVisible(false)}
                                        icon='close'
                                    />

                                    <Text style={{
                                        marginTop: 10, fontFamily: 'Rubik-Medium',
                                        fontSize: 18, textAlign: 'justify',
                                    }}>
                                        Price Range
                                    </Text>

                                    <RangeSlider
                                        style={{ width: '100%', }}
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

                                </View>
                            </Modal>
                        </View> */}

            {/* Notification Icon */}

            {/* <Appbar.Action
                            animated={false}
                            icon={() =>
                                <Image style={{ height: 24, width: 22, alignSelf: 'flex-end', }}
                                    source={images.bell} />
                            }
                            onPress={() => { }} /> */}
          </Appbar.Header>

          <View>
            {/* Search Bar */}

            <View
              style={{
                marginBottom: 4,
                marginHorizontal: 15,
                justifyContent: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
                borderRadius: 15,
                borderColor: '#2D2C71',
                height: 45,
                borderWidth: 1,
              }}>
              <TextInput
                style={{
                  width: '88%',
                  fontSize: 18,
                  alignSelf: 'center',
                  height: 45,
                  paddingHorizontal: 5,
                  fontFamily: 'Cairo-SemiBold',
                  justifyContent: 'center',
                  textAlignVertical: 'center',
                }}
                placeholder={strings.Search}
                placeholderTextColor="#37474F"
                autoCapitalize="none"
                ref="search_string"
                textAlignVertical="center"
                value={this.state.search_string}
                onChangeText={itemValue => {
                  this.setState({title: itemValue});
                  this.BidListFun();
                }}
                keyboardType="default"
                returnKeyType="search"
              />

              {/* Search Button */}

              <Image
                style={{
                  alignSelf: 'center',
                  tintColor: '#2d2c71',
                  height: 30,
                  width: 30,
                  marginHorizontal: 5,
                }}
                source={images.search_icon}
              />

              {/* <TouchableOpacity style={{ justifyContent: 'center', }}>
                                <Image style={{ height: 32, width: 40, right: 2 }}
                                    source={images.SearchBg} />

                                <Image style={{ tintColor: 'white', alignSelf: 'center', position: 'absolute', height: 24, width: 24, }}
                                    source={images.search_icon} />

                            </TouchableOpacity> */}
            </View>
          </View>

          <FlatList
            refreshControl={
              <RefreshControl
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.refreshing}
                colors={['#505B98', '#EF493E']}
              />
            }
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.key}
            data={this.state.bidderList}
            ListEmptyComponent={this.EmptyList}
            // renderItem={({item}) => this.bidsRender(item)}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    borderRadius: 10,
                    elevation: 5,
                    margin: 10,
                    backgroundColor: 'white',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={styles.image}
                      source={{uri: item.product_img}}
                    />
                    <View style={{marginHorizontal: 10}}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={2}
                        style={styles.titleText}>
                        {item.title}
                      </Text>

                      <Text style={styles.mediumText}>
                        {strings.status}:
                        {(() => {
                          if (
                            item.bid_status &&
                            item.bid_status === 'pending'
                          ) {
                            return (
                              <Text style={styles.regularText}>
                                {' '}
                                {strings.notAward}
                              </Text>
                            );
                          } else {
                            return (
                              <Text style={styles.regularText}>
                                {' '}
                                {strings.award}
                              </Text>
                            );
                          }
                        })()}
                      </Text>

                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={{
                          fontSize: 14,
                          fontFamily: 'Cairo-SemiBold',
                          textAlignVertical: 'center',
                          textAlign: 'justify',
                        }}>
                        {strings.BitAmt}:
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={styles.priceText}>
                          {' '}
                          {strings.priceSymbol} {item.bid_amount}
                        </Text>
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        alignSelf: 'flex-end',
                        marginRight: 10,
                      }}>
                      <View
                        style={{
                          backgroundColor: '#505B98',
                          borderRadius: 30,
                          height: 30,
                        }}>
                        {(() => {
                          if (
                            item.bidCount &&
                            typeof item.bidCount !== 'undefined' &&
                            item.bidCount !== null &&
                            item.bidCount !== ''
                          ) {
                            return (
                              <Text style={styles.bidNos}>
                                {item.bidCount} {strings.bids}
                              </Text>
                            );
                          } else {
                            return (
                              <Text style={styles.bidNos}>
                                0 {strings.bids}
                              </Text>
                            );
                          }
                        })()}
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this.onPressDeleteConfirm(
                            item.bidder_id,
                            item.bid_id,
                          );
                          console.log('item.bidder_id, item.bid_id');
                          console.log(item.bidder_id, item.bid_id);
                        }}
                        style={{
                          backgroundColor: '#505B98',
                          borderRadius: 10,
                          marginBottom: 10,
                          //   marginHorizontal: 10,
                          // marginRight: '10%',
                          height: 30,
                          marginTop: 10,
                        }}>
                        <Image
                          style={{
                            height: 18,
                            width: 18,
                            tintColor: 'white',
                            margin: 5,
                          }}
                          source={images.deleteIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <ReactNativeModal
            isVisible={this.state.isSideMenuVisible}
            animationIn="slideInLeft" // Has others, we want slide in from the left
            animationOut="slideOutLeft" // When discarding the drawer
            onBackdropPress={this.toggleSideMenu} // Android back press
            onSwipeComplete={this.toggleSideMenu} // Swipe to discard
            // animationInTiming={1000}
            // animationOutTiming={1000}
            useNativeDriver // Faster animation
            hideModalContentWhileAnimating // Better performance, try with/without
            propagateSwipe // Allows swipe
            style={styles.sideMenuStyle}>
            {/* <ImageBackground
                            source={images.bgcolor} resizeMode="cover" style={{ height: '100%', }}
                        > */}
            <View style={[styles.modal, {backgroundColor: '#505B98'}]}>
              <ScrollView>
                <View
                  style={{
                    padding: 20,
                    marginTop: 10,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }}>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Cairo-Bold',
                      textAlign: 'auto',
                      color: 'white',
                      fontSize: 18,
                      marginTop: 15,
                      marginLeft: 10,
                    }}
                    // >{strings.Welcome} {this.state.userName}</Text>
                  >
                    {strings.Welcome}
                  </Text>
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Cairo-Bold',
                      textAlign: 'auto',
                      color: 'white',
                      fontSize: 18,
                      marginTop: 15,
                      marginLeft: 5,
                      width: 150,
                    }}
                    // >{strings.Welcome} {this.state.userName}</Text>
                  >
                    {this.state.userName}
                  </Text>
                </View>

                {/* Home Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.goToHome}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerHome}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {strings.Home}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* My Bids Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    backgroundColor: '#f5f5f5',
                    height: 40,
                    justifyContent: 'center',
                    opacity: 0.6,
                    marginTop: 15,
                  }}
                  onPress={() => {}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 24,
                        width: 24,
                        tintColor: 'black',
                        marginLeft: 7,
                      }}
                      source={images.drawerBids}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'black',
                        marginLeft: 20,
                      }}>
                      {strings.MyBids}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* My Ads Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.goToMyAds}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerMyProducts}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {strings.myProducts}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Contact us Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.goToContactus}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerContact}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {strings.Contactus}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* About Harrj Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.goToAboutHarrj}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerAboutus}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {strings.AboutHarrj}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Privacy Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.goToPrivacy}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerPrivacy}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {strings.PrivacyPolicy}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Share harrj Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.goToShare}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerShare}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {strings.Share}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Sign Out */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.goToSignIn}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerSignout}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {strings.signout}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Change Lang Button */}

                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    alignItems: 'flex-start',
                    borderRadius: 5,
                    marginTop: 15,
                    height: 40,
                    justifyContent: 'center',
                  }}
                  onPress={this.storeLang}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 20,
                        width: 20,
                        tintColor: 'white',
                        marginLeft: 10,
                      }}
                      source={images.drawerLang}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'white',
                        marginLeft: 20,
                      }}>
                      {this.state.UniversalLangString}
                    </Text>
                  </View>
                </TouchableOpacity>

                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    marginTop: 20,
                    fontFamily: 'Cairo-Bold',
                  }}>
                  {strings.design}
                  {'\n'}
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      marginTop: 10,
                    }}>
                    SublimeTechnocorp
                  </Text>
                </Text>
              </ScrollView>
            </View>
            {/* </ImageBackground> */}
          </ReactNativeModal>

          {/* Bottom Navigation */}

          <View
            style={{
              backgroundColor: '#505B98',
              flexDirection: 'row',
              height: 70,
              justifyContent: 'space-around',
              alignItems: 'center',
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
              marginTop: 'auto',
            }}>
            <BottomNav
              icon={images.homeIcon}
              color="grey"
              onPress={this.openHome}
            />

            <BottomNav
              icon={images.normalBidIcon}
              color="grey"
              onPress={this.openNormalBid}
            />

            {/* Create Ad Button */}

            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#505B98',
                  height: 65,
                  width: 65,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 40,
                  borderWidth: 1,
                  borderColor: '#505B98',
                }}
                onPress={this.getActionSheet}>
                <Image
                  style={{
                    height: 60,
                    width: 60,
                    tintColor: 'white',
                  }}
                  source={images.createAd}
                />
              </TouchableOpacity>
            </View>

            <BottomNav
              icon={images.liveBidIcon}
              color="grey"
              onPress={this.openLiveBid}
            />

            <BottomNav
              icon={images.searchIcon}
              color="grey"
              onPress={this.openSearch}
            />
          </View>

          {/* <ActionButton
                        icon={<View>
                            <Image
                                style={{
                                    height: 55, width: 55, tintColor: 'white'
                                }}
                                source={images.createAd}
                            />
                        </View>}
                        buttonColor="#505B98">
                        <ActionButton.Item
                            buttonColor='#CC1212' title="New Task" onPress={this.openLiveNow}>
                            <Image source={images.live_now} style={{ height: 44, width: 44, tintColor: 'white' }} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#CC1212' title="Notifications" onPress={this.openSchedule_live}>
                            <Image source={images.schedule_live} style={{ height: 44, width: 44, tintColor: 'white' }} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#CC1212' title="All Tasks" onPress={this.openCreateAd}>
                            <Image source={images.normal_ads} style={{ height: 44, width: 44, tintColor: 'white' }} />
                        </ActionButton.Item>
                    </ActionButton> */}
        </View>
      </Provider>
    );
  }

  bidsRender(item) {
    return (
      <TouchableOpacity
        disabled={true}
        style={{
          marginTop: '3%',
          flex: 1,
          marginBottom: '3%',
          marginHorizontal: '3%',
          backgroundColor: 'white',
          elevation: 5,
          borderRadius: 10,
        }}>
        {/* Custom Card */}

        <View style={styles.card}>
          <View style={{justifyContent: 'center', marginHorizontal: 3}}>
            {/* Image */}

            <Image style={styles.image} source={{uri: item.product_img}} />
          </View>

          {/* My Orders Title and others */}

          <View
            style={{
              flexDirection: 'column',
              marginTop: '3%',
              marginLeft: 3,
            }}>
            {/* Title and time left*/}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 230,
              }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                style={styles.titleText}>
                {item.title}
              </Text>
              {/* <Text style={styles.regularText}>01:49 min left</Text> */}
            </View>

            {/* Bid Price and number of bids */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                // width: 200,
                marginTop: 2,
                marginRight: '10%',
              }}>
              <View
                style={{
                  backgroundColor: '#505B98',
                  borderRadius: 30,
                }}>
                {(() => {
                  if (
                    item.bidCount &&
                    typeof item.bidCount !== 'undefined' &&
                    item.bidCount !== null &&
                    item.bidCount !== ''
                  ) {
                    return (
                      <Text style={styles.bidNos}>
                        {item.bidCount} {strings.bids}
                      </Text>
                    );
                  } else {
                    return <Text style={styles.bidNos}>0 {strings.bids}</Text>;
                  }
                })()}
              </View>
            </View>

            {/* Order Status */}

            <Text style={styles.mediumText}>
              {strings.status}:
              {(() => {
                if (item.bid_status && item.bid_status === 'pending') {
                  return (
                    <Text style={styles.regularText}> {strings.notAward}</Text>
                  );
                } else {
                  return (
                    <Text style={styles.regularText}> {strings.award}</Text>
                  );
                }
              })()}
            </Text>

            {/* Bid Amount */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontFamily: 'Cairo-SemiBold',
                  textAlignVertical: 'center',
                  textAlign: 'justify',
                }}>
                {strings.BitAmt}:
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={styles.priceText}>
                  {' '}
                  {strings.priceSymbol} {item.bid_amount}
                </Text>
              </Text>

              {/* Delete Bids */}

              <TouchableOpacity
                onPress={() => {
                  this.onPressDeleteConfirm(item.bidder_id, item.bid_id);
                  console.log('item.bidder_id, item.bid_id');
                  console.log(item.bidder_id, item.bid_id);
                }}
                style={{
                  backgroundColor: '#505B98',
                  borderRadius: 10,
                  marginBottom: 10,
                  //   marginHorizontal: 10,
                  marginRight: '10%',
                }}>
                <Image
                  style={{
                    height: 18,
                    width: 18,
                    tintColor: 'white',
                    margin: 5,
                  }}
                  source={images.deleteIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

//export default MyOrders;

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(MyOrders);

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    textAlign: 'justify',
    // textAlignVertical: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 130,
    height: 110,
    borderRadius: 10,
  },

  regularText: {
    fontSize: 14,
    // fontFamily: 'Cairo-SemiBold',
    textAlign: 'justify',
    // textAlignVertical: 'center'
  },
  mediumText: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    marginTop: 10,
    textAlignVertical: 'center',
    textAlign: 'justify',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    textAlign: 'justify',
  },
  priceText: {
    fontSize: 14,
    // fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    marginBottom: 10,
    textAlign: 'justify',
    width: 50,
  },
  bidNos: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    color: 'white',
    margin: 4,
  },

  modal: {
    backgroundColor: 'transparent',
    height: '100%',
  },

  sideMenuStyle: {
    margin: 0,
    width: width * 0.75, // SideMenu width
  },
});
