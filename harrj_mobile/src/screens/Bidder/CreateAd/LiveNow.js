import React from 'react';
import {
  Image,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import images from '../../../assets/images/images';
import { Dropdown } from 'react-native-element-dropdown';
import { Appbar } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import DatePickerCustom from '../../../components/datePicker';
import TimePickerCustom from '../../../components/timePicker';
import { getCityAction } from '../../../actions/addCity.action';
import { getCountryAction } from '../../../actions/getCountry.action';
import ValidationComponent from '../../../../ValidationComponent';
import { Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { addLiveNowAd } from '../../../actions/addAds.action';
import { CallScreen } from '../../call-screen/call-screen';
import { Actions } from 'react-native-router-flux';

import EncryptedStorage from 'react-native-encrypted-storage';
import { Dimensions } from 'react-native';
import strings from '../../../translations/translateConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  checkMultiple,
  openSettings,
  Permission,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { PermissionStatus } from 'react-native';
import { slackServiceFun } from '../../../service/slack/slack';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import Progress from '../../../components/Progress/progress';

var sessionName = '';
var displayName = '';
var sessionPassword = '';

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

class LiveNow extends ValidationComponent<{}> {
  constructor(props) {
    const labels = {
      title: 'Title',
    };

    AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
      // console.log('Sign up language');
      console.log(value);
      if (value === 'ar') {
        labels.title = 'العنوان';
      }
    });

    super({ ...props, labels });

    this.props = props;
    this.state = {
      date: new Date(),
      mode: '',
      show: false,
      setValue: '',
      title: '',
      description: '',
      city_id: '',
      country_id: 16,
      progress: false,
      country: [
        // { label: 'UAE', value: '1' },
        // { label: 'IN', value: '2' },
        // { label: 'US', value: '3' },
        // { label: 'UK', value: '4' },
        // { label: 'RS', value: '5' },
      ],
      city: [
        // { label: 'Riyadh', value: '3' },
        // { label: 'Abha', value: '4' },
        // { label: 'Buraydah', value: '5' },
      ],

      cityfilteredArray: [],
    };
    this.onCreatePostValidation = this.onCreatePostValidation.bind(this);
  }

  componentDidMount() {
    // Camera Permission
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

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
    try {
      AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
        if (value != null) {
          console.log('componentDidmount if');
          console.log(value);
          strings.setLanguage(value);
          if (value === 'en') {
            this.setState({ UniversalLangString: 'Arabic', selectedLan: true });
          } else {
            if (value === 'ar') {
              this.setState({
                UniversalLangString: 'English',
                selectedLan: false,
              });
            }
          }
        } else {
          console.log('componentDidmount  elses');
          this.setState({
            UniversalLangString: 'English',
            selectedLan: false,
            value: 'ar',
          });
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }

    console.log('Getting Data:');
    this.getCountryFun();
    this.getCityFun();
  }

  setDate = (event, date) => {
    date = date || this.state.date;
    console.log(date);
    this.setState({
      show: false,
      date,
    });
  };

  // Country Dropdown

  country_fun = (item) => {
    this.setState({ country_id: item.country_id });
    console.log('country Fun Item');
    console.log(item.country_id);

    this.getCityFun();
  };

  // City Dropdown

  city_fun = (item) => {
    this.setState({ city_id: item.city_id });
    console.log('City Fun Item');
    console.log(item.city_id);
  };

  // Create Ad button Validation

  onCreatePostValidation = async () => {
    var error = 'TESTING';
    var statusType = 'error';
    var errorLogData = '' + error + '';
    var screenName = 'LIVENOW';
    var methodFunName = 'CREATE LIVE NOW BUTTON';
    var noteDesc = 'try-catch';
    var callingServer = 'Client';
    var apiUrl = '';
    var apiMethod = '';
    var apiRequestData = '';
    var apiResponseData = '';

    var slackErrorResponse = await slackServiceFun.slackErrorFun(
      statusType,
      errorLogData,
      screenName,
      methodFunName,
      noteDesc,
      callingServer,
      apiUrl,
      apiMethod,
      apiRequestData,
      apiResponseData
    );

    this.validate({
      title: { required: true, maxlength: 50 },
      country_id: { required: true },
      city_id: { required: true },
      description: { required: true },
    });

    if (this.getErrorMessages()) {
      // Alert.alert("Form Not Validate..");
      // Alert.alert("Please enter valid information");
      // Alert.alert(
      //     "Alert",
      //     ("Please enter valid information"),
      //     [
      //         { text: 'OK', style: 'destructive' },
      //     ],
      //     { cancelable: true });
    } else {
      this.onCreatePost();
    }
  };

  // Create Ad button

  onCreatePost = async () => {
    this.setState({ progress: true });
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation.navigate;

      

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        // var customer_id = sessionData.user_id;
        var customer_id = sessionData.user_id;
        var mobile_no = sessionData.user_mobile_id;

        // token, title, description, city_id, country_id
        dispatch(
          addLiveNowAd(
            authToken,
            customer_id,
            this.state.title,
            this.state.description,
            this.state.city_id,
            this.state.country_id
          )
        )
          .then(async (response) => {
            // console.log('addLiveNowAd Token: ');
            // console.log(authToken);
            // console.log('dispatch response addLiveNowAd: ');
            // console.log(response);

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
            }

            if (response.success == false) {
              var statusType = 'error';
              var errorLogData = '' + response + '';
              var screenName = 'LIVENOW';
              var methodFunName = 'CREATE LIVE NOW BUTTON';
              var noteDesc = 'response success fail';
              var callingServer = 'Client';
              var apiUrl = '';
              var apiMethod = '';
              var apiRequestData = '';
              var apiResponseData = '';

              var slackErrorResponse = await slackServiceFun.slackErrorFun(
                statusType,
                errorLogData,
                screenName,
                methodFunName,
                noteDesc,
                callingServer,
                apiUrl,
                apiMethod,
                apiRequestData,
                apiResponseData
              );
            }

            // console.log('response.user_id');
            // console.log(mobile_no);
            // console.log('response.data.meeting_id');
            // console.log(response.data.meeting_id);
            // console.log('response.data.metteing_pass');
            // console.log(response.data.metteing_pass);

            let setItemEncryptedStorageUserObj = await EncryptedStorage.setItem(
              'user_zoom_session_obj',
              JSON.stringify({
                zoom_mobile_no: mobile_no,
                zoom_meeting_id: response.data.meeting_id.toString(),
                zoom_metteing_pass: response.data.metteing_pass.toString(),
                zoom_user_type: 'auctioneer',
                zoom_user_role: 1,
                zoom_product_id: response.data.product_id.toString(),
              })
            );

            this.props.navigation.navigate('zoom_example_confirm');
            // {
            //     sessionName,
            //     displayName,
            //     sessionPassword,
            // })
            // this.props.navigation.navigate('home')
          })
          .catch(async (error) => {
            this.setState({ progress: false });
            var statusType = 'error';
            var errorLogData = '' + error + '';
            var screenName = 'LIVENOW';
            var methodFunName = 'CREATE LIVE NOW BUTTON';
            var noteDesc = 'try-catch';
            var callingServer = 'Client';
            var apiUrl = '';
            var apiMethod = '';
            var apiRequestData = '';
            var apiResponseData = '';

            var slackErrorResponse = await slackServiceFun.slackErrorFun(
              statusType,
              errorLogData,
              screenName,
              methodFunName,
              noteDesc,
              callingServer,
              apiUrl,
              apiMethod,
              apiRequestData,
              apiResponseData
            );
            // console.log('addLiveNowAd dispatch error: ');
            // console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({ progress: false });

      var statusType = 'error';
      var errorLogData = '' + errorCatch + '';
      var screenName = 'LIVENOW';
      var methodFunName = 'CREATE LIVE NOW BUTTON';
      var noteDesc = 'try-catch';
      var callingServer = 'Client';
      var apiUrl = '';
      var apiMethod = '';
      var apiRequestData = '';
      var apiResponseData = '';

      var slackErrorResponse = await slackServiceFun.slackErrorFun(
        statusType,
        errorLogData,
        screenName,
        methodFunName,
        noteDesc,
        callingServer,
        apiUrl,
        apiMethod,
        apiRequestData,
        apiResponseData
      );
    }
  };

  // Get Country API

  getCountryFun = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(getCountryAction(authToken))
          .then((response) => {
            // console.log('get Country Token: ');
            // console.log(authToken);

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({ country: response.data });
            }

            var countryListTemp = [];
            var countryList = response.data;

            for (var index = 0; index < countryList.length; index++) {
              // const element = array[index];
              if (this.state.UniversalLangString === 'English') {
                var tempArray = {
                  country_id: countryList[index].country_id,
                  country_name: countryList[index].country_name_arabic,
                };
                countryListTemp.push(tempArray);
              } else {
                var tempArray = {
                  country_id: countryList[index].country_id,
                  country_name: countryList[index].country_name,
                };
                countryListTemp.push(tempArray);
              }
            }
            this.setState({ country: countryListTemp, country_id: 16 });
            console.log('countryListTemp');
            console.log(countryListTemp);
          })
          .catch((error) => {
            this.setState({ progress: false });
            // console.log('dispatch error: ');
            // console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({ progress: false });
    }
  };

  // Get City API

  getCityFun = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(getCityAction(authToken))
          .then((response) => {
            // console.log('get City Token: ');
            // console.log(authToken);
            // console.log('dispatch response get: ');
            // console.log(response);

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({ city: response.data });
            }
            if (
              this.state.country_id &&
              typeof this.state.country_id !== 'undefined'
            ) {
              console.log('if ');

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              var cityListTemp = [];
              var cityList = this.state.city;

              for (var index = 0; index < cityList.length; index++) {
                if (this.state.UniversalLangString === 'English') {
                  var tempArray = {
                    city_id: cityList[index].city_id,
                    city_name: cityList[index].city_name_arabic,
                    country_id: cityList[index].country_id,
                  };
                  cityListTemp.push(tempArray);
                } else {
                  var tempArray = {
                    city_id: cityList[index].city_id,
                    city_name: cityList[index].city_name,
                    country_id: cityList[index].country_id,
                  };
                  cityListTemp.push(tempArray);
                }
              }

              this.setState({ city: cityListTemp });
              // console.log("this.state.city");
              // console.log(this.state.city);

              let filteredArray = this.state.city.filter((item) => {
                if (this.state.country_id === item.country_id) {
                  // console.log(this.state.country_id);
                  // console.log('item.country_id');
                  // console.log(item.country_id);
                  // console.log('if');
                  return true;
                } else {
                  // console.log('this.state.country_id');
                  // console.log(this.state.country_id);
                  // console.log('item.country_id');
                  // console.log(item.country_id);
                  // console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                          console.log(this.state.subCategorieList); */

              // console.log('if filteredArray: ');
              // console.log(filteredArray);

              this.setState({ cityfilteredArray: filteredArray });
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              // console.log('else filteredArray: ');
              // console.log(filteredArray);

              this.setState({ cityfilteredArray: filteredArray });
              this.setState({});
            }
          })
          .catch((error) => {
            this.setState({ progress: false });
            // console.log('dispatch error: ');
            // console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({ progress: false });
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}
      >
        <Dialog visible={this.state.progress}>
          <DialogContent style={{ width: '80%' }}>
            <Progress />
          </DialogContent>
        </Dialog>
        <ScrollView>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height,
            }}
          >
            {/* App Bar */}

            <Appbar.Header style={{ backgroundColor: 'white', elevation: 0 }}>
              <Appbar.BackAction
                onPress={(props) => {
                  this.props.navigation.goBack(null);
                }}
              />

              {/* Harrj Logo */}

              <View style={{ flex: 1 }}>
                <Image
                  style={{ resizeMode: 'contain', width: 75 }}
                  source={images.ic_harjj_logo}
                />
              </View>
            </Appbar.Header>

            {/* Add Product Details */}

            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                flex: 1,
                marginHorizontal: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 50,
                  elevation: 10,
                  marginHorizontal: 5,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  alignSelf: 'center',
                  shadowColor: '#171717',
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}
              >
                {/* Title Input  */}

                <View style={styles.textInputView}>
                  <TextInput
                    ref={'title'}
                    style={styles.textInput}
                    placeholder={strings.title}
                    value={this.state.title}
                    onChangeText={(itemValue) =>
                      this.setState({ title: itemValue })
                    }
                  />
                </View>
                {this.isFieldInError('title') &&
                  this.getErrorsInField('title').map((errorMessage) => (
                    <Text style={styles.error_text}>
                      {/* {strings.Titlefieldisrequired} */}
                      {errorMessage}
                    </Text>
                  ))}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Country Dropdown */}
                  <View>
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      placeholder={strings.country}
                      data={this.state.country}
                      labelField="country_name"
                      valueField="country_id"
                      value={this.state.country_id}
                      onChange={this.country_fun}
                      containerStyle={styles.container}
                      showsVerticalScrollIndicator={false}
                      maxHeight={150}
                      iconColor="#2D2C71"
                      activeColor="trasnparent"
                    />
                    {this.isFieldInError('country_id') &&
                      this.getErrorsInField('country_id').map(
                        (errorMessage) => (
                          <Text style={styles.error_text}>
                            {strings.CountryisRequired}
                          </Text>
                        )
                      )}
                  </View>

                  <View>
                    {/* City Dropdown */}

                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      placeholder={strings.city}
                      data={this.state.cityfilteredArray}
                      labelField="city_name"
                      valueField="city_id"
                      value={this.state.city_id}
                      onChange={this.city_fun}
                      containerStyle={styles.container}
                      showsVerticalScrollIndicator={false}
                      maxHeight={150}
                      iconColor="#2D2C71"
                      activeColor="trasnparent"
                    />
                    {this.isFieldInError('city_id') &&
                      this.getErrorsInField('city_id').map((errorMessage) => (
                        <Text style={styles.error_text}>
                          {strings.CityisRequired}
                        </Text>
                      ))}
                  </View>
                </View>

                {/* Description Input */}

                <View style={styles.DecsInputView}>
                  <TextInput
                    style={styles.DecsInput}
                    placeholder={strings.description}
                    // numberOfLines={4}
                    multiline={true}
                    value={this.state.description}
                    onChangeText={(itemValue) =>
                      this.setState({ description: itemValue })
                    }
                  />
                </View>
                {this.isFieldInError('description') &&
                  this.getErrorsInField('description').map((errorMessage) => (
                    <Text style={styles.error_text}>
                      {strings.Descriptionfieldisrequired}
                    </Text>
                  ))}

                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: 15,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 50,
                      backgroundColor: '#2D2C71',
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 2,
                      paddingHorizontal: 10,
                    }}
                    onPress={() => {
                      this.onCreatePostValidation();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: 'Cairo-Bold',
                        color: 'white',
                      }}
                    >
                      {strings.GoLive}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#2D2C71',
    height: 50,
    marginBottom: 10,
    marginTop: 10,
  },

  textInput: {
    borderBottomColor: '#FFFFFF',
    paddingHorizontal: 15,
    width: '100%',
    textAlign: 'left',
    alignSelf: 'center',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
  },

  DecsInputView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#2D2C71',
    marginBottom: 10,
    marginTop: 10,
  },

  DecsInput: {
    borderBottomColor: '#FFFFFF',
    paddingHorizontal: 15,
    width: '100%',
    textAlign: 'left',
    alignSelf: 'center',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D2C71',
  },

  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2D2C71',
    width: 150,
    marginTop: 10,
    marginBottom: 5,
  },

  selectedTextStyle: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
  },

  placeholderStyle: {
    fontSize: 13,
    fontFamily: 'Cairo-Light',
  },

  auctionTypeDD: {
    // marginHorizontal: 16,
    // marginVertical: 10,
    height: 40,
    width: 180,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  error_text: {
    padding: 10,
    color: 'red',
    backgroundColor: '#ffebe6',
    borderRadius: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(LiveNow);
