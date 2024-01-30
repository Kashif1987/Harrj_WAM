import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Appbar, IconButton, Provider} from 'react-native-paper';
import images from '../../assets/images/images';
import BottomNav from '../../components/BottomNavigation';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getProductListAction} from '../../actions/getProductList.action';
import {getCategoriesSubCategories} from '../../actions/bidder/getCategories.action';
import {getBrands} from '../../actions/getBrands.action';
import CheckBox from '@react-native-community/checkbox';
import strings from '../../translations/translateConstant';
import {Actions} from 'react-native-router-flux';
import {Modal} from 'react-native';
import {ScrollView} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {getSubCategories} from '../../actions/getSubCategories.action';
import {getModelAction} from '../../actions/getModel.action';
import {Slider} from '@miblanchard/react-native-slider';
import {getNotificationService} from '../../actions/get_notification.action';
import {ActionSheet} from 'react-native-cross-actionsheet';
import SimpleToast from 'react-native-simple-toast';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import FastImage from 'react-native-fast-image';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';

var applanguage = '';
var lanStaticData = [];

// for onRefresh
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

class Search extends React.Component {
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
    ],
  };

  // state = { activeIndex: 0 }

  // OnRefresh

  _onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        toggleCheckBoxVal: {},
        category_id: [],
        toggleCheckBoxSub_CatVal: {},
        sub_category_id_arry: [],
        sub_category_id: [],
        toggleCheckBoxBrandVal: {},
        brand_id_arry: [],
        brand_id: [],
        brandfilteredArray: [],
        BrandsList: [],
        modelList: [],
        model_id: [],
        model_id_arry: [],
        progress: true,
        toggleCheckBoxModelVal: {},
      },
      () => {
        this.toggleCheckBox_Category();
      },
    );
    wait(1000).then(() => {
      this.setState({refreshing: false});
    });
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      search_icon: true,
      user_id: '',
      refreshing: false,
      applanguage: '',
      lanStaticData: [],
      isChecked: false,
      productList: [],
      watchCheck: false,
      mobileCheck: false,
      laptop: false,
      camera: false,
      vehicle: false,
      isVisible: false,
      notificationList: [],
      categorieSubCategoryList: [],
      subCategorieList: [],
      BrandsList: [],
      modelList: [],
      toggleCheckBoxVal: {},
      toggleCheckBoxBrandVal: {},
      toggleCheckBoxSub_CatVal: {},
      toggleCheckBoxModelVal: {},
      customer_id: '',
      title: '',
      auction_type: '',
      category_id: [],
      sub_category_id: [],
      brand_id: [],
      model_id: [],
      city_id: [],
      max_price_filter: '0',
      modalVisible: false,
      notificationModalVisible: false,

      subfilteredArray: [],
      BrandsList: [],
      brandfilteredArray: [],
      modelfilteredArray: [],

      selectedLan: true,

      last_id: 0,
      page_records: 8,
      is_first_call: true,
      onEndReachedCalledDuringMomentum: true,
      progress: true,
    };

    this.onPressButton = this.onPressButton.bind(this);
    this.openNormalBid = this.openNormalBid.bind(this);
    this.openLiveBid = this.openLiveBid.bind(this);
    this.openHome = this.openHome.bind(this);
    this.toggleCheckBox_Category = this.toggleCheckBox_Category.bind(this);
    this.toggleCheckBox_Brand = this.toggleCheckBox_Brand.bind(this);
    this.toggleCheckBox_SubCat = this.toggleCheckBox_SubCat.bind(this);
    this.toggleCheckBox_Model = this.toggleCheckBox_Model.bind(this);
    this.getCategorySubCategory = this.getCategorySubCategory.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  componentDidMount = async () => {
    AsyncStorage.getItem('userId').then(value => {
      console.log('user_id');
      console.log(value);
      this.setState({user_id: value});
    });
    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
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
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }

    this.setState({});

    this.filterList(
      this.state.customer_id,
      this.state.title,
      this.state.auction_type,
      this.state.category_id,
      this.state.sub_category_id,
      this.state.brand_id,
      this.state.model_id,
      this.state.max_price_filter,
    );
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
              ],
              cancel: {
                onPress: () => console.log('cancel'),
                text: strings.Close,
              },
            });
          },
        },
      ],
      cancel: {onPress: () => console.log('cancel'), text: strings.Close},
    });
  }

  // Get Notification

  getNotification = () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      dispatch(getNotificationService())
        .then(response => {
          console.log('dispatch response get banners: ');
          console.log(response);
          if (response && typeof response !== 'undefined' && response !== '') {
            this.setState({progress: false});
            var responseData = response.data;
            this.setState({notificationList: responseData});
          } else {
            this.setState({progress: false});
            // Alert.alert('something went wrong..!!');
            SimpleToast.show(strings.someError, SimpleToast.SHORT);
          }
        })
        .catch(error => {
          this.setState({progress: false});
          console.log('dispatch error: ');
          console.log(error);
          // Alert.alert(error.message);
        });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  setModalVisible = visible => {
    this.getCategorySubCategory();
    this.setState({
      modalVisible: visible,
    });
    this.componentDidMount();
  };

  setNotificationModalVisible = visible => {
    this.getNotification();
    this.setState({notificationModalVisible: visible});
  };

  onPressButton = () => {
    this.props.navigation.navigate('product_details');
  };
  openNormalBid = () => {
    this.props.navigation.replace('normal_bid');
  };
  openHome = () => {
    this.props.navigation.replace('home');
  };
  openLiveBid = () => {
    this.props.navigation.replace('live_bid');
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

  // Price

  rangeSliderHandle = value => {
    console.log('rangeSliderHandle');
    console.log(value);
    this.setState({
      max_price_filter: value,
      last_id: 0,
      productList: [],
      progress: true,
    });
    console.log(value);
  };

  // Search for Filter

  Search_Fun = itemValue => {
    console.log('Search Filter Console');
    console.log(itemValue);
    console.log(itemValue.itemValue);
    this.setState({
      search_string: itemValue.itemValue,
      title: itemValue.itemValue,
      last_id: 0,
      productList: [],
      progress: true,
    });
    this.filterList(
      this.state.customer_id,
      itemValue.itemValue,
      this.state.auction_type,
      this.state.category_id,
      this.state.sub_category_id,
      this.state.brand_id,
      this.state.model_id,
      this.state.max_price_filter,
    );
  };

  // Check Box for Categories

  toggleCheckBox_Category = check_id => {
    console.log('check_id');
    console.log(check_id);
    console.log('and check_id');

    var category_id_arry = this.state.category_id;

    console.log('before category_id_arry: ');
    console.log(category_id_arry);

    const checkCopy = this.state.toggleCheckBoxVal;

    if (checkCopy[check_id]) {
      checkCopy[check_id] = false;
      category_id_arry = category_id_arry.filter(item => item !== check_id);
    } else {
      checkCopy[check_id] = true;
      if (!category_id_arry.includes(check_id)) {
        category_id_arry.push(check_id);
      }
    }
    console.log('after category_id_arry: ');
    console.log(category_id_arry);

    this.setState({
      toggleCheckBoxVal: checkCopy,
      category_id: category_id_arry,
      toggleCheckBoxSub_CatVal: {},
      sub_category_id_arry: [],
      sub_category_id: [],
      toggleCheckBoxBrandVal: {},
      brand_id_arry: [],
      brand_id: [],
      brandfilteredArray: [],
      BrandsList: [],
      modelList: [],
      model_id: [],
      model_id_arry: [],
      last_id: 0,
      productList: [],
      progress: true,
      toggleCheckBoxModelVal: {},
    });
    this.filterList(
      this.state.customer_id,
      this.state.title,
      this.state.auction_type,
      category_id_arry,
      this.state.sub_category_id,
      this.state.brand_id,
      this.state.model_id,
      this.state.max_price_filter,
    );
    this.getSubCategory();
    this.getBrands();
    // this.getModelList();
  };

  // Toggle CheckBox for Brand

  toggleCheckBox_Brand = check_id => {
    console.log(' Brand check_id');
    console.log(check_id);
    console.log('and Brand check_id');

    var brand_id_arry = this.state.brand_id;

    console.log('before brand_id_arry: ');
    console.log(brand_id_arry);

    const checkCopy = this.state.toggleCheckBoxBrandVal;

    if (checkCopy[check_id]) {
      checkCopy[check_id] = false;
      brand_id_arry = brand_id_arry.filter(item => item !== check_id);
    } else {
      checkCopy[check_id] = true;
      if (!brand_id_arry.includes(check_id)) {
        brand_id_arry.push(check_id);
      }
    }
    console.log('after brand_id_arry: ');
    console.log(brand_id_arry);
    this.setState({
      toggleCheckBoxBrandVal: checkCopy,
      brand_id: brand_id_arry,
      toggleCheckBoxModelVal: {},
      model_id_arry: [],
      last_id: 0,
      productList: [],
      progress: true,
    });

    this.filterList(
      this.state.customer_id,
      this.state.title,
      this.state.auction_type,
      this.state.category_id,
      this.state.sub_category_id,
      brand_id_arry,
      this.state.model_id,
      this.state.max_price_filter,
    );
    this.getModelList();
  };

  // Toggle CheckBox for Sub-Cat

  toggleCheckBox_SubCat = check_id => {
    console.log(' Brand check_id');
    console.log(check_id);
    console.log('and Brand check_id');

    var subCat_id_arry = this.state.sub_category_id;

    console.log('before subCat_id_arry: ');
    console.log(subCat_id_arry);

    const checkCopy = this.state.toggleCheckBoxSub_CatVal;

    if (checkCopy[check_id]) {
      checkCopy[check_id] = false;
      subCat_id_arry = subCat_id_arry.filter(item => item !== check_id);
    } else {
      checkCopy[check_id] = true;
      if (!subCat_id_arry.includes(check_id)) {
        subCat_id_arry.push(check_id);
      }
    }
    console.log('after subCat_id_arry: ');
    console.log(subCat_id_arry);
    this.setState({
      toggleCheckBoxSub_CatVal: checkCopy,
      sub_category_id: subCat_id_arry,
      toggleCheckBoxBrandVal: {},
      brand_id_arry: [],
      brandfilteredArray: [],
      BrandsList: [],
      last_id: 0,
      productList: [],
      progress: true,
      toggleCheckBoxModelVal: {},
    });

    this.filterList(
      this.state.customer_id,
      this.state.title,
      this.state.auction_type,
      this.state.category_id,
      subCat_id_arry,
      this.state.brand_id,
      this.state.model_id,
      this.state.max_price_filter,
    );
    this.getBrands();
    // this.getModelList();
  };

  // Toggle CheckBox for Model

  toggleCheckBox_Model = check_id => {
    console.log(' Model check_id');
    console.log(check_id);
    console.log('and Model check_id');

    var model_id_arry = this.state.model_id;

    console.log('before model_id_arry : ');
    console.log(model_id_arry);

    const checkCopy = this.state.toggleCheckBoxModelVal;

    if (checkCopy[check_id]) {
      checkCopy[check_id] = false;
      model_id_arry = model_id_arry.filter(item => item !== check_id);
    } else {
      checkCopy[check_id] = true;
      if (!model_id_arry.includes(check_id)) {
        model_id_arry.push(check_id);
      }
    }
    console.log('after model_id_arry: ');
    console.log(model_id_arry);
    this.setState({
      toggleCheckBoxModelVal: checkCopy,
      model_id: model_id_arry,
      last_id: 0,
      productList: [],
      progress: true,
    });

    this.filterList(
      this.state.customer_id,
      this.state.title,
      this.state.auction_type,
      this.state.category_id,
      this.state.sub_category_id,
      this.state.brand_id,
      model_id_arry,
      this.state.max_price_filter,
    );
  };

  // Getting Brands API

  getBrands = () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      dispatch(getBrands(this.token)).then(response => {
        if (response && typeof response !== 'undefined' && response !== '') {
          this.setState({progress: false});
          this.setState({
            BrandsList: response.data,
            brandfilteredArray: response.data,
          });

          this.setState({});
        }

        if (
          this.state.category_id.length > 0 &&
          this.state.sub_category_id.length > 0
        ) {
          let filteredArray = this.state.BrandsList.filter(item => {
            if (
              this.state.category_id.includes(item.category_id) &&
              this.state.sub_category_id.includes(item.sub_category_id)
            ) {
              return true;
            } else {
              return false;
            }
          });

          console.log('getBrands category_id sub_category_id filteredArray: ');
          console.log(filteredArray);

          this.setState({brandfilteredArray: filteredArray});
          this.setState({});
        } else {
          if (
            this.state.category_id &&
            typeof this.state.category_id !== 'undefined' &&
            this.state.category_id.length > 0
          ) {
            let filteredArray = this.state.BrandsList.filter(item => {
              if (this.state.category_id.includes(item.category_id)) {
                return true;
              } else {
                return false;
              }
            });

            console.log('getBrands category_id filteredArray: ');
            console.log(filteredArray);

            this.setState({brandfilteredArray: filteredArray});
            this.setState({});
          } else {
            if (
              this.state.sub_category_id &&
              typeof this.state.sub_category_id !== 'undefined' &&
              this.state.sub_category_id.length > 0
            ) {
              let filteredArray = this.state.BrandsList.filter(item => {
                if (this.state.sub_category_id.includes(item.sub_category_id)) {
                  return true;
                } else {
                  return false;
                }
              });

              console.log('getBrands sub_category_id filteredArray: ');
              console.log(filteredArray);

              this.setState({brandfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('getBrands nothing filteredArray: ');
              console.log(filteredArray);

              let filteredArray = [];

              this.setState({brandfilteredArray: filteredArray});
              this.setState({});
            }
          }
        }
      });

      this.getModelList().catch(error => {
        this.setState({progress: false});
        console.log('dispatch error: ');
        console.log(error);
        // Alert.alert(error.message);
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  // Getting Categories API

  getCategorySubCategory = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;
      var authToken = '';
      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;
        })
        .catch(error => {
          this.setState({progress: false});
          console.log('dispatch error: ');
          console.log(error);
          // Alert.alert(error.message);
        });
      dispatch(getCategoriesSubCategories(authToken)).then(response => {
        console.log('getSubCategory Token: ');
        console.log(authToken);
        console.log('dispatch response getSubCategory: ');
        console.log(response);
        if (response && typeof response !== 'undefined' && response !== '') {
          this.setState({progress: false});
          this.setState({categorieSubCategoryList: response.data});
        } else {
          this.setState({progress: false});
          // Alert.alert('something went wrong..!!');
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        }
        this.getBrands();
      });
    } catch (errorCatch) {
      // Alert.alert('Try Catch');
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  // Getting Sub-Category

  getSubCategory = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;
      var authToken = '';
      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;
        })
        .catch(error => {
          this.setState({progress: false});
          console.log('dispatch error: ');
          console.log(error);
          // Alert.alert(error.message);
        });
      dispatch(getSubCategories(authToken)).then(response => {
        if (response && typeof response !== 'undefined' && response !== '') {
          this.setState({progress: false});

          this.setState({
            subCategorieList: response.data,
            subfilteredArray: response.data,
          });
        } else {
          this.setState({progress: false});
          // Alert.alert('something went wrong..!!');
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        }

        if (
          this.state.category_id &&
          typeof this.state.category_id !== 'undefined' &&
          this.state.category_id.length > 0
        ) {
          console.log('if ');

          //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
          //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

          let filteredArray = this.state.subCategorieList.filter(item => {
            if (this.state.category_id.includes(item.category_id)) {
              return true;
            } else {
              return false;
            }
          });

          console.log('if filteredArray: ');
          console.log(filteredArray);

          this.setState({subfilteredArray: filteredArray});
          this.setState({});
        } else {
          console.log('else ');

          let filteredArray = [];
          console.log('else filteredArray: ');
          console.log(filteredArray);

          this.setState({subfilteredArray: filteredArray});
          this.setState({});
        }

        this.getBrands();
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  // Get Model List

  getModelList = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;
      var authToken = '';
      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;
        })
        .catch(error => {
          this.setState({progress: false});
          console.log('dispatch error: ');
          console.log(error);
          // Alert.alert(error.message);
        });
      dispatch(getModelAction(authToken)).then(response => {
        console.log('Model List Token: ');
        console.log(authToken);
        console.log('dispatch response Model List: ');
        console.log(response);
        if (response && typeof response !== 'undefined' && response !== '') {
          this.setState({progress: false});
          this.setState({
            modelList: response.data,
            modelfilteredArray: response.data,
          });
        } else {
          this.setState({progress: false});
          // Alert.alert('something went wrong..!!');
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        }
        if (
          this.state.brand_id &&
          typeof this.state.brand_id !== 'undefined' &&
          this.state.brand_id.length > 0
        ) {
          console.log('if ');

          let filteredArray = this.state.modelList.filter(item => {
            if (this.state.brand_id.includes(item.brand_id)) {
              return true;
            } else {
              return false;
            }
          });

          console.log('if ModelfilteredArray: ');
          console.log(filteredArray);

          this.setState({modelfilteredArray: filteredArray});
          this.setState({});
        } else {
          console.log('else ');

          let filteredArray = [];
          console.log('else ModelfilteredArray: ');
          console.log(filteredArray);

          this.setState({modelfilteredArray: filteredArray});
          this.setState({});
        }
      });
    } catch (errorCatch) {
      this.setState({progress: false});
    }
  };

  filterListFun = async () => {
    await this.filterList(
      this.state.customer_id,
      this.state.title,
      this.state.auction_type,
      this.state.category_id,
      this.state.sub_category_id,
      this.state.brand_id,
      this.state.model_id,
      this.state.max_price_filter,
    );
  };

  filterList = async (
    customer_id,
    title,
    auction_type,
    category_id,
    sub_category_id,
    brand_id,
    model_id,
    max_price_filter,
  ) => {
    try {
      const {dispatch} = this.props;
      var authToken = '';
      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;
          this.setState({progress: false});
        })
        .catch(error => {
          console.log('dispatch error: ');
          console.log(error);
          // SimpleToast.show(strings.someError, SimpleToast.SHORT);
          this.setState({progress: false});
        });
      dispatch(
        getProductListAction(
          authToken,
          customer_id,
          title,
          auction_type,
          category_id,
          sub_category_id,
          brand_id,
          model_id,
          max_price_filter,
          this.state.last_id,
          this.state.page_records,
        ),
      ).then(response => {
        // console.log('dispatch response getProduct: ');
        // console.log(response);
        var responseData = response.data;

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

        this.setState({
          start_time: final_start_time,
          end_time: final_end_time,
        });

        if (
          responseData &&
          typeof responseData !== 'undefined' &&
          responseData.length > 0
        ) {
          console.log(
            '---------------responseData last_id: -=-----------------',
          );
          console.warn(responseData[responseData.length - 1]);
          this.setState({progress: false});

          // Alert.alert(JSON.stringify(responseData[(responseData.length - 1)].product_id));

          if (this.state.is_first_call) {
            this.setState({
              productList: responseData,
              is_first_call: false,
              last_id: responseData[responseData.length - 1].product_id,
              progress: false,
            });
          } else {
            var productListArry = this.state.productList;
            productListArry = productListArry.concat(responseData);
            this.setState({progress: false});

            this.setState({
              productList: productListArry,
              last_id: responseData[responseData.length - 1].product_id,
              progress: false,
            });
          }
        } else {
          if (this.state.is_first_call) {
            this.setState({productList: [], is_first_call: false});
            this.setState({progress: false});
          }
          // Alert.alert('something went wrong..!!');
          this.setState({progress: false});
        }
        this.setState({progress: false});
      });
    } catch (errorCatch) {
      SimpleToast.show(strings.someError, SimpleToast.SHORT);
      this.setState({progress: false});
      // Alert.alert(errorCatch.message);
    }
  };

  openMenu = () => this.setState({isVisible: true});

  closeMenu = () => this.setState({isVisible: false});

  tabChangeFunc = (id, title) => {
    var auctionTypeStr = '';
    if (id === 0) {
      auctionTypeStr = '';
    } else {
      if (id === 1) {
        auctionTypeStr = 'offline';
      } else {
        if (id === 2) {
          auctionTypeStr = 'online';
        }
      }
    }
    this.setState({activeIndex: id, auction_type: auctionTypeStr});
    this.filterList(
      this.state.customer_id,
      this.state.title,
      auctionTypeStr,
      this.state.category_id,
      this.state.sub_category_id,
    );
  };

  // Change Language

  langFun = () => {
    AsyncStorage.getItem('AppLanguage').then(value => {
      if (value != null) {
        this.setState({applanguage: value});
        applanguage = value;
      } else {
        console.log('elses');
      }
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
        {strings.noAdFound}
      </Text>
    </View>
  );

  goToLogin = () => {
    this.setState({alert: !this.state.alert});
  };

  render() {
    return (
      <Provider>
        <View
          style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
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
          <View>
            {/* App Bar */}
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
              {/* back button */}

              {/* Harrj Logo */}

              <View style={{flex: 1, marginLeft: 5}}>
                <Image
                  style={{resizeMode: 'contain', width: 75}}
                  source={images.ic_harjj_logo}
                />
              </View>

              {/* Filter Button */}

              <View>
                <IconButton
                  onPress={() => this.setModalVisible(true)}
                  style={{alignSelf: 'flex-end'}}
                  icon="filter"
                  color="#505B98"
                />
                <Modal
                  animationType="fade"
                  visible={this.state.modalVisible}
                  onRequestClose={() =>
                    this.setModalVisible(!this.state.modalVisible)
                  }>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                      margin: 8,
                      marginTop: '5%',
                    }}>
                    <IconButton
                      color="#505B98"
                      style={{alignSelf: 'flex-end'}}
                      onPress={() => this.setModalVisible(false)}
                      icon="close"
                    />

                    <Text
                      style={{
                        fontFamily: 'Cairo-SemiBold',
                        fontSize: 18,
                        marginBottom: 10,
                        textAlign: 'justify',
                      }}>
                      {strings.categoryList}
                    </Text>

                    {this.state.categorieSubCategoryList &&
                      this.state.categorieSubCategoryList.length > 0 &&
                      this.state.categorieSubCategoryList.map(
                        itemcategorieSubCategoryList => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginRight: 10,
                              marginBottom: 5,
                            }}>
                            <Text style={{fontFamily: 'Cairo-SemiBold'}}>
                              {/* {itemcategorieSubCategoryList.category_name} */}
                              {this.state.selectedLan == true
                                ? itemcategorieSubCategoryList.category_name
                                : itemcategorieSubCategoryList.category_name_arabic}
                            </Text>

                            <CheckBox
                              style={{height: 30, width: 30}}
                              value={
                                this.state.toggleCheckBoxVal[
                                  itemcategorieSubCategoryList.category_id
                                ]
                              }
                              onValueChange={() =>
                                this.toggleCheckBox_Category(
                                  itemcategorieSubCategoryList.category_id,
                                )
                              }
                            />
                          </View>
                        ),
                      )}

                    {/* Sub Category Check Box */}

                    <Text
                      style={{
                        fontFamily: 'Cairo-SemiBold',
                        fontSize: 18,
                        marginBottom: 10,
                        textAlign: 'justify',
                        marginTop: 5,
                      }}>
                      {strings.subCategoryList}
                    </Text>

                    {this.state.subfilteredArray &&
                      this.state.subfilteredArray.length > 0 &&
                      this.state.subfilteredArray.map(itemSubCategorieList => (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginRight: 10,
                              marginBottom: 5,
                            }}>
                            <Text style={{fontFamily: 'Cairo-SemiBold'}}>
                              {/* {itemSubCategorieList.sub_category_name} */}
                              {this.state.selectedLan == true
                                ? itemSubCategorieList.sub_category_name
                                : itemSubCategorieList.sub_category_name_arabic}
                            </Text>

                            <CheckBox
                              style={{height: 30, width: 30}}
                              value={
                                this.state.toggleCheckBoxSub_CatVal[
                                  itemSubCategorieList.sub_category_id
                                ]
                              }
                              onValueChange={() =>
                                this.toggleCheckBox_SubCat(
                                  itemSubCategorieList.sub_category_id,
                                )
                              }
                            />
                          </View>
                        </View>
                      ))}

                    <Text
                      style={{
                        fontFamily: 'Cairo-SemiBold',
                        fontSize: 18,
                        marginBottom: 10,
                        textAlign: 'justify',
                      }}>
                      {strings.brandList}
                    </Text>

                    {this.state.brandfilteredArray &&
                      this.state.brandfilteredArray.length > 0 &&
                      this.state.brandfilteredArray.map(itemBrandsList => (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginRight: 10,
                              marginBottom: 5,
                            }}>
                            <Text style={{fontFamily: 'Cairo-SemiBold'}}>
                              {/* {itemBrandsList.brand_name} */}
                              {this.state.selectedLan == true
                                ? itemBrandsList.brand_name
                                : itemBrandsList.brand_name_arabic}
                            </Text>

                            <CheckBox
                              style={{height: 30, width: 30}}
                              value={
                                this.state.toggleCheckBoxBrandVal[
                                  itemBrandsList.brand_id
                                ]
                              }
                              onValueChange={() =>
                                this.toggleCheckBox_Brand(
                                  itemBrandsList.brand_id,
                                )
                              }
                            />
                          </View>
                        </View>
                      ))}

                    {/* Model List  */}

                    <Text
                      style={{
                        fontFamily: 'Cairo-SemiBold',
                        fontSize: 18,
                        marginBottom: 10,
                        textAlign: 'justify',
                      }}>
                      {strings.modelList}
                    </Text>

                    {this.state.modelfilteredArray &&
                      this.state.modelfilteredArray.length > 0 &&
                      this.state.modelfilteredArray.map(itemModelList => (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignContent: 'center',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginRight: 10,
                              marginBottom: 5,
                            }}>
                            <Text style={{fontFamily: 'Cairo-SemiBold'}}>
                              {/* {itemModelList.model_name} */}
                              {this.state.selectedLan == true
                                ? itemModelList.model_name
                                : itemModelList.model_name_arabic}
                            </Text>

                            <CheckBox
                              style={{height: 30, width: 30}}
                              value={
                                this.state.toggleCheckBoxModelVal[
                                  itemModelList.model_id
                                ]
                              }
                              onValueChange={() =>
                                this.toggleCheckBox_Model(
                                  itemModelList.model_id,
                                )
                              }
                            />
                          </View>
                        </View>
                      ))}

                    <View style={{marginBottom: 10}}>
                      <Text
                        style={{
                          marginTop: 10,
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: 18,
                          textAlign: 'justify',
                        }}>
                        {strings.Pricerange} ({this.state.max_price_filter})
                      </Text>

                      {/* Range Slider */}

                      <View
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          marginRight: 10,
                          alignItems: 'stretch',
                          justifyContent: 'center',
                        }}>
                        <Slider
                          animateTransitions={true}
                          maximumTrackTintColor="#7f7f7f"
                          minimumTrackTintColor="#4499ff"
                          thumbStyle={{
                            backgroundColor: 'white',
                            borderRadius: 30 / 2,
                            borderWidth: 1,
                            height: 30,
                            shadowColor: 'black',
                            shadowOffset: {width: 0, height: 2},
                            borderColor: '#4499ff',
                            shadowOpacity: 0.3,
                            shadowRadius: 1,
                            width: 30,
                            elevation: 5,
                          }}
                          trackStyle={{
                            height: 4.5,
                            borderRadius: 10,
                          }}
                          minimumValue={0}
                          maximumValue={100000}
                          step={1}
                          value={this.state.max_price_filter}
                          onValueChange={this.rangeSliderHandle}
                          onSlidingComplete={() => {
                            this.filterList(
                              this.state.customer_id,
                              this.state.title,
                              this.state.auction_type,
                              this.state.category_id,
                              this.state.sub_category_id,
                              this.state.brand_id,
                              this.state.model_id,
                              this.state.max_price_filter,
                            );
                          }}
                        />
                        {/* <Text>Value: {this.state.value}</Text> */}
                      </View>
                    </View>
                  </ScrollView>
                </Modal>
              </View>

              {/* Notification Icon */}

              {/* Profile Icon */}

              <Appbar.Action
                animated={false}
                icon={() => (
                  <View>
                    <Image
                      style={{
                        height: 24,
                        width: 22,
                        alignSelf: 'flex-end',
                        tintColor: '#505B98',
                      }}
                      source={images.my_profile}
                    />
                  </View>
                )}
                onPress={() => {
                  if (this.state.user_id === null) {
                    this.goToLogin();
                  } else {
                    this.props.navigation.navigate('profile');
                  }
                }}
              />

              <Modal
                animationType="fade"
                visible={this.state.notificationModalVisible}
                // transparent={true}
                onRequestClose={() =>
                  this.setNotificationModalVisible(
                    !this.state.notificationModalVisible,
                  )
                }>
                <ScrollView
                  style={{
                    margin: 8,
                    marginTop: '5%',
                  }}>
                  <IconButton
                    color="#505B98"
                    style={{alignSelf: 'flex-end'}}
                    onPress={() => this.setNotificationModalVisible(false)}
                    icon="close"
                  />

                  {this.state.notificationList &&
                    this.state.notificationList.length > 0 &&
                    this.state.notificationList.map(itemNotificationList => (
                      <View
                        style={{
                          borderRadius: 10,
                          elevation: 10,
                          backgroundColor: 'white',
                          margin: 10,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              borderColor: '#505B98',
                              borderWidth: 1,
                              borderRadius: 50,
                              padding: 2,
                              // marginRight: 10
                            }}>
                            <Image
                              style={{height: 45, width: 45}}
                              resizeMode="contain"
                              source={images.ic_harjj_logo}
                            />
                          </View>

                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: 'Cairo-SemiBold',
                              width: 180,
                              textAlign: 'left',
                            }}
                            ellipsizeMode={'tail'}
                            numberOfLines={1}>
                            {itemNotificationList.title}
                          </Text>

                          <TouchableOpacity
                            onPress={() => {
                              Actions.live_product_details({
                                product_id: itemNotificationList.product_id,
                                ...this.setNotificationModalVisible(false),
                              });
                            }}
                            style={{
                              backgroundColor: '#505B98',
                              borderRadius: 8,
                              padding: 5,
                              width: 80,
                              marginTop: 10,
                            }}>
                            <Text
                              style={{
                                fontSize: 18,
                                fontFamily: 'Cairo-Bold',
                                textAlign: 'center',
                                color: 'white',
                              }}
                              numberOfLines={1}>
                              {strings.view}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {/* </View> */}
                      </View>
                    ))}
                </ScrollView>
              </Modal>
            </Appbar.Header>

            <View>
              {/* Search Bar */}

              <View
                style={{
                  marginBottom: 4,
                  marginHorizontal: 15,
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
                  ref={input => {
                    this.textInput = input;
                  }}
                  textAlignVertical="center"
                  value={this.state.title}
                  onChangeText={itemValue => {
                    // this.Search_Fun({ itemValue })
                    this.setState({title: itemValue});
                  }}
                  onSubmitEditing={() => {
                    this.setState(
                      {
                        productList: [],
                        last_id: 0,
                        search_icon: false,
                      },
                      () => {
                        this.filterList(
                          this.state.customer_id,
                          this.state.title,
                          this.state.auction_type,
                          this.state.category_id,
                          this.state.sub_category_id,
                          this.state.brand_id,
                          this.state.model_id,
                          this.state.max_price_filter,
                        );
                      },
                    );
                  }}
                  keyboardType="default"
                  returnKeyType="search"
                />

                {/* Search Button */}

                {(() => {
                  if (this.state.search_icon) {
                    return (
                      <TouchableOpacity
                        style={{justifyContent: 'center'}}
                        onPress={() => {
                          if (this.state.title !== '') {
                            Keyboard.dismiss();
                            this.setState(
                              {
                                productList: [],
                                last_id: 0,
                                search_icon: false,
                              },
                              () => {
                                this.filterList(
                                  this.state.customer_id,
                                  this.state.title,
                                  this.state.auction_type,
                                  this.state.category_id,
                                  this.state.sub_category_id,
                                  this.state.brand_id,
                                  this.state.model_id,
                                  this.state.max_price_filter,
                                );
                              },
                            );
                          }
                        }}>
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
                      </TouchableOpacity>
                    );
                  } else {
                    return (
                      <IconButton
                        color="#505B98"
                        style={{
                          alignSelf: 'flex-end',
                          height: 30,
                          width: 30,
                          marginHorizontal: 5,
                        }}
                        onPress={() => {
                          Keyboard.dismiss();
                          this.setState(
                            {
                              search_icon: true,
                              productList: [],
                              last_id: 0,
                              title: '',
                            },
                            () => {
                              this.filterList(
                                this.state.customer_id,
                                this.state.title,
                                this.state.auction_type,
                                this.state.category_id,
                                this.state.sub_category_id,
                                this.state.brand_id,
                                this.state.model_id,
                                this.state.max_price_filter,
                              );
                            },
                          );
                        }}
                        icon="close"
                      />
                    );
                  }
                })()}
              </View>
            </View>
          </View>

          <FlatList
            onRefresh={() => this._onRefresh()}
            refreshing={this.state.refreshing}
            data={this.state.productList}
            numColumns={2}
            keyExtractor={item => item.product_id}
            ListEmptyComponent={this.EmptyList}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (!this.state.onEndReachedCalledDuringMomentum) {
                this.setState({
                  progress: true,
                  onEndReachedCalledDuringMomentum: true,
                });
                this.filterListFun();
              }
            }}
            onMomentumScrollBegin={() => {
              this.setState({
                progress: true.valueOf,
                onEndReachedCalledDuringMomentum: false,
              });
            }}
            ListFooterComponent={() => {
              if (this.state.progress === true) {
                return <ActivityIndicator color={'red'} size={'large'} />;
              } else {
                return null;
              }
            }}
            renderItem={({item}) => (
              <View style={{flex: 1, alignItems: 'center', margin: 8}}>
                <TouchableOpacity
                  // onPress={this.openProductDetail}
                  onPress={() => {
                    // Actions.product_details({ product_id: item.product_id });
                    console.log(item.auction_type);
                    console.log(item.title, 'pressed');
                    console.log(item.product_id, ' pressed');
                    if (item.auction_type && item.auction_type === 'online') {
                      console.log('item.add_by');
                      console.log(item.add_by);
                      Actions.live_product_details({
                        product_id: item.product_id,
                        customer_id: item.add_by,
                      });
                    } else if (
                      item.auction_type &&
                      item.auction_type === 'golivenow'
                    ) {
                      console.log('item.add_by');
                      console.log(item.add_by);
                      Actions.live_product_details({
                        product_id: item.product_id,
                        customer_id: item.add_by,
                      });
                    } else {
                      console.log('item.add_by');
                      console.log(item.add_by);
                      Actions.product_details({
                        product_id: item.product_id,
                        customer_id: item.add_by,
                      });
                    }
                  }}
                  style={styles.GridViewContainer}>
                  {/* Product Image */}

                  <View>
                    <FastImage
                      style={styles.ImageStyle}
                      source={{uri: item.product_img}}
                    />
                  </View>

                  {/* Product Title */}

                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.titleText}>
                    {item.title}
                  </Text>

                  {/* Product Date */}

                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 3,
                        alignSelf: 'flex-start',
                      }}>
                      <Image
                        style={{height: 24, width: 24}}
                        source={images.date}
                      />

                      <Text
                        style={{
                          fontFamily: 'Cairo-SemiBold',
                          fontSize: 10,
                          width: 130,
                          textAlign: 'justify',
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={1}>
                        {item.start_date_time} - {item.end_date_time}
                      </Text>
                    </View>

                    {/* Product Time */}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        alignSelf: 'flex-start',
                      }}>
                      <Image
                        style={{height: 28, width: 24}}
                        source={images.time}
                      />
                      {(() => {
                        var start_time =
                          item.start_date_time +
                          'T' +
                          item.start_time +
                          '.000Z';
                        var start_time_utc = moment(start_time);
                        var getTimeZone = RNLocalize.getTimeZone();
                        var start_time_temp = start_time_utc.tz(getTimeZone);

                        var final_start_time =
                          start_time_temp.format('hh:mm:ss');

                        // CONVERT END TIME

                        var end_time =
                          item.start_date_time + 'T' + item.end_time + '.000Z';
                        var end_time_utc = moment(end_time);
                        var end_time_temp = end_time_utc.tz(getTimeZone);

                        var final_end_time = end_time_temp.format('hh:mm:ss');

                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 10,
                              marginTop: 5,
                              width: 130,
                              textAlign: 'justify',
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {final_start_time == 'Invalid date'
                              ? ''
                              : final_start_time}{' '}
                            -{' '}
                            {final_end_time == 'Invalid date'
                              ? ''
                              : final_end_time}
                          </Text>
                        );
                      })()}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

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
                onPress={() => {
                  if (this.state.user_id === null) {
                    this.goToLogin();
                  } else {
                    this.getActionSheet();
                  }
                }}>
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
            <BottomNav icon={images.searchIcon} color="white" />
          </View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: 2,
    marginTop: 10,
    marginBottom: '45%',
    backgroundColor: 'white',
  },

  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: 'white',
    elevation: 5,
    height: 210,
    width: 170,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ImageStyle: {
    height: 85,
    width: 100,
    borderRadius: 5,
    resizeMode: 'contain',
    marginVertical: '5%',
    marginHorizontal: '5%',
  },

  btn: {
    alignItems: 'center',
    flex: 1,
  },
  btnActive: {
    alignItems: 'center',
    flex: 1,
  },
  activetext: {
    color: '#2D2C71',
    fontFamily: 'Cairo-SemiBold',
    alignSelf: 'center',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2C71',
  },
  text: {
    color: 'black',
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    textAlign: 'justify',
  },

  titleText: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    textAlign: 'center',
    // marginRight: 10,
    width: 135,
  },
});

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Search);
