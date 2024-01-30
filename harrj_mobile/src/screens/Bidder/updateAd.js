import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  PermissionStatus,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as ImagePicker from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';
import * as RNLocalize from 'react-native-localize';
import {Appbar} from 'react-native-paper';
import {
  PERMISSIONS,
  Permission,
  RESULTS,
  checkMultiple,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Actions} from 'react-native-router-flux';
import SimpleToast from 'react-native-simple-toast';
import Video from 'react-native-video';
import {connect} from 'react-redux';
import {compose} from 'redux';
import ValidationComponent from '../../../ValidationComponent';
import {getCityAction} from '../../actions/addCity.action';
import {getCategories} from '../../actions/bidder/getCategories.action';
import {getBrands} from '../../actions/getBrands.action';
import {getCountryAction} from '../../actions/getCountry.action';
import {getModelAction} from '../../actions/getModel.action';
import {getProductInfo} from '../../actions/getProductInfo.action';
import {getSubCategories} from '../../actions/getSubCategories.action';
import {getYearAction} from '../../actions/getYear.action';
import {
  updateGoliveNowAd,
  updateNormalAd,
  updateScheduleLiveAd,
} from '../../actions/update_ads.action';
import images from '../../assets/images/images';
import Progress from '../../components/Progress/progress';
import strings from '../../translations/translateConstant';

const platformPermissions = {
  ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  ],
};

export class updateAd extends ValidationComponent {
  constructor(props) {
    const labels = {
      title: 'Title',
    };

    AsyncStorage.getItem('UniversalAppLanguage').then(value => {
      // console.log('Sign up language');
      console.log(value);
      if (value === 'ar') {
        labels.title = 'العنوان';
      }
    });

    super({...props, labels});

    this.state = {
      productList: [],
      productInfo: [],
      name: '',
      auction_type: '',
      brand_id: [],
      model_id: [],
      product_id: 0,
      start_date_time: new Date(),
      end_date_time: new Date(),
      start_time: new Date(),
      start_time_res: '',
      end_time: new Date(),
      title: '',
      starting_price: '',
      max_price: '',
      description: '',
      keywords: '',
      video: '',
      videoUri: '',
      product_img1: '',
      product_img1Uri: '',
      product_img2: '',
      product_img2Uri: '',
      product_img3: '',
      product_img3Uri: '',
      categories_list: [],
      country: [],
      category: [],
      sub_category: [],
      city: [],
      year: [],
      brand: [],
      country_Id: '',
      city_Id: '',
      modal_Id: '',
      brand_Id: '',
      category_Id: '',
      sub_category_Id: '',
      year_Id: 0,
      bidCount: 0,

      bid_id: 0,
      isYear: false,
      openStartDate: false,
      openEndDate: false,
      startTime: false,
      endTime: false,
      progress_ind: false,
      startDate: new Date(),
    };
    this.getProductList = this.getProductList.bind(this);
  }

