import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { Appbar, Avatar } from 'react-native-paper';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ValidationComponent from '../../../ValidationComponent';
import { getOnlineProductAction } from '../../actions/bidder/getOnlineProducts.action';
import images from '../../assets/images/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import strings from '../../translations/translateConstant';
import { getProductInfo } from '../../actions/getProductInfo.action';
import * as Keychain from 'react-native-keychain';
import { FlatList } from 'react-native';
import Video from 'react-native-video';
import EncryptedStorage from 'react-native-encrypted-storage';
import SimpleToast from 'react-native-simple-toast';
import { Pagination } from 'react-native-snap-carousel';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Actions } from 'react-native-router-flux';
import moment from 'moment-timezone';
import Progress from '../../components/Progress/progress';
import {
  checkMultiple,
  openSettings,
  Permission,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { PermissionStatus } from 'react-native';
import * as RNLocalize from 'react-native-localize';

const platformPermissions = {
  ios: [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.MICROPHONE,
    //PERMISSIONS.IOS.PHOTO_LIBRARY,
  ],
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    //PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ],
};

class LiveProductDetails extends ValidationComponent {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      productDetail: [],
      product_ID: 0,
      progress: false,
      status: false,
      email_id: '',
      password: '',
      error: '',
      roleType: 2,
      user_id: '',
      imagelist: [
        'https://miro.medium.com/max/1172/1*9jp1NtH3IrRdorasFJrG7g.png',
        'https://yourshort.link/sqi9B',
      ],
      meeting_status: 0,
      entries: [],
      activeIndex: 0,
      start_time: '',
      end_time: '',
    };

    this.openZoom = this.openZoom.bind(this);
  }
  ShowTextInput = () => {
    if (this.state.status == false) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
      // Alert.alert("Bid Successfull")
    }
  };
  componentDidMount() {
    this.getProductDetails();
  }

  get pagination() {
    const { entries, activeIndex } = this.state;
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

  componentWillMount() {}
  openZoom = () => {
    this.props.navigation.navigate('zoom_view');
  };

  getProductDetails = async () => {
    this.setState({ progress: true });
    try {
      const { navigation, dispatch } = this.props;
      // console.log('navigation');
      // console.log(navigation.getParam('product_id'));
      // const { navigate } = this.props.navigation;
      const product_ID = navigation.getParam('product_id');
      this.setState({ product_ID: product_ID, progress: true });
      var authToken = '';
      var user_id = '';
      await Keychain.getGenericPassword()
        .then((credentials) => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;
          user_id = sessionData.user_id;
          this.setState({ progress: false });
        })
        .catch((error) => {
          // this.setState({ progress: false });
          console.log('Live Ads dispatch error: ');
          console.log(error);
          this.setState({ progress: false });
          // Alert.alert(error.message);
        });

      this.setState({
        user_id: user_id,
      });

      // console.log('Live Ads Token');
      // console.log(authToken);
      dispatch(getProductInfo(authToken, product_ID)).then((response) => {
        if (response && typeof response !== 'undefined' && response !== '') {
          var res = response.data;
          var getTimeZone = RNLocalize.getTimeZone();
          var start_date_time = res[0].start_date_time;
          var start_time = res[0].start_time;
          var end_date_time = res[0].end_date_time;
          var end_time = res[0].end_time;

          // change utc to timezone time

          var utc_startdateTime = start_date_time + 'T' + start_time + '.000Z';
          var startTime_moment = moment(utc_startdateTime);
          var start_time_temp = startTime_moment.tz(getTimeZone);

          var utc_enddateTime = end_date_time + 'T' + end_time + '.000Z';
          var endTime_moment = moment(utc_enddateTime);
          var end_time_temp = endTime_moment.tz(getTimeZone);

          var final_start_time = start_time_temp.format('hh:mm:ss');
          var final_end_time = end_time_temp.format('hh:mm:ss');
          console.log('final_start_time', final_start_time);
          this.setState({
            productDetail: response.data,
            progress: false,
            start_time: final_start_time,
            end_time: final_end_time,
          });

          setTimeout(() => {
            const permissions = platformPermissions[Platform.OS];
            let blockedAny = false;
            let notGranted: Permission[] = [];

            checkMultiple(permissions).then(
              (statuses: Record<Permission[number], PermissionStatus>) => {
                permissions.map((p: Permission) => {
                  const status = statuses[p];
                  if (status === RESULTS.BLOCKED) {
                    blockedAny = true;
                  } else if (status !== RESULTS.GRANTED) {
                    notGranted.push(p);
                  }
                });
                notGranted.length && requestMultiple(notGranted);
                blockedAny && openSettings();
              }
            );
          }, 1000);

          var add_by = response.data[0].add_by;

          if (add_by === user_id) {
            this.setState({
              roleType: 1,
            });
          } else {
            this.setState({
              roleType: 0,
            });
          }

          // console.log(this.state.roleType);

          var videoTemp = response.data[0].video;
          var imageTemp = response.data[0].product_img_list;

          if (response.data[0].video === null) {
            var temp = imageTemp;
          } else {
            var temp = imageTemp.concat({ videoTemp });
          }

          // console.log(
          //   ' ******************************** temp ********************************'
          // );
          // console.log(temp);

          this.setState({
            meeting_status: response.data[0].meeting_status,
            entries: temp,
          });
        } else {
        }
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      console.log('Try Catch Console');
      this.setState({ progress: false });
      console.log(errorCatch);
      // this.setState({ progress: false });
    }
  };

  gotoLiveFun = async (
    meeting_id,
    meeting_password,
    auction_type,
    start_date_time,
    end_date_time,
    start_time,
    end_time
  ) => {
    this.setState({ progress: true });
    if (auction_type === 'golivenow') {
      await Keychain.getGenericPassword().then(async (credentials) => {
        var sessionData = JSON.parse(credentials.password);
        var mobile_no = sessionData.user_mobile_id;
        let setItemEncryptedStorageUserObj = await EncryptedStorage.setItem(
          'user_zoom_session_obj',
          JSON.stringify({
            zoom_mobile_no: mobile_no,
            zoom_meeting_id: meeting_id.toString(),
            zoom_metteing_pass: meeting_password.toString(),
            zoom_user_type: 'bidder',
            zoom_user_role: this.state.roleType,
            zoom_product_id: this.state.product_ID,
            // zoom_end_date: ,
            // zoom_end_time: ,
          })
        );
      });
      this.setState({ progress: false });

      this.props.navigation.navigate('zoom_example_confirm');
    } else {
      if (auction_type === 'online') {
        await Keychain.getGenericPassword().then(async (credentials) => {
          var sessionData = JSON.parse(credentials.password);

          var customer_id = sessionData.user_id;
          var mobile_no = sessionData.user_mobile_id;

          var currentDate = new Date();

          //start time fix remove below
          start_time = start_time + ':00';

          startTime = new Date(currentDate.getTime());
          startTime.setHours(start_time.split(':')[0]);
          startTime.setMinutes(start_time.split(':')[1]);
          startTime.setSeconds(start_time.split(':')[2]);

          endTime = new Date(currentDate.getTime());
          endTime.setHours(end_time.split(':')[0]);
          endTime.setMinutes(end_time.split(':')[1]);
          endTime.setSeconds(end_time.split(':')[2]);

          var valid = startTime < currentDate && endTime > currentDate;

          // console.log('valid');
          // console.log(valid);

          var startDate = new Date(start_date_time);

          //end date fix remove below
          end_date_time = end_date_time.split('T');
          end_date_time = end_date_time[0];

          var endDate = new Date(end_date_time);

          var currentDateNew = new Date();
          currentDateNew = currentDateNew.toISOString().split('T')[0];

          currentDateNew = new Date(currentDateNew);

          // console.log('startDate');
          // console.log(startDate);

          // console.log('endDate');
          // console.log(endDate);

          // console.log('currentDateNew');
          // console.log(currentDateNew);

          var validDate =
            startDate <= currentDateNew && endDate >= currentDateNew;

          // console.log('validDate');
          // console.log(validDate);
          this.setState({ progress: false });
          if (valid && validDate) {
            let setItemEncryptedStorageUserObj = await EncryptedStorage.setItem(
              'user_zoom_session_obj',
              JSON.stringify({
                zoom_mobile_no: mobile_no,
                zoom_meeting_id: meeting_id.toString(),
                zoom_metteing_pass: meeting_password.toString(),
                zoom_user_type: 'bidder',
                zoom_user_role: this.state.roleType,
                zoom_product_id: this.state.product_ID,
                // zoom_end_date: ,
                // zoom_end_time: ,
              })
            );
            this.setState({ progress: false });
            this.props.navigation.navigate('zoom_example_confirm');
          } else {
            // Alert.alert(strings.LiveNotStart);
            let setItemEncryptedStorageUserObj = await EncryptedStorage.setItem(
              'user_zoom_session_obj',
              JSON.stringify({
                zoom_mobile_no: mobile_no,
                zoom_meeting_id: meeting_id.toString(),
                zoom_metteing_pass: meeting_password.toString(),
                zoom_user_type: 'bidder',
                zoom_user_role: this.state.roleType,
                zoom_product_id: this.state.product_ID,
                // zoom_end_date: ,
                // zoom_end_time: ,
              })
            );
            this.setState({ progress: false });
            this.props.navigation.navigate('zoom_example_confirm');
          }
        });
      }
    }
  };

  goToLogin = () => {
    this.setState({ alert: !this.state.alert });
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
    const { handleSubmit, loginUser } = this.props;

    return (
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <Dialog visible={this.state.progress}>
          <DialogContent style={{ width: '80%' }}>
            <Progress />
          </DialogContent>
        </Dialog>
        <Dialog visible={this.state.alert} dialogStyle={{ width: '65%' }}>
          <DialogContent style={{}}>
            <Text
              style={{
                textAlign: 'center',
                color: '#505B98',
                fontFamily: 'Cairo-Bold',
                fontSize: 20,
                marginTop: 10,
              }}
            >
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
                this.setState({ alert: false });
              }}
            >
              {strings.loginAlert}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ alert: false });
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'red',
                    fontFamily: 'Cairo-SemiBold',
                    fontSize: 18,
                  }}
                >
                  {strings.Cancel}
                </Text>
              </TouchableOpacity>
              <View style={{ width: 50 }} />
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
                  this.setState({ alert: false });
                  Actions.replace('sign_in');
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#ffffff',
                    fontFamily: 'Cairo-SemiBold',
                    fontSize: 18,
                  }}
                >
                  {strings.Login}
                </Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
        <View>
          <Appbar
            style={{
              backgroundColor: 'white',
              elevation: 0,
            }}
          >
            <Appbar.BackAction
              onPress={() => {
                this.props.navigation.goBack(null);
              }}
            />
            <Text
              style={{
                fontFamily: 'Cairo-Bold',
                textAlign: 'center',
                fontSize: 20,
              }}
            >
              {strings.LiveAuction}
            </Text>
          </Appbar>
        </View>

        <ScrollView showsHorizontalScrollIndicator={false}>
          {this.state.productDetail &&
            this.state.productDetail.length > 0 &&
            this.state.productDetail.map((item) => (
              <View style={{ flex: 0.5, alignContent: 'center' }}>
                <FlatList
                  pagingEnabled={true}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  // snapToAlignment="center"
                  data={this.state.productDetail}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.floor(
                      Math.floor(event.nativeEvent.contentOffset.x) /
                        Math.floor(event.nativeEvent.layoutMeasurement.width)
                    );
                    this.setState({ activeIndex: index });
                  }}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 5,
                        height: 300,
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        {item.product_img_list &&
                          item.product_img_list.length > 0 &&
                          item.product_img_list.map((productImage) => (
                            <Image
                              style={{
                                height: 300,
                                width: Dimensions.get('screen').width,
                              }}
                              resizeMode="contain"
                              source={{ uri: productImage.product_img }}
                            />
                          ))}
                        {(() => {
                          if (item.video !== null) {
                            return (
                              <Video
                                style={{ height: 300, width: 400 }}
                                source={{ uri: item.video }}
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

                {/* <SliderBox
                                    circleLoop
                                    sliderBoxHeight={350}
                                    dotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                    }}
                                    ImageComponentStyle={{ resizeMode: 'contain', width: '85%', borderRadius: 10, }}
                                    dotColor='grey'
                                    inactiveDotColor='lightgrey'
                                    imageLoadingColor="purple"
                                    // parentWidth={this.state.width}
                                    // images={this.state.imagelist}
                                    images={[item.product_img_list[0].product_img]}
                                /> */}

                {/* Title and OverView */}

                <View style={{ flex: 1, marginTop: 20, marginHorizontal: 15 }}>
                  <View style={styles.elevationContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 10,
                        marginTop: 15,
                        justifyContent: 'space-between',
                        marginHorizontal: 15,
                      }}
                    >
                      <View style={{ flexDirection: 'column' }}>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={2}
                          style={{
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: 24,
                            textAlign: 'justify',
                          }}
                        >
                          {item.title}
                        </Text>
                        {/* <Text style={{ fontFamily: 'Cairo-SemiBold', fontSize: 18, marginTop: 5, textAlign: 'justify', }}>{strings.priceSymbol}{item.starting_price}</Text> */}
                        <Text
                          style={{
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: 18,
                            marginTop: 5,
                            textAlign: 'justify',
                          }}
                        >
                          {strings.City}: {item.city_name}
                        </Text>
                        <View 
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                          }}
                        >
                          <Image
                            style={{ height: 28, width: 28 }}
                            source={images.date}
                          />
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 14,
                              color: '#505B98',
                              textAlign: 'justify',
                            }}
                          >
                            {item.start_date_time}
                          </Text>
                        </View>

                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                          <Image
                            style={{ height: 36, width: 28 }}
                            source={images.time}
                          />
                          {(() => {
                            // CONVERT START TIME
                            var start_time =
                              item.start_date_time +
                              'T' +
                              item.start_time +
                              '.000Z';
                            var start_time_utc = moment(start_time);
                            var getTimeZone = RNLocalize.getTimeZone();
                            var start_time_temp =
                              start_time_utc.tz(getTimeZone);

                            var final_start_time =
                              start_time_temp.format('hh:mm:ss');

                            // CONVERT END TIME

                            var end_time =
                              item.start_date_time +
                              'T' +
                              item.end_time +
                              '.000Z';
                            var end_time_utc = moment(end_time);
                            var end_time_temp = end_time_utc.tz(getTimeZone);

                            var final_end_time =
                              end_time_temp.format('hh:mm:ss');

                            return (
                              <Text
                                style={{
                                  fontFamily: 'Cairo-SemiBold',
                                  fontSize: 14,
                                  color: '#505B98',
                                  textAlign: 'justify',
                                }}
                              >
                                {this.state.start_time} - {this.state.end_time}
                              </Text>
                            );
                          })()}
                        </View>
                      </View>

                      {/* <TouchableOpacity
                        style={{ height: 38 }}
                        onPress={() => {
                          console.log('Pressed');
                        }}
                      >
                        <MaterialIcons name="favorite" size={38} color="red" />
                      </TouchableOpacity> */}
                    </View>
                  </View>

                  {/* Bid Description */}

                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flex: 1,
                        borderRadius: 35,
                        backgroundColor: 'white',
                        elevation: 3,
                      }}
                    >
                      <View
                        style={{
                          margin: 10,
                          marginTop: 15,
                          marginHorizontal: 15,
                          marginBottom: 20,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: 20,
                            textAlign: 'left',
                          }}
                        >
                          {strings.discp}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: 'Cairo-SemiBold',
                            color: 'grey',
                            marginTop: 10,
                            textAlign: 'left',
                          }}
                        >
                          {item.description}
                          {/* Dual 12MP Rear Camera captures stunning photos
                                                    A15 Bionic Chip ensures faster-processing speed
                                                    Cinematic Mode creates beautiful cinematic effects
                                                    IP68 Rating makes it water, dust, and splash resistant
                                                    Face ID secures your phone to a further level
                                                    Siri allows hands-free operations with swift voice commands. */}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      marginHorizontal: 10,
                      marginVertical: 20,
                    }}
                  >
                    {/* Live Bid */}

                    <View style={{ flexDirection: 'column', marginTop: 10 }}>
                      {(() => {
                        if (
                          this.state.meeting_status === 1 &&
                          this.state.user_id !== item.add_by
                        ) {
                          return (
                            <TouchableOpacity
                              style={styles.liveBtn}
                              onPress={() => {
                                if (
                                  this.state.user_id === null ||
                                  this.state.user_id === ''
                                ) {
                                  this.goToLogin();
                                } else {
                                  this.gotoLiveFun(
                                    item.meeting_id,
                                    item.meeting_password,
                                    item.auction_type,
                                    item.start_date_time,
                                    item.end_date_time,
                                    this.state.start_time,
                                    this.state.end_time
                                  );
                                }
                                // if (this.state.meeting_status === 2) {
                                //   SimpleToast.show(
                                //     strings.MeetinghasEnded,
                                //     SimpleToast.SHORT
                                //   );
                                // } else if (this.state.meeting_status === 0) {
                                //   SimpleToast.show(
                                //     strings.MeetingnotStarted,
                                //     SimpleToast.SHORT
                                //   );
                                // } else {
                                //   this.gotoLiveFun(
                                //     item.meeting_id,
                                //     item.meeting_password,
                                //     item.auction_type,
                                //     item.start_date_time,
                                //     item.end_date_time,
                                //     item.start_time,
                                //     item.end_time
                                //   );
                                // }
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontFamily: 'Cairo-Bold',
                                  color: 'white',
                                }}
                              >
                                {strings.join}
                              </Text>
                            </TouchableOpacity>
                          );
                        } else if (
                          item.auction_type === 'golivenow' &&
                          this.state.meeting_status === 0 &&
                          this.state.user_id === item.add_by
                        ) {
                          if (
                            item.start_date_time ===
                            moment(new Date()).format('YYYY-MM-DD')
                          ) {
                            var start_time_temp = moment(
                              item.start_time,
                              'hh:mm:ss'
                            )
                              .format('LTS')
                              .split(' ');
                            start_time_temp = start_time_temp[0];
                            console.log(start_time_temp);
                            var currentTime = moment().format('hh:mm:ss');
                            // console.log("currentTime: ",currentTime , "start_time_temp:", start_time_temp);

                            if (currentTime >= this.state.start_time) {
                              return (
                                <TouchableOpacity
                                  style={styles.liveBtn}
                                  onPress={() => {
                                    if (
                                      this.state.user_id === null ||
                                      this.state.user_id === ''
                                    ) {
                                      this.goToLogin();
                                    } else {
                                      this.gotoLiveFun(
                                        item.meeting_id,
                                        item.meeting_password,
                                        item.auction_type,
                                        item.start_date_time,
                                        item.end_date_time,
                                        this.state.start_time,
                                        this.state.end_time
                                      );
                                    }
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      fontFamily: 'Cairo-Bold',
                                      color: 'white',
                                    }}
                                  >
                                    {strings.join}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          }
                          // }
                          // return (
                          //   <TouchableOpacity
                          //     style={styles.liveBtn}
                          //     onPress={() => {
                          //       if (
                          //         this.state.user_id === null ||
                          //         this.state.user_id === ''
                          //       ) {
                          //         this.goToLogin();
                          //       } else {
                          //         this.gotoLiveFun(
                          //           item.meeting_id,
                          //           item.meeting_password,
                          //           item.auction_type,
                          //           item.start_date_time,
                          //           item.end_date_time,
                          //           item.start_time,
                          //           item.end_time
                          //         );
                          //       }

                          //       // if (this.state.meeting_status === 2) {
                          //       //   SimpleToast.show(
                          //       //     strings.MeetinghasEnded,
                          //       //     SimpleToast.SHORT
                          //       //   );
                          //       // } else if (this.state.meeting_status === 0) {
                          //       //   SimpleToast.show(
                          //       //     strings.MeetingnotStarted,
                          //       //     SimpleToast.SHORT
                          //       //   );
                          //       // } else {
                          //       //   this.gotoLiveFun(
                          //       //     item.meeting_id,
                          //       //     item.meeting_password,
                          //       //     item.auction_type,
                          //       //     item.start_date_time,
                          //       //     item.end_date_time,
                          //       //     item.start_time,
                          //       //     item.end_time
                          //       //   );
                          //       // }
                          //     }}
                          //   >
                          //     <Text
                          //       style={{
                          //         fontSize: 20,
                          //         fontFamily: 'Cairo-Bold',
                          //         color: 'white',
                          //       }}
                          //     >
                          //       {strings.join}
                          //     </Text>
                          //   </TouchableOpacity>
                          // );
                        } else if (
                          item.auction_type === 'online' &&
                          this.state.meeting_status === 0 &&
                          this.state.user_id === item.add_by
                        ) {
                          // return (
                          //   <TouchableOpacity
                          //     style={styles.liveBtn}
                          //     onPress={() => {
                          //       if (
                          //         this.state.user_id === null ||
                          //         this.state.user_id === ''
                          //       ) {
                          //         this.goToLogin();
                          //       } else {
                          //         this.gotoLiveFun(
                          //           item.meeting_id,
                          //           item.meeting_password,
                          //           item.auction_type,
                          //           item.start_date_time,
                          //           item.end_date_time,
                          //           item.start_time,
                          //           item.end_time
                          //         );
                          //       }
                          //     }}
                          //   >
                          //     <Text
                          //       style={{
                          //         fontSize: 20,
                          //         fontFamily: 'Cairo-Bold',
                          //         color: 'white',
                          //       }}
                          //     >
                          //       {strings.join}
                          //     </Text>
                          //   </TouchableOpacity>
                          // );
                          if (
                            item.start_date_time ===
                            moment(new Date()).format('YYYY-MM-DD')
                          ) {
                            var start_time_temp = moment(
                              item.start_time,
                              'hh:mm:ss'
                            )
                              .format('LTS')
                              .split(' ');
                            start_time_temp = start_time_temp[0];
                            console.log(start_time_temp);
                            var currentTime = moment().format('hh:mm:ss');
                            console.log(
                              'currentTime: ',
                              currentTime,
                              'start_time_temp:',
                              this.state.start_time
                            );

                            if (currentTime >= this.state.start_time) {
                              return (
                                <TouchableOpacity
                                  style={styles.liveBtn}
                                  onPress={() => {
                                    if (
                                      this.state.user_id === null ||
                                      this.state.user_id === ''
                                    ) {
                                      this.goToLogin();
                                    } else {
                                      this.gotoLiveFun(
                                        item.meeting_id,
                                        item.meeting_password,
                                        item.auction_type,
                                        item.start_date_time,
                                        item.end_date_time,
                                        this.state.start_time,
                                        this.state.end_time
                                      );
                                    }
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      fontFamily: 'Cairo-Bold',
                                      color: 'white',
                                    }}
                                  >
                                    {strings.join}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          }
                        } else if (
                          item.auction_type === 'online' &&
                          this.state.meeting_status === 0
                        ) {
                          if (
                            item.start_date_time ===
                            moment(new Date()).format('YYYY-MM-DD')
                          ) {
                            var start_time_temp = moment(
                              this.state.start_time,
                              'hh:mm:ss'
                            )
                              .format('LTS')
                              .split(' ');
                            start_time_temp = start_time_temp[0];
                            console.log(start_time_temp);
                            var currentTime = moment().format('hh:mm:ss');
                            console.log(
                              'currentTime: ',
                              currentTime,
                              'start_time_temp:',
                              start_time_temp
                            );

                            if (currentTime >= start_time_temp) {
                              return (
                                <TouchableOpacity
                                  style={styles.liveBtn}
                                  onPress={() => {
                                    if (
                                      this.state.user_id === null ||
                                      this.state.user_id === ''
                                    ) {
                                      this.goToLogin();
                                    } else {
                                      this.gotoLiveFun(
                                        item.meeting_id,
                                        item.meeting_password,
                                        item.auction_type,
                                        item.start_date_time,
                                        item.end_date_time,
                                        this.state.start_time,
                                        this.state.end_time
                                      );
                                    }
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      fontFamily: 'Cairo-Bold',
                                      color: 'white',
                                    }}
                                  >
                                    {strings.join}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          }
                        } else {
                          return <></>;
                        }
                      })()}
                    </View>
                  </View>
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
    borderRadius: 35,
    backgroundColor: 'white',
    elevation: 3,
    // height: 160,
  },
  liveBtn: {
    height: 55,
    backgroundColor: '#FF2133',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});

const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  LiveProductDetails
);
