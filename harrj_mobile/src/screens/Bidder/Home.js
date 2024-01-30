import {Slider} from '@miblanchard/react-native-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActionSheet} from 'react-native-cross-actionsheet';
import * as Keychain from 'react-native-keychain';
import ReactNativeModal from 'react-native-modal';
import {Appbar, IconButton, Provider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import Share from 'react-native-share';
import SimpleToast from 'react-native-simple-toast';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {getAdBanners} from '../../actions/bidder/getAdBanner.action';
import {getCategoriesSubCategories} from '../../actions/bidder/getCategories.action';
import {getBrands} from '../../actions/getBrands.action';
import {getModelAction} from '../../actions/getModel.action';
import {getProductListAction} from '../../actions/getProductList.action';
import {getSubCategories} from '../../actions/getSubCategories.action';
import {getNotificationService} from '../../actions/get_notification.action';
import images from '../../assets/images/images';
import BottomNav from '../../components/BottomNavigation';
import strings from '../../translations/translateConstant';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import FastImage from 'react-native-fast-image';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';

var applanguage = '';
var lanStaticData = [];

let categories_colors = [
  '#bed3cb',
  '#ddccff',
  '#fbcece',
  '#add8e6',
  '#fedcdc',
  '#ACDDDE',
  '#F7DB92',
  '#DBD0CC',
  '#FFA382',
];
// for onRefresh
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

class Home extends React.Component {
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
      logOut: [],
      user_id: '',
      progress: false,
      refreshing: false,
      drawer_open: false,
      token: '',
      email_id: '',
      password: '',
      error: '',
      search_string: '',
      categorieList: [],
      categorieSubCategoryList: [],
      categorieDataList: [],
      subCategorieList: [],
      adBannerList: [],
      adBannerArray: [],
      applanguage: '',
      lanStaticData: [],
      customer_id: '',
      title: '',
      auction_type: 'online',
      category_id: [],
      sub_category_id: [],
      brand_id: [],
      model_id: [],
      city_id: [],
      max_price_filter: 0,
      isPrice: false,
      value: 0,
      price_range: 0,
      productList: [],
      modelList: [],
      activeIndex: 0,
      isVisible: false,
      // CheckBox
      isChecked: false,
      watchCheck: false,
      mobileCheck: false,
      laptop: false,
      camera: false,
      vehicle: false,
      setToggleCheckBox: false,
      modalVisible: false,
      createAdModalVisible: false,

      notificationModalVisible: false,
      notification_auction_type: 'onlivelive',
      notificationList: [],

      toggleCheckBoxVal: {},
      toggleCheckBoxBrandVal: {},
      toggleCheckBoxSub_CatVal: {},
      toggleCheckBoxModelVal: {},

      isSideMenuVisible: false,

      subfilteredArray: [],
      BrandsList: [],
      brandfilteredArray: [],
      modelfilteredArray: [],
      // UniversalLangString: 'Arabic',
      stateName: {
        names: [
          {
            id: 0,
            name: strings.LiveBid,
          },
          {
            id: 1,
            name: strings.NormalBid,
          },
        ],
      },
      selectedLan: true,
      userName: '',
      last_id: 0,
      page_records: 10,
      is_first_call: true,
      onEndReachedCalledDuringMomentum: true,
      start_time: '',
      end_time: '',
    };

    // this.getStoredData = this.getStoredData.bind(this);
    this.getAdBanners = this.getAdBanners.bind(this);
    // this.getCategory = this.getCategory.bind(this);
    this.getCategorySubCategory = this.getCategorySubCategory.bind(this);
    this.getSubCategory = this.getSubCategory.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
    this.onPressLogout = this.onPressLogout.bind(this);
    this.openNormalBid = this.openNormalBid.bind(this);
    this.openExplorer2 = this.openExplorer2.bind(this);
    this.openLiveBid = this.openLiveBid.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.openProduct = this.openProduct.bind(this);
    this.openAboutHarrj = this.openAboutHarrj.bind(this);
    this.openMyorder = this.openMyorder.bind(this);
    this.openContactus = this.openContactus.bind(this);
    this.openLiveAuction = this.openLiveAuction.bind(this);
    this.openPrivacy = this.openPrivacy.bind(this);
    this.openCreateAd = this.openCreateAd.bind(this);
    this.toggleCheckBox_Category = this.toggleCheckBox_Category.bind(this);
    this.toggleCheckBox_Brand = this.toggleCheckBox_Brand.bind(this);
    this.toggleCheckBox_SubCat = this.toggleCheckBox_SubCat.bind(this);
    this.toggleCheckBox_Model = this.toggleCheckBox_Model.bind(this);
    this.getModelList = this.getModelList.bind(this);
    this.storeLang = this.storeLang.bind(this);
  }

  componentDidMount = async () => {
    this.getUserName();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    // strings.setLanguage('ar');

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
        if (value != null) {
          // console.log('componentDidmount if');
          // console.log(value);
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
          // console.log('componentDidmount  elses');
          this.setState({UniversalLangString: 'Arabic', selectedLan: true});
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }

    this.setState({});

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

    await this.getCategorySubCategory();
  };

  componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  // get User Name

  getUserName = () => {
    AsyncStorage.getItem('userName').then(value => {
      console.log('value');
      console.log(value);
      this.setState({userName: value});
    });

    AsyncStorage.getItem('userId').then(value => {
      console.log('user_id');
      console.log(value);
      this.setState({user_id: value});
    });
  };

  handleBackButton = () => {
    return true;
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

  // open Drawer Modal

  toggleSideMenu = () =>
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});

  // go to Bids

  goToMyBids = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.replace('my_order');
  };

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

  // go to signin after logout

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

  goToLogin = () => {
    this.setState({alert: !this.state.alert});
  };

  // filter Modal

  setModalVisible = visible => {
    this.getCategorySubCategory();
    this.setState({
      modalVisible: visible,
    });
    this.componentDidMount();
  };

  // Notification Modal

  setNotificationModalVisible = visible => {
    this.getNotification();
    this.setState({notificationModalVisible: visible});
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
  };

  // Search for Filter

  Search_Fun = itemValue => {
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
    // this._onRefresh()
  };

  // Check Box for Categories

  toggleCheckBox_Category = async check_id => {
    var category_id_arry = this.state.category_id;

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

    await this.getSubCategory();
    await this.getBrands();
    // await this.getModelList();
  };

  // Toggle CheckBox for Brand

  toggleCheckBox_Brand = check_id => {
    var brand_id_arry = this.state.brand_id;

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
      toggleCheckBoxModelVal: {},
      brand_id_arry: [],
      brandfilteredArray: [],
      BrandsList: [],
      last_id: 0,
      productList: [],
      progress: true,
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
    // this.getModelList();
    this.getBrands();
  };

  // Toggle CheckBox for Model

  toggleCheckBox_Model = check_id => {
    var model_id_arry = this.state.model_id;

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

  // hide show Filter
  handleCheckBox = () => {
    console.log('Pressed');
  };

  openMenu = () => this.setState({isVisible: true});

  closeMenu = () => this.setState({isVisible: false});

  tabChangeFunc = id => {
    var auctionTypeStr = 'online';
    if (id === 0) {
      auctionTypeStr = 'online';
    } else {
      if (id === 1) {
        auctionTypeStr = 'golivenow';
      }
    }
    this.setState({
      activeIndex: id,
      auction_type: auctionTypeStr,
      last_id: 0,
      productList: [],
      progress: true,
    });
    this.filterList(
      this.state.customer_id,
      this.state.title,
      auctionTypeStr,
      this.state.category_id,
      this.state.sub_category_id,
      this.state.brand_id,
      this.state.model_id,
      this.state.max_price_filter,
    );
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

          console.log('authToken');
          console.log(authToken);
        })
        .catch(error => {
          console.log('dispatch error: ');
          console.log(error);
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
          this.setState({progress: true});

          if (this.state.is_first_call) {
            this.setState({
              productList: responseData,
              is_first_call: false,
              last_id: responseData[responseData.length - 1].product_id,
            });
          } else {
            var productListArry = this.state.productList;
            productListArry = productListArry.concat(responseData);
            this.setState({progress: false});
            this.setState({
              productList: productListArry,
              last_id: responseData[responseData.length - 1].product_id,
            });
          }
        } else {
          if (this.state.is_first_call) {
            this.setState({productList: [], is_first_call: false});
            this.setState({progress: false});
          }
          this.setState({progress: false});
        }
      });
    } catch (errorCatch) {
      console.log('errorCatch');
      console.log(errorCatch);
      SimpleToast.show(strings.someError, SimpleToast.SHORT);
      this.setState({progress: false});
    }
  };

  // Change Language

  langFun() {
    AsyncStorage.getItem('AppLanguage').then(value => {
      if (value != null) {
        this.setState({applanguage: value});
        applanguage = value;
      } else {
        console.log('elses');
      }
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
              this.setState({
                UniversalLangString: 'Arabic',
                selectedLan: true,
              });
              this.componentDidMount();
            } else {
              if (value === 'en') {
                strings.setLanguage('ar');
                AsyncStorage.setItem('UniversalAppLanguage', 'ar');
                this.setState({
                  UniversalLangString: 'English',
                  selectedLan: false,
                });
                this.componentDidMount();
              } else {
                console.log('if else');
                strings.setLanguage('en');
                AsyncStorage.setItem('UniversalAppLanguage', 'en');
                this.setState({
                  UniversalLangString: 'Arabic',
                  selectedLan: true,
                });
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
  };

  openProduct = () => {
    this.props.navigation.navigate('products');
  };

  openSearch = () => {
    Actions.replace('search');
  };

  openNormalBid = () => {
    Actions.replace('normal_bid');
  };

  openExplorer2 = () => {
    this.props.navigation.navigate('explore');
  };

  openLiveBid = () => {
    Actions.replace('live_bid');
  };

  toggleOpen = () => {
    this.setState({drawer_open: !this.state.drawer_open});
  };
  openAboutHarrj = () => {
    Actions.about_harrj();
  };
  openMyorder = () => {
    Actions.my_order();
  };
  openContactus = () => {
    Actions.contact_us();
  };
  openPrivacy = () => {
    Actions.privacy_policy();
  };

  onPressButton = () => {
    Actions.product_details();
  };

  openCreateAd = () => {
    // this.setCreateAdModalVisible(false)
    Actions.create_ad();
  };

  openLiveAuction = () => {
    this.setCreateAdModalVisible(false);
    Actions.live_auction();
  };

  openLiveNow = () => {
    Actions.live_now();
  };

  openSchedule_live = () => {
    Actions.schedule_live();
  };

  // Log out

  onPressLogout = () => {
    Keychain.getGenericPassword().then(async credentials => {
      Keychain.resetGenericPassword();
      try {
        AsyncStorage.setItem('token', '');
        AsyncStorage.setItem('userId', '');
        AsyncStorage.setItem('userName', '');
        AsyncStorage.setItem('userRole', '');
      } catch (e) {
        console.log(e);
      }
    });
    this.props.navigation.navigate('sign_in');
  };

  getAdBanners = () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      dispatch(getAdBanners(this.token))
        .then(response => {
          console.log('dispatch response get banners: ');
          console.log(response);
          if (response && typeof response !== 'undefined' && response !== '') {
            this.setState({progress: false});
            var responseData = response.data;
            var tempArry = [];
            if (
              responseData &&
              typeof responseData !== 'undefined' &&
              responseData !== ''
            ) {
              for (var i = 0; i < responseData.length; i++) {
                tempArry.push(responseData[i].banner_img);
              }
            }

            this.setState({adBannerList: tempArry});
          } else {
            this.setState({progress: false});
            // Alert.alert('something went wrong..!!');
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

  // Getting Category

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
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        }
        this.getBrands();
      });
    } catch (errorCatch) {
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

  // Getting Brand

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
      });
    } catch (errorCatch) {
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
          console.log('Keychain Model List dispatch error: ');
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
      console.log('Model List error: ' + errorCatch);
      this.setState({progress: false});
    }
  };

  EmptyList = () => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 400,
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

  ListHeaderComponentFun = () => (
    <View>
      {/* Catergories List  */}

      <View style={{marginVertical: 10}}>
        <Text
          style={{
            fontFamily: 'Cairo-SemiBold',
            fontSize: 22,
            marginLeft: 15,
            textAlign: 'justify',
          }}>
          {strings.Categories}
        </Text>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {this.state.categorieSubCategoryList &&
          this.state.categorieSubCategoryList.length > 0 &&
          this.state.categorieSubCategoryList.map(
            itemcategorieSubCategoryList => (
              <View>
                <View style={{margin: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.toggleCheckBox_Category(
                        itemcategorieSubCategoryList.category_id,
                      );
                      console.log(itemcategorieSubCategoryList.category_name);
                    }}
                    style={styles.unSelectCat}>
                    <Image
                      style={styles.unSelectCatImg}
                      source={{
                        uri: itemcategorieSubCategoryList.category_img,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-SemiBold',
                        color: '#000000',
                        marginHorizontal: 15,
                        marginTop: 15,
                        fontSize: 18,
                      }}>
                      {this.state.selectedLan == true
                        ? itemcategorieSubCategoryList.category_name
                        : itemcategorieSubCategoryList.category_name_arabic}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ),
          )}
      </ScrollView>

      {/* Live and Normal Bids Tab */}

      <View
        style={{
          height: 70,
          backgroundColor: '#E2E0E1',
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          key={0}
          onPress={() => {
            this.tabChangeFunc(0, strings.LiveBid);
          }}
          style={this.state.activeIndex === 0 ? styles.btnActive : styles.btn}>
          <Text
            style={
              this.state.activeIndex === 0 ? styles.activetext : styles.text
            }>
            {' '}
            {strings.LiveAuction}{' '}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={1}
          onPress={() => {
            this.tabChangeFunc(1, strings.NormalBid);
          }}
          style={this.state.activeIndex === 1 ? styles.btnActive : styles.btn}>
          <Text
            style={
              this.state.activeIndex === 1 ? styles.activetext : styles.text
            }>
            {' '}
            {strings.NormalBid}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  renderItem = ({item}) => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        margin: 8,
        elevation: 10,
      }}>
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 35,
          backgroundColor: 'white',
          elevation: 5,

          width: 180,
        }}
        onPress={() => {
          console.log(item.auction_type);
          console.log(item.title, 'pressed');
          console.log(item.product_id, ' pressed');
          console.log(item.add_by);
          if (item.auction_type && item.auction_type === 'online') {
            Actions.live_product_details({
              product_id: item.product_id,
              customer_id: item.add_by,
            });
          } else if (item.auction_type && item.auction_type === 'golivenow') {
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
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between',
              // width:"100%"
              width: 180,
            }}>
            {/* Auction Type */}

            {(() => {
              if (item.auction_type === 'offline') {
                return <></>;
              } else {
                return (
                  <View
                    style={{
                      backgroundColor: '#FF2133',
                      // width:'50%',
                      width: 110,
                      height: 40,
                      alignSelf: 'flex-start',
                      // borderTopLeftRadius: 35, borderBottomEndRadius: 35,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    {(() => {
                      if (
                        item.auction_type === 'online' &&
                        item.meeting_status === 0
                      ) {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 18,
                              color: 'white',
                              textAlignVertical: 'center',
                              alignSelf: 'center',
                            }}>
                            {strings.Schedule}
                          </Text>
                        );
                      } else if (
                        item.auction_type === 'golivenow' &&
                        item.meeting_status === 1
                      ) {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 18,
                              color: 'white',
                              textAlignVertical: 'center',
                              alignSelf: 'center',
                            }}>
                            {strings.Live}
                          </Text>
                        );
                      } else if (
                        item.auction_type === 'online' &&
                        item.meeting_status === 1
                      ) {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 18,
                              color: 'white',
                              textAlignVertical: 'center',
                              alignSelf: 'center',
                            }}>
                            {strings.Live}
                          </Text>
                        );
                      } else if (item.meeting_status === 2) {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 18,
                              color: 'white',
                              textAlignVertical: 'center',
                              alignSelf: 'center',
                            }}>
                            {strings.Ended}
                          </Text>
                        );
                      } else if (
                        item.auction_type === 'golivenow' &&
                        item.meeting_status === 0
                      ) {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 18,
                              color: 'white',
                              textAlignVertical: 'center',
                              alignSelf: 'center',
                            }}>
                            {strings.NotStarted}
                          </Text>
                        );
                      } else {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 18,
                              color: 'white',
                              textAlignVertical: 'center',
                              alignSelf: 'center',
                            }}>
                            {strings.Normal}
                          </Text>
                        );
                      }
                    })()}
                  </View>
                );
              }
            })()}
          </View>

          {/* Product Image */}

          <View style={{alignItems: 'center', marginTop: 10}}>
            <FastImage
              style={styles.ImageStyle}
              source={{
                uri: item.product_img,
              }}
            />
          </View>

          {/* Product Title, Number of bids, date and time, Price, rating */}

          <View style={{width: 150, flex: 1, marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={styles.titleText}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginLeft: 5, marginBottom: 10}}>
            <View style={{flexDirection: 'column', alignSelf: 'flex-start'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 3,
                  alignSelf: 'flex-start',
                }}>
                <Image
                  style={{height: 24, width: 24, borderRadius: 5}}
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
                  {item.start_date_time}
                </Text>
              </View>

              {(() => {
                if (item.auction_type === 'offline') {
                  return <></>;
                } else {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        alignSelf: 'flex-start',
                        marginLeft: 5,
                      }}>
                      <Image
                        style={{height: 28, width: 24, borderRadius: 5}}
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
                  );
                }
              })()}

              <View
                style={{
                  marginLeft: 10,
                  marginBottom: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 140,
                }}>
                {(() => {
                  if (
                    typeof item.max_bid_amount === 'object' &&
                    item.auction_type === 'offline'
                  ) {
                    return (
                      <Text
                        style={styles.price}
                        ellipsizeMode="tail"
                        numberOfLines={1}>
                        {strings.priceSymbol} 0
                      </Text>
                    );
                  } else if (item.auction_type === 'offline') {
                    return (
                      <Text
                        style={styles.price}
                        ellipsizeMode="tail"
                        numberOfLines={1}>
                        {strings.priceSymbol}
                        {item.max_bid_amount}
                      </Text>
                    );
                  } else {
                    return <></>;
                  }
                })()}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  render() {
    const {productList} = this.state;

    return (
      <Provider>
        <View style={{backgroundColor: 'white', flex: 1, width: '100%'}}>
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

          {/* App Bar */}

          <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
            {/* Drawer Icon */}

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
                          {/* <Text>{itemcategorieSubCategoryList.category_name}</Text> */}
                          <Text style={{fontFamily: 'Cairo-SemiBold'}}>
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
                          {/* <Text>{itemSubCategorieList.sub_category_name}</Text> */}
                          <Text style={{fontFamily: 'Cairo-SemiBold'}}>
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
                          {/* <Text>{itemBrandsList.brand_name}</Text> */}
                          <Text style={{fontFamily: 'Cairo-SemiBold'}}>
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
                              this.toggleCheckBox_Brand(itemBrandsList.brand_id)
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
                          {/* <Text>{itemModelList.model_name}</Text> */}
                          <Text style={{fontFamily: 'Cairo-SemiBold'}}>
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
                              this.toggleCheckBox_Model(itemModelList.model_id)
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
                      {strings.Pricerange}({this.state.max_price_filter})
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
                        onValueChange={value => {
                          this.rangeSliderHandle(value);
                        }}
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

                  {/* <View style={{
                    backgroundColor: 'red', height: 15, width: 15, borderRadius: 10,
                    alignSelf: 'flex-end', position: 'absolute',
                  }}>
                  </View> */}
                </View>
              )}
              onPress={() => {
                if (this.state.user_id === null) {
                  // console.log(this.state.user_id);
                  this.goToLogin();
                } else {
                  this.props.navigation.navigate('profile');
                }
              }}
            />
            {/* onPress={() => { this.setNotificationModalVisible(true) }} /> */}

            {/* Notification Modal */}

            <Modal
              animationType="fade"
              visible={this.state.notificationModalVisible}
              // visible={true}
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
                justifyContent: 'center',
                alignSelf: 'center',
                flexDirection: 'row',
                borderRadius: 15,
                borderColor: '#505B98',
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

          <FlatList
            // style={{ marginBottom: '50%' }}
            keyExtractor={item => item.product_id}
            refreshControl={
              <RefreshControl
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.refreshing}
                colors={['#505B98', '#EF493E']}
              />
            }
            numColumns={2}
            data={productList}
            ListHeaderComponent={this.ListHeaderComponentFun}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={this.EmptyList}
            ListFooterComponent={() => {
              if (this.state.progress === true) {
                return <ActivityIndicator color={'red'} size={'large'} />;
              } else {
                return null;
              }
            }}
            onEndReached={() => {
              console.warn('Scrolling end');
              if (!this.state.onEndReachedCalledDuringMomentum) {
                this.setState({
                  progress: true,
                  onEndReachedCalledDuringMomentum: true,
                });
                this.filterListFun();
              }
            }}
            onMomentumScrollBegin={() => {
              console.warn('Scrolling begin');
              this.setState({
                onEndReachedCalledDuringMomentum: false,
              });
            }}
            // Live and Normal Bids Lists

            renderItem={this.renderItem}
          />

          <ReactNativeModal
            isVisible={this.state.isSideMenuVisible}
            animationIn="slideInLeft" // Has others, we want slide in from the left
            animationOut="slideOutLeft" // When discarding the drawer
            onBackdropPress={this.toggleSideMenu} // Android back press
            onSwipeComplete={this.toggleSideMenu} // Swipe to discard
            useNativeDriver // Faster animation
            hideModalContentWhileAnimating // Better performance, try with/without
            propagateSwipe // Allows swipe
            style={styles.sideMenuStyle}>
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
                        height: 20,
                        width: 20,
                        tintColor: 'black',
                        marginLeft: 10,
                      }}
                      source={images.drawerHome}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'black',
                        marginLeft: 20,
                      }}>
                      {strings.Home}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* My Bids Button */}

                {(() => {
                  if (this.state.user_id === null) {
                    return <></>;
                  } else {
                    return (
                      <>
                        <TouchableOpacity
                          style={{
                            marginHorizontal: 10,
                            alignItems: 'flex-start',
                            borderRadius: 5,
                            marginTop: 15,
                            height: 40,
                            justifyContent: 'center',
                          }}
                          onPress={this.goToMyBids}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                height: 24,
                                width: 24,
                                tintColor: 'white',
                                marginLeft: 7,
                              }}
                              source={images.drawerBids}
                            />
                            <Text
                              style={{
                                fontFamily: 'Cairo-Bold',
                                fontSize: 16,
                                color: 'white',
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
                      </>
                    );
                  }
                })()}

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
                  onPress={() => {
                    if (this.state.user_id === null) {
                      Actions.sign_in();
                    } else {
                      this.goToSignIn();
                    }
                  }}>
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
                    {(() => {
                      if (this.state.user_id === null) {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-Bold',
                              fontSize: 16,
                              color: 'white',
                              marginLeft: 20,
                            }}>
                            {strings.Login}
                          </Text>
                        );
                      } else {
                        return (
                          <Text
                            style={{
                              fontFamily: 'Cairo-Bold',
                              fontSize: 16,
                              color: 'white',
                              marginLeft: 20,
                            }}>
                            {strings.signout}
                          </Text>
                        );
                      }
                    })()}
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
                  onPress={() => {
                    this.storeLang();
                  }}>
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
                    fontFamily: 'Cairo-Bold',
                    marginTop: 20,
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
            <BottomNav icon={images.homeIcon} color="white" />

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

            <BottomNav
              icon={images.searchIcon}
              color="grey"
              onPress={this.openSearch}
            />
          </View>
        </View>
      </Provider>
    );
  }
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    marginHorizontal: 5,
    elevation: 5,
    height: 40,
    width: 130,
  },

  actionButtonIcon: {
    fontSize: 20,
    // height: 30,
    color: 'white',
  },

  btnActive: {
    justifyContent: 'center',
    backgroundColor: '#505B98',
    borderRadius: 50,
    marginHorizontal: 5,
    elevation: 5,
    height: 40,
    width: 130,
  },
  activetext: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
  },
  text: {
    color: 'black',
    fontFamily: 'Cairo-SemiBold',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
  },

  container: {
    justifyContent: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },

  GridViewContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    elevation: 2,
    flexDirection: 'row',
    paddingVertical: 5,
    overflow: 'hidden',
  },
  ImageStyle: {
    height: 73,
    width: 120,
    borderRadius: 5,
    resizeMode: 'contain',
    marginVertical: '5%',
    marginHorizontal: '5%',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 5,
  },
  titleText: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    marginRight: 10,
    // width: 90,
    textAlign: 'justify',
  },
  regularText: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    color: 'white',
  },
  mediumText: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    marginTop: 10,
    textAlignVertical: 'center',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    width: 90,
    textAlign: 'justify',
  },
  priceText: {
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
  },
  button: {
    backgroundColor: '#CC1212',
    borderRadius: 30,
    height: 30,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  filter_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    height: '100%',
  },
  modal: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#505B98',
    width: '70%',
    marginTop: 15,
    marginHorizontal: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 55,
    borderWidth: 1,
    borderColor: '#505B98',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 250,
  },
  modal: {
    backgroundColor: 'transparent',
    height: '100%',
  },

  sideMenuStyle: {
    margin: 0,
    width: width * 0.75, // SideMenu width
  },
  unSelectCat: {
    elevation: 8,
    borderRadius: 18,
    backgroundColor: '#E2E0E1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  unSelectCatImg: {
    height: 50,
    width: 100,
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  selectCat: {
    elevation: 8,
    borderRadius: 18,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  selectCatImg: {
    height: 50,
    width: 100,
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    opacity: 0.5,
  },
});

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Home);