  componentDidMount() {
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
      },
    );

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
        console.log(value);
        if (value != null) {
          console.log('componentDidmount if');
          console.log(value);
          strings.setLanguage(value);
          if (value === 'en') {
            this.setState({UniversalLangString: 'Arabic', selectedLan: true});
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

    // Get Product ID

    var get_product_id = this.props.navigation.getParam('product_id');
    var get_auction_type = this.props.navigation.getParam('auction_type');
    this.setState(
      {product_id: get_product_id, auction_type: get_auction_type},
      () => {},
    );

    this.getProductList();
  }

  // Create Ad button Validation

  onCreatePostValidation = () => {
    this.validate({
      video: {required: false},
      title: {required: true, maxlength: 50},
      country_Id: {required: true},
      city_Id: {required: true},
      category_Id: {required: true},
      sub_category_Id: {required: true},
      brand_Id: {required: true},
      model_Id: {required: true},
      year_Id: {required: false},
      starting_price: {required: false},
      description: {required: true},
    });
    console.log('if Validation');

    if (this.getErrorMessages()) {
    } else {
      this.updateFun();
    }
  };

  updateFun = () => {
    this.state.auction_type == 'offline' ? this.onUpdateNormalPost() : null;
    this.state.auction_type == 'online' ? this.onUpdateOnlinePost() : null;
    this.state.auction_type == 'golivenow'
      ? this.onUpdateGoliveNowPost()
      : null;
  };

  // Update Normal Ad button

  onUpdateNormalPost = async () => {
    if (
      this.state.product_img1Uri !== '' ||
      this.state.product_img2Uri !== '' ||
      this.state.product_img3Uri !== ''
    ) {
      try {
        const {dispatch} = this.props;
        const {navigation} = this.props.navigation;
        this.setState({progress_ind: true});

        await Keychain.getGenericPassword().then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          console.log(this.state.year_Id);
          var authToken = sessionData.token;
          var customer_id = sessionData.user_id;
          dispatch(
            updateNormalAd(
              authToken,
              customer_id,
              this.state.product_id,
              this.state.title,
              this.state.description,
              this.state.keywords,
              this.state.category_Id,
              this.state.sub_category_Id,
              this.state.starting_price,
              this.state.video,
              this.state.product_img1,
              this.state.product_img2,
              this.state.product_img3,
              this.state.brand_Id,
              this.state.modal_Id,
              this.state.city_Id,
              this.state.country_Id,
              this.state.year_Id,
            ),
          )
            .then(response => {
              this.setState({product_id: 0});
              this.setState({progress_ind: false});

              if (
                response &&
                typeof response !== 'undefined' &&
                response !== ''
              ) {
                this.setState({progress_ind: false});
                this.setState({model: response.data});
                SimpleToast.show(strings.successful, SimpleToast.SHORT);
                setTimeout(() => {
                  Actions.pop();
                }, 600);
              }
            })
            .catch(error => {
              this.setState({progress_ind: false});
            });
        });
      } catch (errorCatch) {
        this.setState({progress_ind: false});
      }
    } else {
      this.setState({progress_ind: false});
      Alert.alert(
        strings.Alert,
        strings.Atleast1imageisrequired,
        [{text: strings.ok, style: 'cancel'}],
        {cancelable: true},
      );
    }
  };

  // Update Online Ad button

  onUpdateOnlinePost = async () => {
    if (
      this.state.product_img1Uri !== '' ||
      this.state.product_img2Uri !== '' ||
      this.state.product_img3Uri !== ''
    ) {
      try {
        const {dispatch} = this.props;
        const {navigation} = this.props.navigation;
        this.setState({progress_ind: true});

        await Keychain.getGenericPassword().then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          var authToken = sessionData.token;
          var customer_id = sessionData.user_id;
          dispatch(
            updateScheduleLiveAd(
              authToken,
              customer_id,
              this.state.product_id,
              this.state.title,
              this.state.description,
              this.state.keywords,
              this.state.category_Id,
              this.state.sub_category_Id,
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
              this.state.brand_Id,
              this.state.modal_Id,
              this.state.city_Id,
              this.state.country_Id,
              this.state.start_time,
              this.state.end_time,
              this.state.year_Id,
            ),
          )
            .then(response => {
              this.setState({product_id: 0});
              this.setState({progress_ind: false});

              if (
                response &&
                typeof response !== 'undefined' &&
                response !== ''
              ) {
                this.setState({progress_ind: false});
                this.setState({model: response.data});
                SimpleToast.show(strings.successful, SimpleToast.SHORT);
                setTimeout(() => {
                  Actions.pop();
                }, 600);
              }
            })
            .catch(error => {
              this.setState({progress_ind: false});
              console.log('update online Ad  dispatch error: ');
              console.log(error);
            });
        });
      } catch (errorCatch) {
        console.log(errorCatch);
        this.setState({progress_ind: false});
      }
    } else {
      this.setState({progress_ind: false});
      Alert.alert(
        strings.Alert,
        strings.Atleast1imageisrequired,
        [{text: strings.ok, style: 'cancel'}],
        {cancelable: true},
      );
    }
  };

  // Update Go Live Now Ad button

  onUpdateGoliveNowPost = async () => {
    try {
      const {dispatch} = this.props;
      const {navigation} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        var customer_id = sessionData.user_id;
        dispatch(
          updateGoliveNowAd(
            authToken,
            customer_id,
            this.state.product_id,
            this.state.title,
            this.state.description,
            this.state.keywords,
            this.state.city_Id,
            this.state.country_Id,
          ),
        )
          .then(response => {
            console.log('update goLiveNow Ad Token: ');
            console.log(authToken);
            console.log('dispatch response update goLiveNow Ad : ');
            console.log(response);
            console.log(this.state.product_id);
            this.setState({product_id: 0});

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({model: response.data});
              SimpleToast.show(strings.successful, SimpleToast.SHORT);
              setTimeout(() => {
                Actions.pop();
              }, 600);
            }
          })
          .catch(error => {
            this.setState({progress: false});
            console.log('update goLiveNow Ad  dispatch error: ');
            console.log(error);
          });
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  getProductList = async () => {
    try {
      const {dispatch} = this.props;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(getProductInfo(authToken, this.state.product_id))
          .then(response => {
            console.log('dispatch response getProductInfo: ');
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({productInfo: response.data});
              if (
                response.data[0].year_id &&
                typeof response.data[0].year_id !== 'undefined' &&
                response.data[0].year_id !== ''
              ) {
                this.setState({
                  year_Id: response.data[0].year_id,
                  isYear: true,
                });
              }
              var res = response.data;
              var getTimeZone = RNLocalize.getTimeZone();
              var start_date_time = res[0].start_date_time;
              var start_time = res[0].start_time;

              // change utc to timezone time

              var utc_startdateTime =
                start_date_time + 'T' + start_time + '.000Z';
              var startTime_moment = moment(utc_startdateTime);
              var start_time_temp = startTime_moment.tz(getTimeZone);

              var final_start_time = start_time_temp.format('hh:mm:ss');

              this.setState({start_time_res: final_start_time});
              this.setState({
                startDate: new Date('' + response.data[0].start_date_time + ''),
              });

              this.setState({title: response.data[0].title});
              this.setState({country_Id: response.data[0].country_id});
              this.setState({city_Id: response.data[0].city_id});
              this.setState({category_Id: response.data[0].category_id});
              this.setState({
                sub_category_Id: response.data[0].sub_category_id,
              });
              this.setState({brand_Id: response.data[0].brand_id});
              this.setState({modal_Id: response.data[0].model_id});

              this.setState({max_price: response.data[0].max_price});
              this.setState({
                starting_price: '' + response.data[0].starting_price,
              });
              this.setState({description: response.data[0].description});
              this.setState({keywords: response.data[0].keywords});
              this.setState({videoUri: response.data[0].video});
              this.setState({
                product_img1Uri:
                  response.data[0].product_img_list[0].product_img,
              });
              this.setState({
                product_img2Uri:
                  response.data[0].product_img_list[1].product_img,
              });
              this.setState({
                product_img3Uri:
                  response.data[0].product_img_list[2].product_img,
              });
            } else {
              this.setState({progress: false});
            }
          })
          .catch(error => {});
      });
    } catch (errorCatch) {}
    this.getCategories();
    this.getCountryFun();
    this.getCityFun();
    this.getSubCategoryFun();
    this.getYearFun();
    this.getBrandsFun();
    this.getModelFun();
  };

  // Get Category API

  getCategories = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(getCategories(authToken))
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({category: response.data});
            }

            var categoryListTemp = [];
            var categoryList = this.state.category;

            for (var index = 0; index < categoryList.length; index++) {
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

            this.setState({category: categoryListTemp});
          })
          .catch(error => {
            this.setState({progress: false});
          });
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  // Get Country API

  getCountryFun = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(getCountryAction(authToken))
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({country: response.data});
            }

            var countryListTemp = [];
            var countryList = response.data;

            for (var index = 0; index < countryList.length; index++) {
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
            this.setState({country: countryListTemp});
          })
          .catch(error => {
            this.setState({progress: false});
          });
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  // Get City API

  getCityFun = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(getCityAction(authToken))
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({city: response.data});
            }
            if (
              this.state.country_Id &&
              typeof this.state.country_Id !== 'undefined'
            ) {
              console.log('if ');

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

              this.setState({city: cityListTemp});

              let filteredArray = this.state.city.filter(item => {
                if (this.state.country_Id === item.country_id) {
                  return true;
                } else {
                  return false;
                }
              });

              this.setState({cityfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];

              this.setState({cityfilteredArray: filteredArray});
              this.setState({});
            }
          })
          .catch(error => {
            this.setState({progress: false});
          });
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  // Getting Sub-Category

  getSubCategoryFun = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getSubCategories(authToken))
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({
                sub_category: response.data,
                subfilteredArray: response.data,
              });
            } else {
              this.setState({progress: false});
            }

            if (
              this.state.category_Id &&
              typeof this.state.category_Id !== 'undefined'
            ) {
              console.log('if ');

              let filteredArray = this.state.sub_category.filter(item => {
                if (this.state.category_Id === item.category_id) {
                  return true;
                } else {
                  return false;
                }
              });

              this.setState({subfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];

              this.setState({subfilteredArray: filteredArray});
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

            this.setState({subfilteredArray: subCategorieListTemp});
          })
          .catch(error => {
            this.setState({progress: false});
          });
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  // Getting YEAR API

  getYearFun = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getYearAction(authToken))
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({year: response.data});
            } else {
              this.setState({progress: false});
            }
          })
          .catch(error => {
            this.setState({progress: false});
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  // Getting Brand API

  getBrandsFun = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getBrands(authToken))
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({
                brand: response.data,
                brandfilteredArray: response.data,
              });
            }
            if (
              this.state.sub_category_Id &&
              typeof this.state.sub_category_Id !== 'undefined'
            ) {
              let filteredArray = this.state.brand.filter(item => {
                if (this.state.sub_category_Id === item.sub_category_id) {
                  return true;
                } else {
                  return false;
                }
              });

              this.setState({brandfilteredArray: filteredArray});
              this.setState({});
            } else {
              let filteredArray = [];

              this.setState({brandfilteredArray: filteredArray});
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

            this.setState({brandfilteredArray: brandListTemp});
          })

          .catch(error => {
            this.setState({progress: false});
          });
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  // Getting Model API

  getModelFun = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        dispatch(getModelAction(authToken))
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({
                model: response.data,
                modelfilteredArray: response.data,
              });
            }

            if (
              this.state.brand_Id &&
              typeof this.state.brand_Id !== 'undefined'
            ) {
              console.log('if ');

              var modelListTemp = [];
              var modelList = this.state.model;

              for (var index = 0; index < modelList.length; index++) {
                // console.log(modelList[index].model_name_arabic);

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

              this.setState({model: modelListTemp});

              let filteredArray = this.state.model.filter(item => {
                if (this.state.brand_Id === item.brand_id) {
                  return true;
                } else {
                  return false;
                }
              });

              this.setState({modelfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              console.log('else filteredArray: ');

              this.setState({modelfilteredArray: filteredArray});
              this.setState({});
            }
          })
          .catch(error => {
            this.setState({progress: false});
          });
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  gotoZoom = async (meeting_id, meeting_password, auction_type, product_id) => {
    if (auction_type === 'offline') {
      console.log(auction_type);
      return null;
    } else {
      await Keychain.getGenericPassword().then(async credentials => {
        var sessionData = JSON.parse(credentials.password);
        var mobile_no = sessionData.user_mobile_id;
        let setItemEncryptedStorageUserObj = await EncryptedStorage.setItem(
          'user_zoom_session_obj',
          JSON.stringify({
            zoom_mobile_no: mobile_no,
            zoom_meeting_id: meeting_id.toString(),
            zoom_metteing_pass: meeting_password.toString(),
            zoom_user_type: 'auctioneer',
            zoom_user_role: 1,
            zoom_product_id: product_id.toString(),
          }),
        );
      });
      console.log(auction_type);
      this.props.navigation.navigate('zoom_example_confirm');
    }
  };

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
      async response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled video picker');
          this.setState({isVisible: false});
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          this.setState({isVisible: false});
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
          this.setState({isVisible: false});
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
      },
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
      async response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled video picker');
          this.setState({isVisible: false});
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          this.setState({isVisible: false});
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
          this.setState({isVisible: false});
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
      },
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
    ImagePicker.launchImageLibrary(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({isVisible: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({isVisible: false});
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({isVisible: false});
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
    ImagePicker.launchCamera(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({isVisible: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({isVisible: false});
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({isVisible: false});
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
    ImagePicker.launchCamera(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({isVisible: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({isVisible: false});
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({isVisible: false});
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
    ImagePicker.launchImageLibrary(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({isVisible: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({isVisible: false});
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({isVisible: false});
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
    ImagePicker.launchCamera(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({isVisible: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({isVisible: false});
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({isVisible: false});
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
    ImagePicker.launchImageLibrary(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({isVisible: false});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({isVisible: false});
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        this.setState({isVisible: false});
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
    this.setState({openStartDate: true});
    console.log(this.state.openStartDate);
  };

  // open Start Date Time

  onOpenStartDate = () => {
    console.log('Open Date');
    console.log('Start Date Time');
    this.setState({openStartDate: true});
    console.log(this.state.openStartDate);
    console.log(this.state.start_time.getHours() + 2);
  };

  // open End Date Time

  onOpenEndDate = () => {
    console.log('Open Time');
    console.log('End Date Time');
    this.setState({openEndDate: true});
    console.log(this.state.openEndDate);
  };

  // open Start Time

  onOpenStartTime = () => {
    console.log('Open Start Time');
    console.log('Start Time');
    this.setState({startTime: true});
  };

  // open End Time

  onOpenEndTime = () => {
    console.log('Open End Time');
    console.log('End Time');
    this.setState({endTime: true});
  };

  // Country Dropdown

  country_fun = item => {
    this.setState({country_Id: item.country_id});
    console.log('country Fun Item');
    console.log(item.country_id);

    this.getCityFun();
  };

  // City Dropdown

  city_fun = item => {
    this.setState({city_Id: item.city_id});
    console.log('City Fun Item');
    console.log(item.city_id);
  };

  // Category Dropdown

  category_fun = item => {
    console.log('item');
    console.log(item);
    this.setState({category_Id: item.category_id});
    console.log('Category Fun Item');
    console.log(item.category_id);

    this.getSubCategoryFun();
  };

  // Sub-Category Dropdown

  sub_category_fun = item => {
    this.setState({sub_category_Id: item.sub_category_id});

    if (item.sub_category_year_applies === 1) {
      this.setState({isYear: true});
    } else {
      this.setState({isYear: false});
    }

    this.getBrandsFun();
  };

  // Year Dropdown

  year_fun = item => {
    this.setState({year_Id: item.year_id});
    console.log('Year Fun Item');
    console.log(item.year_id);
  };

  // Brand Dropdown

  brand_fun = item => {
    this.setState({brand_Id: item.brand_id});
    console.log('brand Fun Item');
    console.log(item.brand_id);

    this.getModelFun();
  };

  // Modal Dropdown

  model_fun = item => {
    this.setState({modal_Id: item.model_id});
    console.log('Model Fun Item');
    console.log(item.modal_id);
  };

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
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
                fontSize: 22,
                fontFamily: 'Cairo-Bold',
                // color: '#505B98',
                textAlign: 'center',
                // marginBottom: 10,
              }}>
              {strings.EditAd}
            </Text>
          </Appbar>
        </View>

        {/* Add Product Details */}

        <Dialog visible={this.state.progress_ind}>
          <DialogContent style={{width: '80%'}}>
            <Progress />
          </DialogContent>
        </Dialog>

        {/* Video Bottom */}

        <RBSheet
          closeDuration={250}
          ref={ref => {
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
          }}>
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        {/* Camera 1 Bottom */}

        <RBSheet
          closeDuration={250}
          ref={ref => {
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
          }}>
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        {/* Camera 2 Bottom */}

        <RBSheet
          closeDuration={250}
          ref={ref => {
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
          }}>
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        {/* Camera 3 Bottom */}

        <RBSheet
          closeDuration={250}
          ref={ref => {
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
          }}>
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
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
            }}>
            <Image
              style={{resizeMode: 'contain', width: 75, tintColor: '#505B98'}}
              source={images.gallery_icon}
            />
          </TouchableOpacity>
        </RBSheet>

        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              backgroundColor: 'white',
              marginHorizontal: 5,
              paddingVertical: 15,
              marginBottom: 15,
              marginTop: 10,
              flex: 1,
              justifyContent: 'center',
            }}>
            {/* Add Images and Videos */}

            {(() => {
              if (
                this.state.auction_type === 'offline' ||
                this.state.auction_type === 'online'
              ) {
                return (
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 10,
                    }}>
                    <TouchableOpacity
                      ref="video"
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
                      }}>
                      {(() => {
                        if (
                          this.state.videoUri !== '' &&
                          this.state.videoUri !== null
                        ) {
                          console.log('this.state.videoUri');
                          console.log(this.state.videoUri);
                          return (
                            <Video
                              style={{
                                height: 170,
                                width: '90%',
                                borderRadius: 4,
                              }}
                              source={{uri: this.state.videoUri}}
                            />
                          );
                        } else if (
                          this.state.videoUri === '' ||
                          this.state.videoUri == null
                        ) {
                          return (
                            <Image
                              style={{height: 100, width: 100}}
                              source={images.createAd}
                            />
                          );
                        }
                      })()}

                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Cairo-Bold',
                          color: '#BCBDCF',
                          marginTop: 10,
                        }}>
                        {strings.AddProductVideo}
                      </Text>
                    </TouchableOpacity>

                    {this.isFieldInError('video') &&
                      this.getErrorsInField('video').map(errorMessage =>
                        Alert.alert(
                          'Alert',
                          'Please upload a video of the product',
                          [{text: 'OK', style: 'destructive'}],
                          {cancelable: false},
                        ),
                      )}

                    {/* Addtional Image */}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginBottom: 15,
                      }}>
                      <TouchableOpacity
                        ref="product_img1"
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
                        }}>
                        {(() => {
                          if (this.state.product_img1Uri) {
                            console.log('this.state.product_img1Uri');
                            console.log(this.state.product_img1Uri);
                            return (
                              <Image
                                style={{
                                  height: 60,
                                  width: 90,
                                  borderRadius: 3,
                                }}
                                source={{uri: this.state.product_img1Uri}}
                              />
                            );
                          } else {
                            return (
                              <Image
                                style={{height: 50, width: 50}}
                                source={images.createAd}
                              />
                            );
                          }
                        })()}

                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Cairo-Bold',
                            color: '#BCBDCF',
                            marginTop: 5,
                          }}>
                          {strings.addImage}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
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
                        }}>
                        {(() => {
                          if (this.state.product_img2Uri) {
                            console.log('this.state.product_img2Uri');
                            console.log(this.state.product_img2Uri);
                            return (
                              <Image
                                style={{
                                  height: 60,
                                  width: 90,
                                  borderRadius: 3,
                                }}
                                source={{uri: this.state.product_img2Uri}}
                              />
                            );
                          } else {
                            return (
                              <Image
                                style={{height: 50, width: 50}}
                                source={images.createAd}
                              />
                            );
                          }
                        })()}

                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Cairo-Bold',
                            color: '#BCBDCF',
                            marginTop: 5,
                          }}>
                          {strings.addImage}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
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
                        }}>
                        {(() => {
                          if (this.state.product_img3Uri) {
                            console.log('this.state.product_img3Uri');
                            console.log(this.state.product_img3Uri);
                            return (
                              <Image
                                style={{
                                  height: 60,
                                  width: 90,
                                  borderRadius: 3,
                                }}
                                // source={images.createAd}
                                source={{uri: this.state.product_img3Uri}}
                              />
                            );
                          } else {
                            return (
                              <Image
                                style={{height: 50, width: 50}}
                                source={images.createAd}
                              />
                            );
                          }
                        })()}

                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: 'Cairo-Bold',
                            color: '#BCBDCF',
                            marginTop: 5,
                          }}>
                          {strings.addImage}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
            })()}

            {/* Add Product Details */}

            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 50,
                  elevation: 10,
                  marginHorizontal: 5,
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  flex: 1,
                }}>
                {/* Title Input  */}

                <View style={style.textInputView}>
                  <TextInput
                    style={style.textInput}
                    placeholder={strings.title}
                    ref="title"
                    value={this.state.title}
                    onChangeText={itemValue =>
                      this.setState({title: itemValue})
                    }
                  />
                </View>

                {this.isFieldInError('title') &&
                  this.getErrorsInField('title').map(errorMessage => (
                    <Text style={style.error_text}>
                      {/* {strings.Titlefieldisrequired} */}
                      {errorMessage}
                    </Text>
                  ))}
                {/* Name Input */}

                {/* Dropdown */}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  {/* Country Dropdown */}

                  <View>
                    <Dropdown
                      style={style.dropdown}
                      ref="country_Id"
                      placeholderStyle={style.placeholderStyle}
                      selectedTextStyle={style.selectedTextStyle}
                      placeholder={strings.country}
                      data={this.state.country}
                      labelField="country_name"
                      valueField="country_id"
                      value={this.state.country_Id}
                      onChange={this.country_fun}
                      containerStyle={style.container}
                      showsVerticalScrollIndicator={false}
                      maxHeight={150}
                      iconColor="#2D2C71"
                      activeColor="trasnparent"
                    />

                    {this.isFieldInError('country_Id') &&
                      this.getErrorsInField('country_Id').map(errorMessage => (
                        <Text style={style.error_text}>
                          {strings.CountryisRequired}
                        </Text>
                      ))}
                  </View>

                  {/* City Dropdown */}

                  <View>
                    <Dropdown
                      style={style.dropdown}
                      ref="city_Id"
                      placeholderStyle={style.placeholderStyle}
                      selectedTextStyle={style.selectedTextStyle}
                      placeholder={strings.city}
                      data={this.state.cityfilteredArray}
                      labelField="city_name"
                      valueField="city_id"
                      value={this.state.city_Id}
                      onChange={this.city_fun}
                      containerStyle={style.container}
                      showsVerticalScrollIndicator={false}
                      maxHeight={150}
                      iconColor="#2D2C71"
                      activeColor="trasnparent"
                    />
                    {this.isFieldInError('city_Id') &&
                      this.getErrorsInField('city_Id').map(errorMessage => (
                        <Text style={style.error_text}>
                          {strings.CityisRequired}
                        </Text>
                      ))}
                  </View>
                </View>

                {(() => {
                  if (
                    this.state.auction_type === 'offline' ||
                    this.state.auction_type === 'online'
                  ) {
                    return (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 5,
                          }}>
                          {/* Category Dropdown */}
                          <View>
                            <Dropdown
                              style={style.dropdown}
                              ref="category_id"
                              placeholderStyle={style.placeholderStyle}
                              selectedTextStyle={style.selectedTextStyle}
                              placeholder={strings.category}
                              data={this.state.category}
                              labelField="category_name"
                              valueField="category_id"
                              value={this.state.category_Id}
                              onChange={this.category_fun}
                              containerStyle={style.container}
                              showsVerticalScrollIndicator={false}
                              maxHeight={150}
                              iconColor="#2D2C71"
                              activeColor="trasnparent"
                            />
                            {this.isFieldInError('category_Id') &&
                              this.getErrorsInField('category_Id').map(
                                errorMessage => (
                                  <Text style={style.error_text}>
                                    {strings.CategoryisRequired}
                                  </Text>
                                ),
                              )}
                          </View>

                          {/* Sub Category Dropdown */}
                          <View>
                            <Dropdown
                              style={style.dropdown}
                              ref="sub_category_id"
                              placeholderStyle={style.placeholderStyle}
                              selectedTextStyle={style.selectedTextStyle}
                              placeholder={strings['SelectSub-Category']}
                              data={this.state.subfilteredArray}
                              labelField="sub_category_name"
                              valueField="sub_category_id"
                              value={this.state.sub_category_Id}
                              onChange={this.sub_category_fun}
                              containerStyle={style.container}
                              showsVerticalScrollIndicator={false}
                              maxHeight={150}
                              iconColor="#2D2C71"
                              activeColor="trasnparent"
                            />

                            {this.isFieldInError('sub_category_Id') &&
                              this.getErrorsInField('sub_category_Id').map(
                                errorMessage => (
                                  <Text style={style.error_text}>
                                    {strings['Sub-Categoryfieldisrequired']}
                                  </Text>
                                ),
                              )}
                          </View>
                        </View>

                        {/* Dropdown */}

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 5,
                          }}>
                          {/* Brand Dropdown */}

                          <View>
                            <Dropdown
                              style={style.dropdown}
                              ref="brand_Id"
                              placeholderStyle={style.placeholderStyle}
                              selectedTextStyle={style.selectedTextStyle}
                              placeholder={strings.brand}
                              data={this.state.brandfilteredArray}
                              labelField="brand_name"
                              valueField="brand_id"
                              value={this.state.brand_Id}
                              onChange={this.brand_fun}
                              containerStyle={style.container}
                              showsVerticalScrollIndicator={false}
                              maxHeight={150}
                              iconColor="#2D2C71"
                              activeColor="trasnparent"
                            />

                            {this.isFieldInError('brand_Id') &&
                              this.getErrorsInField('brand_Id').map(
                                errorMessage => (
                                  <Text style={style.error_text}>
                                    {strings.Brandisrequired}
                                  </Text>
                                ),
                              )}
                          </View>
                          <View>
                            {/* Model Dropdown */}

                            <Dropdown
                              style={style.dropdown}
                              ref="model_Id"
                              placeholderStyle={style.placeholderStyle}
                              selectedTextStyle={style.selectedTextStyle}
                              placeholder={strings.model}
                              data={this.state.modelfilteredArray}
                              labelField="model_name"
                              valueField="model_id"
                              value={this.state.modal_Id}
                              onChange={this.model_fun}
                              containerStyle={style.container}
                              showsVerticalScrollIndicator={false}
                              maxHeight={100}
                              iconColor="#2D2C71"
                              activeColor="trasnparent"
                            />
                            {this.isFieldInError('model_Id') &&
                              this.getErrorsInField('model_Id').map(
                                errorMessage => (
                                  <Text style={style.error_text}>
                                    {strings.ModelisRequired}
                                  </Text>
                                ),
                              )}
                          </View>
                        </View>

                        <View style={{marginTop: 5}}>
                          {(() => {
                            if (this.state.isYear) {
                              return (
                                <View>
                                  <Dropdown
                                    style={style.dropdown}
                                    ref="year_id"
                                    placeholderStyle={style.placeholderStyle}
                                    selectedTextStyle={style.selectedTextStyle}
                                    containerStyle={style.container}
                                    placeholder={strings.year}
                                    data={this.state.year}
                                    labelField="year"
                                    valueField="year_id"
                                    value={this.state.year_Id}
                                    onChange={this.year_fun}
                                    showsVerticalScrollIndicator={false}
                                    maxHeight={150}
                                    iconColor="#2D2C71"
                                    activeColor="trasnparent"
                                  />
                                  {this.isFieldInError('year_Id') &&
                                    this.getErrorsInField('year_Id').map(
                                      errorMessage => (
                                        <Text style={style.error_text}>
                                          {strings.thefieldyearisrequired}
                                        </Text>
                                      ),
                                    )}
                                </View>
                              );
                            }
                          })()}
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignSelf: 'center',
                            marginTop: 10,
                          }}>
                          {/* Starting Price Input */}

                          {(() => {
                            if (this.state.auction_type === 'offline') {
                              return (
                                <>
                                  <View style={style.textInputView}>
                                    <TextInput
                                      style={style.textInput}
                                      placeholder={strings.maxPrice}
                                      keyboardType="number-pad"
                                      ref="starting_price"
                                      value={this.state.starting_price}
                                      onChangeText={itemValue =>
                                        this.setState({
                                          starting_price: itemValue,
                                        })
                                      }
                                    />
                                  </View>

                                  <View style={{width: '4%'}} />
                                </>
                              );
                            } else {
                            }
                          })()}

                          {/* </View> */}

                          <View style={style.textInputView}>
                            <TextInput
                              style={style.textInput}
                              placeholder={strings.keywords}
                              value={this.state.keywords}
                              ref="keywords"
                              onChangeText={itemValue =>
                                this.setState({keywords: itemValue})
                              }
                            />
                          </View>
                        </View>

                        {/* Select Start Date Time */}

                        {(() => {
                          if (this.state.auction_type === 'online') {
                            return (
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 10,
                                  }}>
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
                                    onPress={this.onOpenStartDate}>
                                    <View
                                      style={{
                                        flex: 1,
                                        justifyContent: 'space-around',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <View>
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            fontFamily: 'Cairo-SemiBold',
                                          }}>
                                          {this.state.startDate === ''
                                            ? this.state.start_date_time.toLocaleDateString()
                                            : this.state.startDate.toLocaleDateString()}
                                        </Text>
                                      </View>
                                      <Image
                                        style={{height: 20, width: 20}}
                                        source={images.calendar}
                                      />
                                    </View>
                                    <DatePicker
                                      modal
                                      open={this.state.openStartDate}
                                      mode={'date'}
                                      date={this.state.start_date_time}
                                      onConfirm={date => {
                                        this.setState({
                                          start_date_time: date,
                                          openStartDate: false,
                                          startDate: '',
                                        });
                                      }}
                                      onCancel={() => {
                                        this.setState({openStartDate: false});
                                      }}
                                      title={strings.SelectStartDate}
                                      androidVariant="iosClone"
                                      minimumDate={new Date()}
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
                                    onPress={this.onOpenStartTime}>
                                    <View
                                      style={{
                                        flex: 1,
                                        justifyContent: 'space-around',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <View>
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            fontFamily: 'Cairo-SemiBold',
                                          }}>
                                          {this.state.start_time_res === ''
                                            ? moment(
                                                this.state.start_time,
                                              ).format('hh:mm:ss')
                                            : this.state.start_time_res}
                                        </Text>
                                      </View>
                                      <Image
                                        style={{height: 22, width: 22}}
                                        source={images.start_time}
                                      />
                                    </View>
                                    <DatePicker
                                      modal
                                      open={this.state.startTime}
                                      mode={'time'}
                                      date={this.state.start_time}
                                      onConfirm={time => {
                                        this.setState(
                                          {
                                            start_time_res: '',
                                            start_time: time,
                                            startTime: false,
                                          },
                                          () => {
                                            var dateCurrent = time;

                                            var start_time_utc =
                                              moment(dateCurrent);

                                            var final_start_time =
                                              start_time_utc.format('HH:mm:ss');

                                            var start_date_time_temp = moment(
                                              this.state.start_date_time,
                                            ).format('YYYY-MM-DD');
                                            if (
                                              start_date_time_temp ===
                                              moment().format('YYYY-MM-DD')
                                            ) {
                                              if (
                                                final_start_time <
                                                moment().format('HH:mm:ss')
                                              ) {
                                                Alert.alert(
                                                  strings.Alert,
                                                  strings.selectValidTime,
                                                  [
                                                    {
                                                      text: strings.ok,
                                                      style: 'cancel',
                                                    },
                                                  ],
                                                  {cancelable: true},
                                                );
                                                this.setState({
                                                  start_time: new Date(),
                                                  start_time_res: '',
                                                });
                                              }
                                            }
                                          },
                                        );
                                      }}
                                      onCancel={() => {
                                        this.setState({startTime: false});
                                      }}
                                      title={strings.SelectStartTime}
                                      androidVariant="iosClone"
                                      // minimumDate={new Date()}
                                    />
                                  </TouchableOpacity>
                                </View>

                                <View style={{height: 20}} />
                              </View>
                            );
                          }
                        })()}
                      </View>
                    );
                  }
                })()}

                {/* Dropdown */}

                {/* Description Input */}

                <View style={style.DecsInputView}>
                  <TextInput
                    style={style.DecsInput}
                    ref="description"
                    placeholder={strings.description}
                    // numberOfLines={4}
                    multiline={true}
                    value={this.state.description}
                    onChangeText={itemValue =>
                      this.setState({description: itemValue})
                    }
                  />
                </View>
                {this.isFieldInError('description') &&
                  this.getErrorsInField('description').map(errorMessage => (
                    <Text style={style.error_text}>
                      {strings.Descriptionfieldisrequired}
                    </Text>
                  ))}

                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: 15,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: 50,
                      backgroundColor: '#505B98',
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 2,
                      paddingHorizontal: 10,
                    }}
                    onPress={this.onCreatePostValidation}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: 'Cairo-Bold',
                        color: 'white',
                      }}>
                      {strings.Update}
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

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(updateAd);

const {width} = Dimensions.get('window');

const style = StyleSheet.create({
  card: {
    borderRadius: 10,
    // elevation: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    width: 170,
    textAlign: 'justify',
    // textAlignVertical: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: 130,
    height: 110,
    // borderRadius: 5
  },

  regularText: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
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
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    textAlignVertical: 'center',
    marginBottom: 10,
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
    // flex: 1
  },

  sideMenuStyle: {
    margin: 0,
    width: width * 0.75, // SideMenu width
    flex: 1,
  },

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

  error_text: {
    padding: 10,
    color: 'red',
    backgroundColor: '#ffebe6',
    borderRadius: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
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
});
