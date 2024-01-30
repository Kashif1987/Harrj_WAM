import React from 'react';
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import {Appbar, Avatar, IconButton} from 'react-native-paper';
import {connect} from 'react-redux';
import {compose} from 'redux';
import ValidationComponent from '../../../ValidationComponent';
import CollapseView from '../../components/Expandable';
import EnglishLan from '../../translations/en.json';
import ArabicLan from '../../translations/ar.json';
import {getOnlineProductAction} from '../../actions/bidder/getOnlineProducts.action';
import images from '../../assets/images/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import strings from '../../translations/translateConstant';
import {getProductInfo} from '../../actions/getProductInfo.action';
import {addBidAction} from '../../actions/addBid.action';
import {Modal} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Video from 'react-native-video';
import {FlatList} from 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import * as Keychain from 'react-native-keychain';
import SimpleToast from 'react-native-simple-toast';
import {isEmpty} from 'lodash';
import {addCommentAction} from '../../actions/addCommentAction';
import {getCommentAction} from '../../actions/getCommentsAction';
import moment from 'moment';
import {SimpleAccordion} from 'react-native-simple-accordion';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {Actions} from 'react-native-router-flux';
import Progress from '../../components/Progress/progress';
import {slackServiceFun} from '../../service/slack/slack';

var applanguage = '';
var lanStaticData = [];

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class ProductDetails extends ValidationComponent {
  constructor(props) {
    const labels = {
      bid_amount: 'Bid',
    };
    super({props, labels});
    this.props = props;
    this.state = {
      progress: false,
      status: false,
      applanguage: '',
      lanStaticData: [],
      productDetail: [],
      productInfo: [],
      activeIndex: 0,
      modalVisible: false,
      loading: false,
      commentModal: false,
      entries: [],
      index: 1,
      addBid: '',
      customer_id: 0,
      bid_amount: '',
      comment: '',
      commentList: [],
      product_id: '',
      page_records: 2,
      imagelist: [
        'https://m.media-amazon.com/images/I/61FxsUbnavL._SL1500_.jpg',
        'https://img.poorvika.com/1600_JPG/Smart-Technology/Oneplus/OnePlus-Watch/OnePlus%20Watch.jpg',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      ],
      user_id: '',
      insertId: 0,
    };

    this.openZoom = this.openZoom.bind(this);
  }

  componentDidMount = async () => {
    this.langFun();
    if (
      applanguage &&
      typeof applanguage !== 'undefined' &&
      applanguage === 'en'
    ) {
      this.setState({lanStaticData: EnglishLan});
      lanStaticData = EnglishLan;
    } else {
      if (
        applanguage &&
        typeof applanguage !== 'undefined' &&
        applanguage === 'ar'
      ) {
        this.setState({lanStaticData: ArabicLan});
        lanStaticData = ArabicLan;
      }
    }
    this.getProductInfo();
    await this.getCommentListFun();
  };

  get pagination() {
    const {entries, activeIndex} = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          // marginHorizontal: 8,
          backgroundColor: '#505B98',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        // animatedDuration={0}
        // animatedTension={0}
      />
    );
  }

  onPressButton = productItem => {
    this.validate({
      bid_amount: {numbers: true},
    });

    if (this.getErrorMessages()) {
      // SimpleToast.show(strings.specialNotAllowed, SimpleToast.SHORT);
      {
        this.isFieldInError('bid_amount') &&
          this.getErrorsInField('bid_amount').map(errorMessage =>
            SimpleToast.show(errorMessage, SimpleToast.SHORT),
          );
      }
    } else {
      // this.handleLogin();
      this.ValidatinFun(productItem);
      // console.log("Done");
    }
  };

  ValidatinFun = productItem => {
    console.log(
      `bid amt: ${this.state.bid_amount}, current price: ${productItem.max_bid_amount}, max price: ${productItem.starting_price}`,
    );

    if (this.state.bid_amount == '') {
      SimpleToast.show(strings.Bidamountcantbeempty, SimpleToast.SHORT);
    } else if (this.state.bid_amount == productItem.max_bid_amount) {
      // SimpleToast.show(strings.sameAsCurrentPrice, SimpleToast.SHORT);
      SimpleToast.show(strings.higherthanCurrentPrice, SimpleToast.SHORT);
    } else if (
      // productItem.starting_price > 0 &&
      this.state.bid_amount > productItem.starting_price
    ) {
      SimpleToast.show(
        strings.bidamountcantbehigherthanmaxprice,
        SimpleToast.SHORT,
      );
    } else if (this.state.bid_amount < productItem.max_bid_amount) {
      SimpleToast.show(
        strings.Bidamountcantbelowerthancurrentprice,
        SimpleToast.SHORT,
      );
    } else if (this.state.comment === '') {
      SimpleToast.show(strings.commentshouldnotbeempty, SimpleToast.SHORT);
    } else {
      // this.AddBidFun();
      if (this.state.comment <= '') {
        SimpleToast.show(strings.commentshouldnotbeempty, SimpleToast.SHORT);
      } else if (this.state.bid_amount == productItem.max_bid_amount) {
        //   SimpleToast.show(
        //    strings.sameAsCurrentPrice,
        //    SimpleToast.SHORT
        //  );
      } else if (this.state.bid_amount < productItem.max_bid_amount) {
        // SimpleToast.show(
        //   strings.Bidamountcantbeempty,
        //   SimpleToast.SHORT
        // );
        // SimpleToast.show(
        //   strings.Bidamountcantbelowerthancurrentprice,
        //   SimpleToast.SHORT
        // );
      } else {
        this.AddBidFun();
        // this.addCommentFun();
      }
    }
  };

  // open Bid Modal
  setModalVisible = visible => {
    this.setState({modalVisible: visible, bid_amount: 0, comment: ''});
  };

  // Open Comment Modal
  setCommentModalVisible = visible => {
    this.setState({commentModal: visible});
  };

  ShowTextInput = () => {
    if (this.state.status == false) {
      this.setState({status: true});
    } else {
      this.setState({status: false});
      // Alert.alert("Bid Successfull")
    }
  };

  // Change Language

  langFun = () => {
    AsyncStorage.getItem('AppLanguage').then(value => {
      if (value != null) {
        this.setState({applanguage: value});
        applanguage = value;
      } else {
        // console.log('elses');
      }
    });
  };

  openZoom = () => {
    this.props.navigation.navigate('zoom_view');
  };

  // Add Comments

  addCommentFun = async () => {
    try {
      const {navigation, dispatch} = this.props;
      // console.log('navigation');
      // console.log(navigation.getParam('product_id'));

      // const { navigate } = this.props.navigation;
      const product_id = navigation.getParam('product_id');

      var user_id = '';
      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          user_id = sessionData.user_id;
          // console.log('userID:', user_id);
        })
        .catch(error => {
          // this.setState({ progress: false });
          // console.log('Add Comments dispatch error: ');
          // console.log(error);
          // Alert.alert(error.message);
        });

      dispatch(
        addCommentAction(
          product_id,
          this.state.comment,
          user_id,
          this.state.insertId,
        ),
      ).then(response => {
        // console.log('dispatch response Add Comments: ');
        // console.log(response);

        if (response && typeof response !== 'undefined' && response !== '') {
          // this.setState({ progress: false });

          this.setModalVisible(false);
          this.setState({comment: '', bid_amount: 0, loading: false});
          setTimeout(() => {
            SimpleToast.show(
              strings.commentaddedsuccessfully,
              SimpleToast.SHORT,
            );
          }, 300);
          setTimeout(() => {
            this.getCommentListFun();
            this.getProductInfo();
          }, 500);
        } else {
          this.setState({loading: false});
          // Alert.alert('something went wrong..!!');
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        }
      });
    } catch (errorCatch) {
      Alert.alert(errorCatch.message);
      this.setState({loading: false});
    }
  };

  // Get Comments List
  getCommentListFun = async () => {
    try {
      const {navigation, dispatch} = this.props;

      const product_id = navigation.getParam('product_id');

      // await Keychain.getGenericPassword().then((credentials) => {
      //   var sessionData = JSON.parse(credentials.password);

      dispatch(getCommentAction(product_id)).then(response => {
        // console.log('dispatch response Get Comment: ');
        // console.log(response.data);

        if (response && typeof response !== 'undefined' && response !== '') {
          // console.log(response.data[0].add_by);
          this.setState({customer_id: response.data[0].add_by});
          // this.setState({ progress: false });
          this.setState({commentList: response.data});

          // var time = response.data[0].add_dt;
          // var updateTime = time.replace("T", " ").substring(0, 19);
          // console.log(" **************************** time ****************************");
          // console.log(time);
          // console.log(updateTime);

          // var dateTimeAgo = moment(new Date(updateTime)).fromNow();

          // console.log(
          //   ' **************************** dateTimeAgo ****************************'
          // );
          // console.log(dateTimeAgo);
        } else {
          // this.setState({ progress: false });
          // Alert.alert('something went wrong..!!');
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        }
        // })
        // .catch((error) => {
        //   // this.setState({ progress: false });
        //   // console.log('Get Comment dispatch error: ');
        //   // console.log(error);
        //   // Alert.alert(error.message);
        // });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      // this.setState({ progress: false });
    }
  };

  // Get Product Info
  getProductInfo = async () => {
    this.setState({progress: true});
    try {
      const {navigation, dispatch} = this.props;
      // console.log('navigation');
      // console.log(navigation.getParam('product_id'));

      // const { navigate } = this.props.navigation;
      const product_ID = navigation.getParam('product_id');

      console.log('************************ product_ID');
      console.log(product_ID);

      var authToken = '';

      var userId = '';

      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;

          userId = sessionData.user_id;
        })
        .catch(error => {
          this.setState({progress: false});
          // console.log('Normal Ads dispatch error: ');
          // console.log(error);
          // Alert.alert(error.message);
        });
      this.setState(
        {
          user_id: userId,
        },
        () => {
          console.log('************************ this.state.product_id');
          console.log(this.state.product_id);
        },
      );

      dispatch(getProductInfo(authToken, product_ID)).then(response => {
        // console.log('dispatch response getProduct: ');
        // console.log(response);
        // console.log('response.data.add_by');
        this.setState({product_id: product_ID});

        if (response && typeof response !== 'undefined' && response !== '') {
          // console.log(response.data[0].add_by);
          this.setState({
            customer_id: response.data[0].add_by,
            progress: false,
          });
          // this.setState({ progress: false });
          var videoTemp = response.data[0].video;
          var imageTemp = response.data[0].product_img_list;

          if (response.data[0].video === null) {
            var temp = imageTemp;
          } else {
            var temp = imageTemp.concat({videoTemp});
          }

          this.setState({
            productInfo: response.data,
            entries: temp,
            progress: false,
          });

          // console.log('this.state.productInfo');
          // console.log(this.state.entries);
          // console.log(imageTemp.concat({videoTemp}));
          // console.log(this.state.productInfo[0].product_img_list);
        } else {
          this.setState({progress: false});
          // Alert.alert('something went wrong..!!');
        }
      });
    } catch (errorCatch) {
      this.setState({progress: false});
      // Alert.alert(errorCatch.message);
      // this.setState({ progress: false });
    }
  };

  // Add Bids

  AddBidFun = async () => {
    // console.log('Add Bid');
    var error = 'ADD BID TESTING';
    var statusType = 'error';
    var errorLogData = '' + error + '';
    var screenName = 'Product Detail';
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

    try {
      this.setState({loading: true});
      const {navigation, dispatch} = this.props;
      // console.log(navigation.getParam('product_id'));

      const product_ID = navigation.getParam('product_id');

      var authToken = '';

      var userID = '';

      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;
          // var userID = sessionData.user_id;
          // console.log('Auth Token:', authToken);

          userID = sessionData.user_id;
        })
        .catch(async error => {
          var statusType = 'error';
          var errorLogData = '' + error + '';
          var screenName = 'Product Detail';
          var methodFunName = 'AddBidFun ';
          var noteDesc = 'Keychain try-catch';
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
          // console.log('dispatch error: ');
          // console.log(error);
        });
      // console.log('userID:', userID);

      // console.log(
      //   '*************************************',
      //   authToken,
      //   userID,
      //   product_ID,
      //   this.state.bid_amount,
      //   this.state.customer_id
      // );

      dispatch(
        addBidAction(
          authToken,
          userID,
          product_ID,
          this.state.bid_amount,
          this.state.customer_id,
        ),
      ).then(response => {
        console.log('response: *****************************');
        console.log(response.data.insertId);
        this.setState({insertId: response.data.insertId});

        // console.log('dispatch response getProduct: ');
        // this.addCommentFun();
        // setTimeout(() => {
        //   this.getCommentListFun();
        //   this.getProductInfo();
        // }, 500);
        // this.setState({ bid_amount: 0 });

        // this.setModalVisible(false);

        setTimeout(() => {
          SimpleToast.show(strings.BidAddedsuccessfully, SimpleToast.SHORT);
        }, 300);

        // console.log(response);
        if (response && typeof response !== 'undefined' && response !== '') {
          this.addCommentFun();
          this.setState({bidderList: response.data});
        } else {
          this.setState({loading: false});
          // Alert.alert('something went wrong..!!');
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        }
      });
    } catch (error) {
      // console.log('Bidder List Try Catch');
      // console.log(errorCatch);

      // Alert.alert(errorCatch.message);
      this.setState({loading: false});

      var statusType = 'error';
      var errorLogData = '' + error + '';
      var screenName = 'Product Detail';
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
    }
  };

  BidCommentModal(productItem) {
    return (
      <Modal
        animationType="fade"
        visible={this.state.modalVisible}
        onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
        transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {(() => {
              if (this.state.loading === true) {
                return <Progress />;
              } else {
                return (
                  <>
                    <IconButton
                      color="#505B98"
                      style={{alignSelf: 'flex-end'}}
                      onPress={() => this.setModalVisible(false)}
                      icon="close"
                    />

                    <Text
                      style={{
                        fontFamily: 'Cairo-SemiBold',
                        fontSize: 22,
                      }}>
                      {strings.EnterYourBid}
                    </Text>

                    <View style={styles.textInputView}>
                      <TextInput
                        style={styles.textInput}
                        placeholder={strings.EnterYourBid}
                        placeholderTextColor="#37474F"
                        autoCapitalize="none"
                        textAlignVertical="center"
                        value={this.state.bid_amount}
                        // onTextInput={() => {
                        //   // if (this.state.bid_amount != '') {
                        //   this.setState({
                        //     bid_amount: this.state.bid_amount.trim(),
                        //   });
                        //   // }
                        //   if (this.state.bid_amount.startsWith('0')) {
                        //     this.setState({ bid_amount: '' });
                        //     SimpleToast.show(
                        //       strings.bidamountmustbegreaterthan0,
                        //       SimpleToast.SHORT
                        //     );
                        //   }
                        // }}
                        onChangeText={itemValue => {
                          this.setState({bid_amount: itemValue.trim()}, () => {
                            if (this.state.bid_amount.startsWith('0')) {
                              this.setState({bid_amount: ''});
                              SimpleToast.show(
                                strings.bidamountmustbegreaterthan0,
                                SimpleToast.SHORT,
                              );
                            }
                          });
                        }}
                        keyboardType="number-pad"
                        returnKeyType="done"
                        textAlign="left"
                      />
                    </View>

                    <View style={styles.textInputView}>
                      <TextInput
                        style={styles.textInput}
                        placeholder={strings.AddComments}
                        placeholderTextColor="#37474F"
                        autoCapitalize="none"
                        textAlignVertical="center"
                        value={this.state.comment}
                        onEndEditing={value => {
                          this.setState({
                            comment: this.state.comment.trim(),
                          });
                        }}
                        onChangeText={itemValue =>
                          this.setState({comment: itemValue}, () => {
                            // console.warn(this.state.comment);
                          })
                        }
                        keyboardType="default"
                        returnKeyType="done"
                        textAlign="left"
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setTimeout(() => {
                          this.onPressButton(productItem);
                        }, 100);
                      }}
                      style={{
                        height: 45,
                        width: 130,
                        backgroundColor: '#FF2133',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 3,
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Cairo-Bold',
                          color: 'white',
                        }}>
                        {strings.enterBid}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              }
            })()}
          </View>
        </View>
      </Modal>
    );
  }

  goToLogin = () => {
    this.setState({alert: !this.state.alert});
    // Alert.alert(
    //   strings.Alert,
    //   strings.loginAlert,
    //   [
    //     { text: strings.cancel, style: 'cancel' },
    //     {
    //       text: strings.Login,
    //       onPress: () => {
    //         Actions.sign_in();
    //         // this.userLogoutFun();
    //       },
    //     },
    //   ]
    //   // { cancelable: true }
    // );
    // return true;
  };

  render() {
    const {handleSubmit, loginUser, navigation} = this.props;

    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <Dialog visible={this.state.progress}>
          <DialogContent style={{width: '80%'}}>
            <Progress />
          </DialogContent>
        </Dialog>
        <Dialog visible={this.state.alert} dialogStyle={{width: '65%'}}>
          <DialogContent style={{}}>
            <Text
              style={{
                textAlign: 'center',
                color: '#505B98',
                fontFamily: 'Cairo-Bold',
                fontSize: 20,
                marginTop: 10,
              }}>
              {strings.Alert}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: '#505B98',
                fontFamily: 'Cairo-SemiBold',
                fontSize: 18,
                marginTop: 15,
              }}
              onPress={() => {
                this.setState({alert: false});
              }}>
              {strings.loginAlert}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({alert: false});
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'red',
                    fontFamily: 'Cairo-SemiBold',
                    fontSize: 18,
                  }}>
                  {strings.Cancel}
                </Text>
              </TouchableOpacity>
              <View style={{width: 50}} />
              <TouchableOpacity
                style={{
                  height: 34,
                  backgroundColor: '#505B98',
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 3,
                  width: 60,
                }}
                onPress={() => {
                  this.setState({alert: false});
                  Actions.replace('sign_in');
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#ffffff',
                    fontFamily: 'Cairo-SemiBold',
                    fontSize: 18,
                  }}>
                  {strings.Login}
                </Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
        {/* {this.state.productDetail && this.state.productDetail.length > 0 &&
          this.state.productDetail.map((item) => ( */}
        <View>
          <Appbar
            style={{
              backgroundColor: 'white',
              elevation: 0,
            }}>
            <Appbar.BackAction
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
            <Text
              style={{
                fontFamily: 'Cairo-Bold',
                textAlign: 'center',
                fontSize: 20,
              }}>
              {strings.NormalBid}
            </Text>
          </Appbar>
        </View>
        {/* ))} */}

        <ScrollView showsHorizontalScrollIndicator={false}>
          {this.state.productInfo &&
            this.state.productInfo.length > 0 &&
            this.state.productInfo.map(productItem => (
              <View style={{flex: 0.5, alignContent: 'center'}}>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled={true}
                  // snapToAlignment="center"
                  // onMomentumScrollEnd={onScrollEnd}
                  onMomentumScrollEnd={event => {
                    const index = Math.floor(
                      Math.floor(event.nativeEvent.contentOffset.x) /
                        Math.floor(event.nativeEvent.layoutMeasurement.width),
                    );
                    this.setState({activeIndex: index});
                  }}
                  data={this.state.productInfo}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 5,
                        height: 300,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        {item.product_img_list &&
                          item.product_img_list.length > 0 &&
                          item.product_img_list.map(productImage => (
                            <Image
                              style={{
                                height: 300,
                                width: Dimensions.get('screen').width,
                              }}
                              resizeMode="contain"
                              source={{uri: productImage.product_img}}
                            />
                          ))}

                        {(() => {
                          if (item.video !== null) {
                            return (
                              <Video
                                style={{
                                  height: 300,
                                  width: Dimensions.get('screen').width,
                                }}
                                source={{uri: item.video}}
                                muted={true}
                                resizeMode="contain"
                                repeat={true}
                              />
                            );
                          } else {
                            return <></>;
                          }
                        })()}
                      </View>
                    </View>
                  )}
                />

                {this.pagination}

                {/* Title and OverView */}

                <View style={{flex: 1, marginTop: 20, marginHorizontal: 15}}>
                  <View style={styles.elevationContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 10,
                        marginTop: 15,
                        justifyContent: 'space-between',
                        marginHorizontal: 15,
                      }}>
                      <View style={{flexDirection: 'column'}}>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={2}
                          style={{
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: 24,
                            textAlign: 'justify',
                            // width: 200,
                          }}>
                          {productItem.title}
                        </Text>

                        {/* Current Price */}

                        {(() => {
                          if (productItem.max_bid_amount === null) {
                            return (
                              <Text
                                style={{
                                  fontFamily: 'Cairo-SemiBold',
                                  fontSize: 18,
                                  marginTop: 5,
                                  textAlign: 'justify',
                                }}>
                                {strings.currentPrice}: {strings.priceSymbol}0
                              </Text>
                            );
                          } else {
                            return (
                              <Text
                                style={{
                                  fontFamily: 'Cairo-SemiBold',
                                  fontSize: 18,
                                  marginTop: 5,
                                  textAlign: 'justify',
                                }}>
                                {strings.currentPrice}: {strings.priceSymbol}
                                {productItem.max_bid_amount}
                              </Text>
                            );
                          }
                        })()}

                        {/* Max Price */}

                        {(() => {
                          // Change starting_price to max_price
                          if (
                            productItem.starting_price === 0 ||
                            productItem.starting_price === null
                          ) {
                            return <></>;
                          } else {
                            return (
                              <Text
                                style={{
                                  fontFamily: 'Cairo-SemiBold',
                                  fontSize: 18,
                                  marginTop: 5,
                                  textAlign: 'justify',
                                }}>
                                {strings.maxPrice}: {strings.priceSymbol}
                                {productItem.starting_price}
                              </Text>
                            );
                          }
                        })()}

                        <Text
                          style={{
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: 18,
                            marginTop: 5,
                            textAlign: 'justify',
                          }}>
                          {strings.City}: {productItem.city_name}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                            textAlign: 'justify',
                          }}>
                          <Image
                            style={{height: 28, width: 28}}
                            source={images.date}
                          />
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 14,
                              color: '#505B98',
                              textAlign: 'justify',
                            }}>
                            {productItem.start_date_time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Bid Description */}

                  <View style={{marginTop: 20}}>
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 25,
                        backgroundColor: 'white',
                        elevation: 3,
                        // height: 160,
                      }}>
                      <View
                        style={{
                          margin: 10,
                          marginTop: 15,
                          marginHorizontal: 15,
                          marginBottom: 20,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: 20,
                            textAlign: 'justify',
                          }}>
                          {strings.discp}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'Cairo-SemiBold',
                            color: 'grey',
                            marginTop: 10,
                            textAlign: 'justify',
                          }}>
                          {productItem.description}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Comment Section */}

                  <SimpleAccordion
                    arrowColor="#2D2C71"
                    bannerStyle={{
                      backgroundColor: 'white',
                      borderRadius: 10,
                      marginTop: 20,
                      elevation: 3,
                      shadowColor: 'black',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.3,
                      shadowRadius: 1,
                      marginBottom: 10,
                    }}
                    titleStyle={{
                      fontSize: 22,
                      color: '#2D2C71',
                      fontFamily: 'Cairo-SemiBold',
                    }}
                    viewContainerStyle={{
                      backgroundColor: 'white',
                      elevation: 0,
                    }}
                    title={strings.Comments}
                    viewInside={
                      <View>
                        <FlatList
                          data={this.state.commentList}
                          scrollEnabled={false}
                          renderItem={({item, index}) => (
                            <>
                              <View
                                style={{
                                  borderRadius: 8,
                                  elevation: 3,
                                  backgroundColor: 'white',
                                  padding: 10,
                                  marginTop: 10,
                                  shadowColor: '#171717',
                                  shadowOffset: {width: 2, height: 4},
                                  shadowOpacity: 0.2,
                                  shadowRadius: 3,
                                  margin: 5,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      fontFamily: 'Cairo-Bold',
                                      color: 'black',
                                      textAlign: 'justify',
                                    }}>
                                    {item.name}
                                  </Text>

                                  <Text
                                    style={{
                                      fontSize: 13,
                                      fontFamily: 'Cairo-SemiBold',
                                      color: 'grey',
                                      textAlign: 'justify',
                                    }}>
                                    {item.add_dt}
                                  </Text>
                                </View>

                                {(() => {
                                  if (
                                    this.state.user_id === productItem.add_by
                                  ) {
                                    return (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                        }}>
                                        <Text
                                          numberOfLines={2}
                                          style={{
                                            fontSize: 14,
                                            fontFamily: 'Cairo-Regular',
                                            color: 'black',
                                            textAlign: 'justify',
                                            width: '70%',
                                          }}>
                                          {item.email_id}
                                        </Text>
                                        <Text
                                          style={{
                                            fontSize: 14,
                                            fontFamily: 'Cairo-Regular',
                                            color: 'black',
                                            textAlign: 'justify',
                                          }}>
                                          {item.mobile_no}
                                        </Text>
                                      </View>
                                    );
                                  } else {
                                    return <></>;
                                  }
                                })()}

                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontSize: 16,
                                    fontFamily: 'Cairo-SemiBold',
                                    color: 'black',
                                    textAlign: 'justify',
                                  }}>
                                  {' '}
                                  {strings.BidAmounts}: ${item.bid_amount}
                                </Text>

                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontFamily: 'Cairo-SemiBold',
                                    color: 'black',
                                    textAlign: 'justify',
                                  }}>
                                  {' '}
                                  {item.comment}
                                </Text>
                              </View>
                            </>
                          )}
                        />
                      </View>
                    }
                  />

                  {/* Bid Button */}

                  {(() => {
                    if (this.state.user_id === productItem.add_by) {
                      return <></>;
                    } else {
                      return (
                        <View
                          style={{
                            flexDirection: 'column',
                            marginHorizontal: 10,
                            marginVertical: 20,
                          }}>
                          <TouchableOpacity
                            style={{
                              height: 55,
                              backgroundColor: '#FF2133',
                              borderRadius: 15,
                              alignItems: 'center',
                              justifyContent: 'center',
                              elevation: 3,
                            }}
                            // onPress={this.ShowTextInput}
                            onPress={() => {
                              console.log(this.state.user_id);
                              if (
                                this.state.user_id === null ||
                                this.state.user_id === ''
                              ) {
                                this.goToLogin();
                              } else {
                                this.setModalVisible(true);
                              }
                            }}>
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: 'Cairo-Bold',
                                color: 'white',
                              }}>
                              {strings.enterBid}
                            </Text>
                            {this.BidCommentModal(productItem)}
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })()}
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  elevationContainer: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 3,
    // height: 130,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    // padding: 25,
    paddingBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
    // width: 250,
  },

  textInputView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#2D2C71',
    height: 50,
    width: 250,
    marginTop: 10,
    marginBottom: 10,
  },

  textInput: {
    borderBottomColor: '#FFFFFF',
    paddingHorizontal: 15,
    textAlign: 'left',
    alignSelf: 'center',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    width: 250,
    height: 50,
  },
});

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ProductDetails,
);
