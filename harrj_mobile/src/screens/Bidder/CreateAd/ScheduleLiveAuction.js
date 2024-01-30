import React from 'react';
import {
  Image,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import images from '../../../assets/images/images';
import { Dropdown } from 'react-native-element-dropdown';
import { Appbar } from 'react-native-paper';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
//import DatePickerCustom from "../../../components/datePicker";
// import TimePickerCustom from "../../../components/timePicker";
import * as ImagePicker from 'react-native-image-picker';
import { getCategories } from '../../../actions/bidder/getCategories.action';
import { getCityAction } from '../../../actions/addCity.action';
import { getSubCategories } from '../../../actions/getSubCategories.action';
import { getYearAction } from '../../../actions/getYear.action';
import { getBrands } from '../../../actions/getBrands.action';
import { getModelAction } from '../../../actions/getModel.action';
import { getCountryAction } from '../../../actions/getCountry.action';
import { Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';
import ValidationComponent from '../../../../ValidationComponent';
import { addScheduleAd } from '../../../actions/addAds.action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import strings from '../../../translations/translateConstant';
import Video from 'react-native-video';
import SimpleToast from 'react-native-simple-toast';
import { Platform } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  checkMultiple,
  openSettings,
  Permission,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { PermissionStatus } from 'react-native';
import Progress from '../../../components/Progress/progress';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';
// TODO: Enable photo library permission when sharing view is done.
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

class ScheduleLive extends ValidationComponent<{}> {
  constructor(props) {
    const labels = {
      title: 'Title',
    };

    AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
      console.log('Sign up language');
      console.log(value);
      if (value === 'ar') {
        labels.title = 'العنوان';
      }
    });

    super({ ...props, labels });
    this.props = props;
    this.state = {
      start_date_time: new Date(),
      // end_date_time: new Date(),
      end_date_time: new Date(),
      start_time: new Date(),
      end_time: new Date(),
      openStartDate: false,
      openEndDate: false,
      startTime: false,
      endTime: false,
      setValue: '',
      title: '',
      name: 'name',
      description: '',
      keywords: '',
      starting_price: '0',
      model: [
        // { label: 'Gran Coupé DIESEL', value: '1' },
        // { label: 'Gran Coupé PETROL', value: '2' },
      ],
      country: [],
      category: [
        // { label: 'Car', value: '1' },
        // { label: 'Camera', value: '2' },
        // { label: 'Watch', value: '3' },
        // { label: 'Jewellery', value: '4' },
      ],
      sub_category: [
        // { label: 'BMW 2 Series', value: '1' },
        // { label: 'Sony', value: '2' },
        // { label: 'Rolex', value: '3' },
        // { label: 'Diamond Pendant', value: '4' },
      ],
      city: [
        // { label: 'Riyadh', value: '3' },
        // { label: 'Abha', value: '4' },
        // { label: 'Buraydah', value: '5' },
      ],
      year: [
        // { label: '2021', value: '1' },
        // { label: '2012', value: '2' },
        // { label: '2010', value: '3' },
      ],
      brand: [
        // { label: 'BMW', value: '1' },
        // { label: 'Sony', value: '2' },
        // { label: 'Titan', value: '3' },
        // { label: 'Tanishq', value: '4' },
      ],
      country_id: 16,
      city_id: '',
      model_id: '',
      brand_id: '',
      category_id: '',
      sub_category_id: '',
      year_id: '',

      isYear: false,

      video: '',
      videoUri: '',
      product_img1: '',
      product_img1Uri: '',
      product_img2: '',
      product_img2Uri: '',
      product_img3: '',
      product_img3Uri: '',

      subfilteredArray: [],
      brandfilteredArray: [],
      modelfilteredArray: [],
      cityfilteredArray: [],
    };
  }

  // Launch Camera for Video
  launchVideoCamera = () => {
    this.RBSheet.close();
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(
      {
        mediaType: 'video',
        videoQuality: 'medium',
        durationLimit: 30,
      },
      async (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled video picker');
          this.setState({ isVisible: false });
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          this.setState({ isVisible: false });
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
          this.setState({ isVisible: false });
        } else {
          console.log('Camera Launch Success');
          this.setState({
            video: {
              name: response.assets[0].fileName,
              uri: response.assets[0].uri,
              type: response.assets[0].type,
            },
            videoUri: response.assets[0].uri,
          });
          this.setState({});
        }
      }
    );
  };

  // Launch Gallery for Video
  launchVideoGallery = () => {
    this.RBSheet.close();
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'video',
        videoQuality: 'medium',
        durationLimit: 30,
      },
      async (response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled video picker');
          this.setState({ isVisible: false });
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          this.setState({ isVisible: false });
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
          this.setState({ isVisible: false });
        } else {
          console.log('Gallery Launch Success');
          this.setState({
            video: {
              name: response.assets[0].fileName,
              uri: response.assets[0].uri,
              type: response.assets[0].type,
            },
            videoUri: response.assets[0].uri,
          });
          this.setState({});
        }
      }
    );
  };

  // Launch Gallery for Image 1
  launchImageGallery1 = () => {
    this.RBSheet1.close();
    let options = {
      quality: 0.5,
      maxHeight: 2500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ isVisible: false });
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ isVisible: false });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({ isVisible: false });
      } else {
        console.log('Gallery Launch Success');
        this.setState({
          product_img1: {
            name: response.assets[0].fileName,
            uri: response.assets[0].uri,
            type: response.assets[0].type,
          },
          product_img1Uri: response.assets[0].uri,
        });
      }
    });
  };

  // Launch Camera for Image 1
  launchImageCamera1 = () => {
    this.RBSheet1.close();
    let options = {
      quality: 0.5,
      maxHeight: 2500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ isVisible: false });
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ isVisible: false });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({ isVisible: false });
      } else {
        console.log('Camera Launch Success');
        this.setState({
          product_img1: {
            name: response.assets[0].fileName,
            uri: response.assets[0].uri,
            type: response.assets[0].type,
          },
          product_img1Uri: response.assets[0].uri,
        });
      }
    });
  };

  // Launch Camera for Image 2
  launchImageCamera2 = () => {
    this.RBSheet2.close();
    let options = {
      quality: 0.5,
      maxHeight: 2500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ isVisible: false });
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ isVisible: false });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({ isVisible: false });
      } else {
        console.log('Camera Launch Success');
        this.setState({
          product_img2: {
            name: response.assets[0].fileName,
            uri: response.assets[0].uri,
            type: response.assets[0].type,
          },
          product_img2Uri: response.assets[0].uri,
        });
      }
    });
  };

  // Launch Gallery for Image 2
  launchImageGallery2 = () => {
    this.RBSheet2.close();
    let options = {
      quality: 0.5,
      maxHeight: 2500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ isVisible: false });
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ isVisible: false });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({ isVisible: false });
      } else {
        console.log('Gallery Launch Success');
        this.setState({
          product_img2: {
            name: response.assets[0].fileName,
            uri: response.assets[0].uri,
            type: response.assets[0].type,
          },
          product_img2Uri: response.assets[0].uri,
        });
      }
    });
  };

  // Launch Camera for Image 3
  launchImageCamera3 = () => {
    this.RBSheet3.close();
    let options = {
      quality: 0.5,
      maxHeight: 2500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ isVisible: false });
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ isVisible: false });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({ isVisible: false });
      } else {
        console.log('Camera Launch Success');
        this.setState({
          product_img3: {
            name: response.assets[0].fileName,
            uri: response.assets[0].uri,
            type: response.assets[0].type,
          },
          product_img3Uri: response.assets[0].uri,
        });
      }
    });
  };

  // Launch Gallery for Image 3
  launchImageGallery3 = () => {
    this.RBSheet3.close();
    let options = {
      quality: 0.5,
      maxHeight: 2500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ isVisible: false });
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ isVisible: false });
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({ isVisible: false });
      } else {
        console.log('Gallery Launch Success');
        this.setState({
          product_img3: {
            name: response.assets[0].fileName,
            uri: response.assets[0].uri,
            type: response.assets[0].type,
          },
          product_img3Uri: response.assets[0].uri,
        });
      }
    });
  };

  onEndTimeFun = () => {
    console.log('Open Date');
    console.log('Start Date Time');
    this.setState({ openStartDate: true });
    console.log(this.state.openStartDate);
  };

  // open Start Date Time

  onOpenStartDate = () => {
    console.log('Open Date');
    console.log('Start Date Time');
    this.setState({ openStartDate: true });
    console.log(this.state.openStartDate);
    console.log(this.state.start_time.getHours() + 2);
  };

  // open End Date Time

  onOpenEndDate = () => {
    console.log('Open Time');
    console.log('End Date Time');
    this.setState({ openEndDate: true });
    console.log(this.state.openEndDate);
  };

  // open Start Time

  onOpenStartTime = () => {
    console.log('Open Start Time');
    console.log('Start Time');
    this.setState({ startTime: true });
  };

  // open End Time

  onOpenEndTime = () => {
    console.log('Open End Time');
    console.log('End Time');
    this.setState({ endTime: true });
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

  // Category Dropdown

  category_fun = (item) => {
    console.log('item');
    console.log(item);
    this.setState({ category_id: item.category_id });
    console.log('Category Fun Item');
    console.log(item.category_id);

    this.getSubCategoryFun();
  };

  // Sub-Category Dropdown

  sub_category_fun = (item) => {
    this.setState({ sub_category_id: item.sub_category_id });

    console.log('Sub-Category Fun Item');
    console.log(item.sub_category_id);
    console.log('item.sub_category_id');
    console.log(item);
    if (item.sub_category_year_applies === 1) {
      this.setState({ isYear: true });
    } else {
      this.setState({ isYear: false });
    }
    // this.state.sub_category
    // isYear

    // var selected_year_data = this.state.sub_category.find(obj => obj.education_id == education_id);

    this.getBrandsFun();
  };

  // Year Dropdown

  year_fun = (item) => {
    this.setState({ year_id: item.year_id });
    console.log('Year Fun Item');
    console.log(item.year_id);
  };

  // Brand Dropdown

  brand_fun = (item) => {
    this.setState({ brand_id: item.brand_id });
    console.log('brand Fun Item');
    console.log(item.brand_id);

    this.getModelFun();
  };

  // Modal Dropdown

  model_fun = (item) => {
    this.setState({ model_id: item.model_id });
    console.log('Model Fun Item');
    console.log(item.model_id);
  };
  // Create Ad button Validation

  onCreatePostValidation = () => {
    // this.onCreatePost();
    this.validate({
      video: { required: false },
      product_img1: { required: false },
      product_img2: { required: false },
      product_img3: { required: false },
      title: { required: true, maxlength: 50 },
      country_id: { required: true },
      city_id: { required: true },
      category_id: { required: true },
      sub_category_id: { required: true },
      brand_id: { required: true },
      model_id: { required: true },
      year_id: { required: false },
      starting_price: { required: false },
      // keywords: { required: false },
      description: { required: true },
    });

    if (this.getErrorMessages()) {
    } else {
      this.onCreatePost();
    }
  };

  // Create Ad button

  onCreatePost = async () => {
    if (
      this.state.product_img1Uri !== '' ||
      this.state.product_img2Uri !== '' ||
      this.state.product_img3Uri !== ''
    ) {
      this.setState({ progress: true });
      try {
        const { dispatch } = this.props;
        const { navigate } = this.props.navigation;

        await Keychain.getGenericPassword().then((credentials) => {
          var sessionData = JSON.parse(credentials.password);
          var authToken = sessionData.token;
          var customer_id = sessionData.user_id;
          var mobile_no = sessionData.user_mobile_id;

          dispatch(
            addScheduleAd(
              authToken,
              customer_id,
              this.state.title,
              this.state.name,
              this.state.description,
              this.state.keywords,
              this.state.category_id,
              this.state.sub_category_id,
              this.state.starting_price,
              this.state.video,
              this.state.product_img1,
              this.state.product_img2,
              this.state.product_img3,
              this.state.start_date_time
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
              this.state.end_date_time
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19),
              this.state.brand_id,
              this.state.model_id,
              this.state.city_id,
              this.state.country_id,
              this.state.start_time,
              // .toTimeString()
              // .replace('GMT+0530', ' ')
              // .substring(0, 19),
              this.state.end_time,
              // .toTimeString()
              // .replace('GMT+0530', ' ')
              // .substring(0, 19),
              this.state.year_id
            )
          )
            .then((response) => {
              console.log('createScheduleAd Token: ');
              console.log(authToken);
              console.log('dispatch response createScheduleAd: ');
              // console.log(response);
              if (response.success === false) {
                this.setState({ progress: false });
                this.props.navigation.replace('home');
                setTimeout(() => {
                  SimpleToast.show(strings.someError, SimpleToast.SHORT);
                }, 300);
              } else if (
                response &&
                typeof response !== 'undefined' &&
                response !== ''
              ) {
              }
              // let setItemEncryptedStorageUserObj = await EncryptedStorage.setItem(
              //     "user_zoom_session_obj",
              //     JSON.stringify({
              //         zoom_mobile_no: mobile_no,
              //         zoom_meeting_id: response.data.meeting_id.toString(),
              //         zoom_metteing_pass: response.data.metteing_pass.toString(),
              //     })
              // );
              this.setState({ progress: false });
              this.props.navigation.replace('home');

              setTimeout(() => {
                SimpleToast.show(
                  strings['ScheduleLiveAdisaddedsuccessfully?'],
                  SimpleToast.SHORT
                );
              }, 300);
            })
            .catch((error) => {
              this.setState({ progress: false });
              // console.log('createScheduleAd dispatch error: ');
              // console.log(error);
              // Alert.alert(error.message);
            });
        });
      } catch (errorCatch) {
        // Alert.alert(errorCatch.message);
        this.setState({ progress: false });
      }
    } else {
      Alert.alert(
        strings.Alert,
        strings.Atleast1imageisrequired,
        [{ text: strings.ok, style: 'cancel' }],
        { cancelable: true }
      );
    }
  };

  // Get Category API

  getCategories = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(getCategories(authToken))
          .then((response) => {
            // console.log('getBrand Token: ');
            // console.log(authToken);
            // console.log('dispatch response get: ');
            // console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({ category: response.data });
            }

            var categoryListTemp = [];
            var categoryList = this.state.category;

            for (var index = 0; index < categoryList.length; index++) {
              // console.log(categoryList[index].city_name_arabic);

              if (this.state.UniversalLangString === 'English') {
                var tempArray = {
                  category_id: categoryList[index].category_id,
                  category_name: categoryList[index].category_name_arabic,
                };
                categoryListTemp.push(tempArray);
              } else {
                var tempArray = {
                  category_id: categoryList[index].category_id,
                  category_name: categoryList[index].category_name,
                };
                categoryListTemp.push(tempArray);
              }
            }

            this.setState({ category: categoryListTemp });
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

  // Getting Sub-Category

  getSubCategoryFun = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getSubCategories(authToken))
          .then((response) => {
            // console.log('getSubCategory Token: ');
            // console.log(authToken);
            console.log(
              '****************************** Sub Category Response ****************************** : '
            );
            // console.log(response.data);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({
                sub_category: response.data,
                subfilteredArray: response.data,
              });
            } else {
              this.setState({ progress: false });
              // Alert.alert('something went wrong..!!');
            }

            // console.log('this.state.category_id');
            // console.log(this.state.category_id);
            // console.log(typeof this.state.category_id);
            if (
              this.state.category_id &&
              typeof this.state.category_id !== 'undefined'
            ) {
              console.log('if ');

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              let filteredArray = this.state.sub_category.filter((item) => {
                if (this.state.category_id === item.category_id) {
                  // console.log('this.state.category_id');
                  // console.log(this.state.category_id);
                  // console.log('item.category_id');
                  // console.log(item.category_id);
                  // console.log('if');
                  return true;
                } else {
                  // console.log('this.state.category_id');
                  // console.log(this.state.category_id);
                  // console.log('item.category_id');
                  // console.log(item.category_id);
                  // console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                          console.log(this.state.subCategorieList); */

              // console.log('if filteredArray: ');
              // console.log(filteredArray);

              this.setState({ subfilteredArray: filteredArray });
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              // console.log('else filteredArray: ');
              // console.log(filteredArray);

              this.setState({ subfilteredArray: filteredArray });
              this.setState({});
            }

            var subCategorieListTemp = [];
            var subCategorieList = this.state.subfilteredArray;

            for (var index = 0; index < subCategorieList.length; index++) {
              console.log(subCategorieList[index].city_name_arabic);

              if (this.state.UniversalLangString === 'English') {
                var tempArray = {
                  sub_category_id: subCategorieList[index].sub_category_id,
                  sub_category_name:
                    subCategorieList[index].sub_category_name_arabic,
                  sub_category_year_applies:
                    subCategorieList[index].sub_category_year_applies,
                };
                subCategorieListTemp.push(tempArray);
              } else {
                var tempArray = {
                  sub_category_id: subCategorieList[index].sub_category_id,
                  sub_category_name: subCategorieList[index].sub_category_name,
                  sub_category_year_applies:
                    subCategorieList[index].sub_category_year_applies,
                };
                subCategorieListTemp.push(tempArray);
              }
            }

            this.setState({ subfilteredArray: subCategorieListTemp });
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

  // Getting YEAR API

  getYearFun = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getYearAction(authToken))
          .then((response) => {
            // console.log('getSubCategory Token: ');
            // console.log(authToken);
            // console.log('dispatch response getSubCategory: ');
            // console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({
                year: response.data,
                yearfilteredArray: response.data,
              });
            } else {
              this.setState({ progress: false });
              // Alert.alert('something went wrong..!!');
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

  // Getting Brand API

  getBrandsFun = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getBrands(authToken))
          .then((response) => {
            // console.log('getBrand Token: ');
            // console.log(authToken);
            // console.log('dispatch response getBrand: ');
            // console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({
                brand: response.data,
                brandfilteredArray: response.data,
              });
            }
            if (
              this.state.sub_category_id &&
              typeof this.state.sub_category_id !== 'undefined'
            ) {
              // console.log('if ');

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              let filteredArray = this.state.brand.filter((item) => {
                if (this.state.sub_category_id === item.sub_category_id) {
                  // console.log('this.state.sub_category_id');
                  // console.log(this.state.sub_category_id);
                  // console.log('item.sub_category_id');
                  // console.log(item.sub_category_id);
                  // console.log('if');
                  return true;
                } else {
                  // console.log('this.state.sub_category_id');
                  // console.log(this.state.sub_category_id);
                  // console.log('item.sub_category_id');
                  // console.log(item.sub_category_id);
                  // console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                          console.log(this.state.subCategorieList); */

              // console.log('if filteredArray: ');
              // console.log(filteredArray);

              this.setState({ brandfilteredArray: filteredArray });
              this.setState({});
            } else {
              // console.log('else ');

              let filteredArray = [];
              // console.log('else filteredArray: ');
              // console.log(filteredArray);

              this.setState({ brandfilteredArray: filteredArray });
              this.setState({});
            }

            var brandListTemp = [];
            var brandList = this.state.brandfilteredArray;

            for (var index = 0; index < brandList.length; index++) {
              console.log(brandList[index].city_name_arabic);

              if (this.state.UniversalLangString === 'English') {
                var tempArray = {
                  brand_id: brandList[index].brand_id,
                  brand_name: brandList[index].brand_name_arabic,
                };
                brandListTemp.push(tempArray);
              } else {
                var tempArray = {
                  brand_id: brandList[index].brand_id,
                  brand_name: brandList[index].brand_name,
                };
                brandListTemp.push(tempArray);
              }
            }

            this.setState({ brandfilteredArray: brandListTemp });
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

  // Getting Model API

  getModelFun = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getModelAction(authToken))
          .then((response) => {
            // console.log('getBrand Token: ');
            // console.log(authToken);
            // console.log('dispatch response getBrand: ');
            // console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({
                model: response.data,
                modelfilteredArray: response.data,
              });
            }

            if (
              this.state.brand_id &&
              typeof this.state.brand_id !== 'undefined'
            ) {
              // console.log('if ');

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              var modelListTemp = [];
              var modelList = this.state.model;

              for (var index = 0; index < modelList.length; index++) {
                console.log(modelList[index].model_name_arabic);

                if (this.state.UniversalLangString === 'English') {
                  var tempArray = {
                    model_id: modelList[index].model_id,
                    model_name: modelList[index].model_name_arabic,
                    brand_id: modelList[index].brand_id,
                  };
                  modelListTemp.push(tempArray);
                } else {
                  var tempArray = {
                    model_id: modelList[index].model_id,
                    model_name: modelList[index].model_name,
                    brand_id: modelList[index].brand_id,
                  };
                  modelListTemp.push(tempArray);
                }
              }

              this.setState({ model: modelListTemp });

              let filteredArray = this.state.model.filter((item) => {
                if (this.state.brand_id === item.brand_id) {
                  // console.log('this.state.brand_id');
                  // console.log(this.state.brand_id);
                  // console.log('item.brand_id');
                  // console.log(item.brand_id);
                  // console.log('if');
                  return true;
                } else {
                  // console.log('this.state.brand_id');
                  // console.log(this.state.brand_id);
                  // console.log('item.brand_id');
                  // console.log(item.brand_id);
                  // console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                          console.log(this.state.subCategorieList); */

              // console.log('if filteredArray: ');
              // console.log(filteredArray);

              this.setState({ modelfilteredArray: filteredArray });
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              // console.log('else filteredArray: ');
              // console.log(filteredArray);

              this.setState({ modelfilteredArray: filteredArray });
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

  createScheduleAd = async () => {
    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      await Keychain.getGenericPassword().then((credentials) => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        var customer_id = sessionData.user_id;

        console.log('customer_id');
        console.log(customer_id);

        // title, description, keywords, category_id, sub_category_id,
        //     starting_price, video, product_img, auction_type, start_date_time, end_date_time,
        //     brand_id, model_id, city_id, country_id, refund, refund_days, zoom_link,
        //     year_id

        dispatch(
          addScheduleAd(
            authToken,
            this.state.title,
            this.state.description,
            this.state.keywords,
            this.state.category_id,
            this.state.sub_category_id,
            this.state.starting_price,
            this.state.video,
            this.state.product_img1,
            this.state.product_img2,
            this.state.product_img3,
            this.state.brand_id,
            this.state.model_id,
            this.state.country_id,
            this.state.city_id
          )
        )
          .then((response) => {
            console.log('getBrand Token: ');
            console.log(authToken);
            console.log('dispatch response getBrand: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({ progress: false });
              this.setState({ model: response.data });
            }

            // AsyncStorage.setItem('zoom_customer_id', customer_id);
            // AsyncStorage.setItem('zoom_meeting_id', response.data.meeting_id.toString());
            // AsyncStorage.setItem('zoom_metteing_pass', response.data.metteing_pass.toString());

            // let setItemEncryptedStorageUserObj = await EncryptedStorage.setItem(
            //     "user_zoom_session_obj",
            //     JSON.stringify({
            //         zoom_mobile_no: mobile_no,
            //         zoom_meeting_id: response.data.meeting_id.toString(),
            //         zoom_metteing_pass: response.data.metteing_pass.toString()
            //     })
            // );

            console.log('response.user_id');
            console.log(customer_id);
            console.log('response.data.meeting_id');
            console.log(response.data.meeting_id);
            console.log('response.data.metteing_pass');
            console.log(response.data.metteing_pass);
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

  componentDidMount() {
    try {
      AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
        console.log(
          '*********************************** Home Screen Component ***********************************'
        );
        console.log(value);
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

    console.log('Getting Data:');
    this.getCategories();
    this.getCountryFun();
    this.getCityFun();
    this.getSubCategoryFun();
    this.getYearFun();
    this.getBrandsFun();
    this.getModelFun();
  }

  render() {
    return (
      <ScrollView>
        <Dialog visible={this.state.progress}>
          <DialogContent style={{ width: '80%' }}>
            <Progress />
          </DialogContent>
        </Dialog>

        <RBSheet
          closeDuration={250}
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={200}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              borderTopStartRadius: 10,
              borderTopEndRadius: 10,
            },
          }}
        >
          {/* Open Camera  */}

          <TouchableOpacity
            onPress={this.launchVideoCamera}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.photo_camera}
            />
          </TouchableOpacity>

          {/* Open Gallery */}

          <TouchableOpacity
            onPress={this.launchVideoGallery}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        {/* Camera 1 Bottom */}

        <RBSheet
          closeDuration={250}
          ref={(ref) => {
            this.RBSheet1 = ref;
          }}
          height={200}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              borderTopStartRadius: 10,
              borderTopEndRadius: 10,
            },
          }}
        >
          {/* Open Camera  */}

          <TouchableOpacity
            onPress={this.launchImageCamera1}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.photo_camera}
            />
          </TouchableOpacity>

          {/* Open Gallery */}

          <TouchableOpacity
            onPress={this.launchImageGallery1}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        {/* Camera 2 Bottom */}

        <RBSheet
          closeDuration={250}
          ref={(ref) => {
            this.RBSheet2 = ref;
          }}
          height={200}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              borderTopStartRadius: 10,
              borderTopEndRadius: 10,
            },
          }}
        >
          {/* Open Camera  */}

          <TouchableOpacity
            onPress={this.launchImageCamera2}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.photo_camera}
            />
          </TouchableOpacity>

          {/* Open Gallery */}

          <TouchableOpacity
            onPress={this.launchImageGallery2}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        {/* Camera 3 Bottom */}

        <RBSheet
          closeDuration={250}
          ref={(ref) => {
            this.RBSheet3 = ref;
          }}
          height={200}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              borderTopStartRadius: 10,
              borderTopEndRadius: 10,
            },
          }}
        >
          {/* Open Camera  */}

          <TouchableOpacity
            onPress={this.launchImageCamera3}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.photo_camera}
            />
          </TouchableOpacity>

          {/* Open Gallery */}

          <TouchableOpacity
            onPress={this.launchImageGallery3}
            style={{
              alignSelf: 'center',
              elevation: 10,
              borderRadius: 5,
              justifyContent: 'center',
              height: 100,
              alignItems: 'center',
              width: 100,
              backgroundColor: '#F5F5F5',
              //   marginTop: 20,
            }}
          >
            <Image
              style={{ resizeMode: 'contain', width: 75, tintColor: '#505B98' }}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        <View style={{ backgroundColor: 'white', flex: 1, marginBottom: 20 }}>
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

          {/* Add Videos */}

          <View
            style={{
              marginHorizontal: 20,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              //   onPress={this.launchVideoCamera}
              onPress={() => this.RBSheet.open()}
              style={{
                alignSelf: 'center',
                elevation: 10,
                borderRadius: 40,
                justifyContent: 'center',
                height: 240,
                alignItems: 'center',
                width: '100%',
                backgroundColor: '#F5F5F5',
              }}
            >
              {(() => {
                if (this.state.videoUri !== '') {
                  console.log('this.state.videoUri');
                  console.log(this.state.videoUri);
                  return (
                    <Video
                      style={{ height: 170, width: '90%', borderRadius: 4 }}
                      source={{ uri: this.state.videoUri }}
                    />
                  );
                } else if (this.state.videoUri === '') {
                  return (
                    <Image
                      style={{ height: 100, width: 100 }}
                      source={images.createAd}
                      // source={{ uri: this.state.videoUri }}
                    />
                  );
                }
              })()}

              {/* <Image style={{ height: 100, width: 100, tintColor: '#BCBDCF' }}
                                source={images.createAd}
                            /> */}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Cairo-Bold',
                  color: '#BCBDCF',
                  marginTop: 10,
                }}
              >
                {strings.AddProductVideo}
              </Text>
            </TouchableOpacity>

            {this.isFieldInError('video') &&
              this.getErrorsInField('video').map((errorMessage) =>
                // <Text style={styles.error_text}>Please upload a video of the product</Text>

                Alert.alert(
                  'Alert',
                  'Please upload a video of the product',
                  [{ text: 'OK', style: 'destructive' }],
                  { cancelable: false }
                )
              )}

            {/* Add Images */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                // onPress={this.launchImageCamera1}
                onPress={() => this.RBSheet1.open()}
                style={{
                  alignSelf: 'center',
                  elevation: 10,
                  borderRadius: 5,
                  justifyContent: 'center',
                  height: 100,
                  alignItems: 'center',
                  width: 100,
                  backgroundColor: '#F5F5F5',
                  marginTop: 20,
                }}
              >
                {(() => {
                  if (this.state.product_img1Uri) {
                    console.log('this.state.product_img1Uri');
                    console.log(this.state.product_img1Uri);
                    return (
                      <Image
                        style={{ height: 60, width: 90, borderRadius: 3 }}
                        // source={images.createAd}
                        source={{ uri: this.state.product_img1Uri }}
                      />
                    );
                  } else {
                    return (
                      <Image
                        style={{ height: 50, width: 50 }}
                        source={images.createAd}
                        // source={{ uri: this.state.product_img1Uri }}
                      />
                    );
                  }
                })()}

                {/* <Image style={{ height: 50, width: 50, }}
                                        // source={images.createAd}
                                        source={{ uri: this.state.product_img1Uri }}
                                    /> */}
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Cairo-Bold',
                    color: '#BCBDCF',
                    marginTop: 5,
                  }}
                >
                  {strings.addImage}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={this.launchImageCamera2}
                onPress={() => this.RBSheet2.open()}
                style={{
                  alignSelf: 'center',
                  elevation: 10,
                  borderRadius: 5,
                  justifyContent: 'center',
                  height: 100,
                  alignItems: 'center',
                  width: 100,
                  backgroundColor: '#F5F5F5',
                  marginTop: 20,
                }}
              >
                {(() => {
                  if (this.state.product_img2Uri) {
                    console.log('this.state.product_img2Uri');
                    console.log(this.state.product_img2Uri);
                    return (
                      <Image
                        style={{ height: 60, width: 90, borderRadius: 3 }}
                        // source={images.createAd}
                        source={{ uri: this.state.product_img2Uri }}
                      />
                    );
                  } else {
                    return (
                      <Image
                        style={{ height: 50, width: 50 }}
                        source={images.createAd}
                        // source={{ uri: this.state.product_img1Uri }}
                      />
                    );
                  }
                })()}

                {/* <Image style={{ height: 50, width: 50, }}
                                        source={images.createAd}
                                    /> */}
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Cairo-Bold',
                    color: '#BCBDCF',
                    marginTop: 5,
                  }}
                >
                  {strings.addImage}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={this.launchImageCamera3}
                onPress={() => this.RBSheet3.open()}
                style={{
                  alignSelf: 'center',
                  elevation: 10,
                  borderRadius: 5,
                  justifyContent: 'center',
                  height: 100,
                  alignItems: 'center',
                  width: 100,
                  backgroundColor: '#F5F5F5',
                  marginTop: 20,
                }}
              >
                {(() => {
                  if (this.state.product_img3Uri) {
                    console.log('this.state.product_img3Uri');
                    console.log(this.state.product_img3Uri);
                    return (
                      <Image
                        style={{ height: 60, width: 90, borderRadius: 3 }}
                        // source={images.createAd}
                        source={{ uri: this.state.product_img3Uri }}
                      />
                    );
                  } else {
                    return (
                      <Image
                        style={{ height: 50, width: 50 }}
                        source={images.createAd}
                        // source={{ uri: this.state.product_img1Uri }}
                      />
                    );
                  }
                })()}

                {/* <Image style={{ height: 50, width: 50, tintColor: '#BCBDCF' }}
                                    source={images.createAd}
                                /> */}
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Cairo-Bold',
                    color: '#BCBDCF',
                    marginTop: 5,
                  }}
                >
                  {strings.addImage}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Product Details */}

          <View>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 50,
                elevation: 10,
                marginHorizontal: 5,
                paddingHorizontal: 20,
                paddingVertical: 15,
                flex: 1,
              }}
            >
              {/* Title Input  */}

              <View style={styles.textInputView}>
                <TextInput
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

              {/* Name Input */}

              {/* <View style={styles.textInputView}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Name"
                                />
                            </View> */}

              {/* Dropdown */}

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
                    this.getErrorsInField('country_id').map((errorMessage) => (
                      <Text style={styles.error_text}>
                        {strings.CountryisRequired}
                      </Text>
                    ))}
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

              {/* Dropdown */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
              >
                {/* Category Dropdown */}
                <View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={strings.category}
                    data={this.state.category}
                    labelField="category_name"
                    valueField="category_id"
                    value={this.state.category_id}
                    onChange={this.category_fun}
                    containerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    maxHeight={150}
                    iconColor="#2D2C71"
                    activeColor="trasnparent"
                  />

                  {this.isFieldInError('category_id') &&
                    this.getErrorsInField('category_id').map((errorMessage) => (
                      <Text style={styles.error_text}>
                        {strings.CategoryisRequired}
                      </Text>
                    ))}
                </View>

                <View>
                  {/* Sub Category Dropdown */}

                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={strings.subCategory}
                    data={this.state.subfilteredArray}
                    labelField="sub_category_name"
                    valueField="sub_category_id"
                    value={this.state.sub_category_id}
                    onChange={this.sub_category_fun}
                    containerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    maxHeight={150}
                    iconColor="#2D2C71"
                    activeColor="trasnparent"
                  />

                  {this.isFieldInError('sub_category_id') &&
                    this.getErrorsInField('sub_category_id').map(
                      (errorMessage) => (
                        <Text style={[styles.error_text, { width: 150 }]}>
                          {strings['Sub-Categoryfieldisrequired']}
                        </Text>
                      )
                    )}
                </View>
              </View>

              {/* Dropdown */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
              >
                {/* Brand Dropdown */}
                <View>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={strings.brand}
                    data={this.state.brandfilteredArray}
                    labelField="brand_name"
                    valueField="brand_id"
                    value={this.state.brand_id}
                    onChange={this.brand_fun}
                    containerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    maxHeight={150}
                    iconColor="#2D2C71"
                    activeColor="trasnparent"
                  />

                  {this.isFieldInError('brand_id') &&
                    this.getErrorsInField('brand_id').map((errorMessage) => (
                      <Text style={styles.error_text}>
                        {strings.Brandisrequired}
                      </Text>
                    ))}
                </View>

                <View>
                  {/* Model Dropdown */}

                  <Dropdown
                    style={styles.dropdown}
                    ref="model_id"
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    placeholder={strings.model}
                    data={this.state.modelfilteredArray}
                    labelField="model_name"
                    valueField="model_id"
                    value={this.state.model_id}
                    onChange={this.model_fun}
                    containerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    maxHeight={100}
                    iconColor="#2D2C71"
                    activeColor="trasnparent"
                  />
                  {this.isFieldInError('model_id') &&
                    this.getErrorsInField('model_id').map((errorMessage) => (
                      <Text style={styles.error_text}>
                        {strings.ModelisRequired}
                      </Text>
                    ))}
                </View>
              </View>

              {/* Year Dropdown */}

              <View style={{ marginTop: 10, marginBottom: 15 }}>
                {(() => {
                  if (this.state.isYear) {
                    return (
                      <View>
                        <Dropdown
                          style={styles.dropdown}
                          ref="year_id"
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          containerStyle={styles.container}
                          placeholder={strings.year}
                          data={this.state.year}
                          labelField="year"
                          valueField="year_id"
                          value={this.state.year_id}
                          onChange={this.year_fun}
                          showsVerticalScrollIndicator={false}
                          maxHeight={150}
                          iconColor="#2D2C71"
                          activeColor="trasnparent"
                        />
                        {this.isFieldInError('year_id') &&
                          this.getErrorsInField('year_id').map(
                            (errorMessage) => (
                              <Text style={styles.error_text}>
                                {strings.thefieldyearisrequired}
                              </Text>
                            )
                          )}
                      </View>
                    );
                  }
                })()}
              </View>

              {/* <View style={{
                                flexDirection: "row", justifyContent: 'space-between',
                                marginTop: 10, alignSelf: 'center'
                            }}> */}

              {/* Starting Price Input */}

              {/* <View style={styles.textInputView}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Starting Price"
                                        keyboardType="number-pad"
                                    />
                                </View> */}

              {/* <View style={{ width: 25 }} /> */}

              {/* </View> */}

              {/* Select Start Date Time */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    width: 160,
                    borderRadius: 80,
                    borderWidth: 1,
                    alignSelf: 'center',
                    borderColor: '#2D2C71',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onOpenStartDate}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-around',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Cairo-SemiBold',
                        }}
                      >
                        {this.state.start_date_time.toLocaleDateString()}
                      </Text>
                      {/* <Text style={{ textAlign: 'center' }}>
                                                {this.state.start_date_time.toLocaleTimeString()}
                                            </Text> */}
                    </View>
                    <Image
                      style={{ height: 20, width: 20 }}
                      source={images.calendar}
                    />
                  </View>
                  <DatePicker
                    modal
                    open={this.state.openStartDate}
                    mode={'date'}
                    date={this.state.start_date_time}
                    onConfirm={(date) => {
                      this.setState({
                        start_date_time: date,
                        openStartDate: false,
                      });
                      console.log(date.getDate());
                      console.log(
                        date.toISOString().replace('T', ' ').substring(0, 19)
                      );
                      console.log(
                        this.state.start_date_time
                          .toISOString()
                          .replace('T', ' ')
                          .substring(0, 19)
                      );
                    }}
                    onCancel={() => {
                      this.setState({ openStartDate: false });
                    }}
                    title={strings.SelectStartDate}
                    androidVariant="iosClone"
                    minimumDate={new Date()}
                    cancelText={strings.Cancel}
                    confirmText={strings.Confirm}
                  />
                </TouchableOpacity>

                {/* Time */}

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    width: 160,
                    borderRadius: 80,
                    borderWidth: 1,
                    alignSelf: 'center',
                    borderColor: '#2D2C71',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onOpenStartTime}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-around',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: 'Cairo-SemiBold',
                        }}
                      >
                        {this.state.start_time.toLocaleTimeString()}
                      </Text>
                      {/* <Text style={{ textAlign: 'center' }}>
                                                {this.state.end_time.toLocaleTimeString()}
                                            </Text> */}
                    </View>
                    <Image
                      style={{ height: 22, width: 22 }}
                      source={images.start_time}
                    />
                  </View>
                  <DatePicker
                    modal
                    open={this.state.startTime}
                    mode={'time'}
                    date={this.state.start_time}
                    onConfirm={(time) => {
                      this.setState(
                        { start_time: time, end_time: time, startTime: false },
                        () => {
                          
                          var dateCurrent = time;

                          var start_time_utc = moment(dateCurrent);

                          var final_start_time =
                            start_time_utc.format('HH:mm:ss');

                          var start_date_time_temp = moment(
                            this.state.start_date_time
                          ).format('YYYY-MM-DD');
                          if (
                            start_date_time_temp ===
                            moment().format('YYYY-MM-DD')
                          ) {
                            if (
                              final_start_time < moment().format('HH:mm:ss')
                            ) {
                              Alert.alert(
                                strings.Alert,
                                strings.selectValidTime,
                                [{ text: strings.ok, style: 'cancel' }],
                                { cancelable: true }
                              );
                              this.setState({ start_time: new Date() });
                            }
                          }
                        }
                      );
                    }}
                    onCancel={() => {
                      this.setState({ startTime: false });
                    }}
                    title={strings.SelectStartTime}
                    androidVariant="iosClone"
                    cancelText={strings.Cancel}
                    confirmText={strings.Confirm}
                    // minimumDate={new Date()}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }} />

              {/* Select End Date Time */}

              {/* <View
                                style={{
                                    flexDirection: 'row', justifyContent: 'space-between',

                                }}
                            >
                                 

                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row', width: 160,
                                        borderRadius: 80, borderWidth: 1, alignSelf: 'center',
                                        borderColor: '#2D2C71', height: 50,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}
                                    onPress={this.onOpenEndDate}
                                >
                                    <View style={{
                                        flex: 1, justifyContent: 'space-around', flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <View>
                                            <Text style={{ textAlign: 'center' }}>
                                                {this.state.end_date_time.toLocaleDateString()}
                                            </Text>
                                            
                                        </View>
                                        <Image
                                            style={{ height: 20, width: 20, }}
                                            source={images.calendar}
                                        />
                                    </View>
                                    <DatePicker
                                        modal
                                        open={this.state.openEndDate}
                                        mode={'date'}
                                        date={this.state.end_date_time}
                                        onConfirm={(date) => {
                                            this.setState({ end_date_time: date, openEndDate: false })
                                            console.log(date.toISOString().replace("T", " ").substring(0, 19))
                                            console.log(this.state.end_date_time.toISOString().replace("T", " ").substring(0, 19))
                                        }}
                                        onCancel={() => {
                                            this.setState({ openEndDate: false })
                                        }}
                                        title={"Select End Date"}
                                        androidVariant='iosClone'
                                        minimumDate={new Date()}
                                    />
                                </TouchableOpacity>


                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row', width: 160,
                                        borderRadius: 80, borderWidth: 1, alignSelf: 'center',
                                        borderColor: '#2D2C71', height: 50,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}
                                    onPress={this.onOpenEndTime}
                                >
                                    <View style={{
                                        flex: 1, justifyContent: 'space-around', flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <View>
                                            <Text style={{ textAlign: 'center' }}>
                                                {this.state.end_time.toLocaleTimeString()}
                                            </Text>
                                            
                                        </View>
                                        <Image
                                            style={{ height: 22, width: 22, }}
                                            source={images.start_time}
                                        />
                                    </View>
                                    <DatePicker
                                        modal
                                        open={this.state.endTime}
                                        mode={'time'}
                                        date={this.state.end_time}
                                        onConfirm={(time) => {
                                            this.setState({ end_time: time, endTime: false })
                                            
                                            // console.log(this.setState({ endTime: time.setHours(time.getHours() + 2) }))
                                            console.log(time.toTimeString())
                                            console.log(this.state.end_time.toTimeString())
                                        }}
                                        onCancel={() => {
                                            this.setState({ endTime: false })
                                        }}
                                        title={"Select End Time"}
                                        androidVariant='iosClone'
                                        is24hourSource="device"
                                        minimumDate={new Date()}
                                    />
                                </TouchableOpacity>


                            </View> */}

              {/* Keywords Text Input */}
              <View>
                <View style={styles.textInputView}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={strings.keywords}
                    value={this.state.keywords}
                    ref="keywords"
                    onChangeText={(itemValue) =>
                      this.setState({ keywords: itemValue })
                    }
                  />
                </View>
                {/* {this.isFieldInError('keywords') &&
                  this.getErrorsInField('keywords').map((errorMessage) => (
                    <Text style={styles.error_text}>Keywords is required</Text>
                  ))} */}
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
                  alignItems: 'center',
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
                  onPress={this.onCreatePostValidation}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'Cairo-Bold',
                      color: 'white',
                      textAlignVertical: 'center',
                      textAlign: 'center',
                    }}
                  >
                    {strings.ScheduleLive}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textInputView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    flex: 1,
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
    borderRadius: 30,
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
    width: 160,
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ScheduleLive
);
