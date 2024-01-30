import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Button,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {Appbar, IconButton, Menu, Provider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import ValidationComponent from '../../../ValidationComponent';
import {getProductListAction} from '../../actions/getProductList.action';
import images from '../../assets/images/images';
import {Checkbox} from 'react-native-paper';
import Explore_Btn from '../../components/Explore_btn';
import BottomNav from '../../components/BottomNavigation';
import {DrawerActions} from '@react-navigation/native';
import RangeSlider from 'rn-range-slider';
import CustomCheckBox from '../../components/CustomCheckBox';
import Thumb from '../../components/Thumb';
import Rail from '../../components/Rail';
import RailSelected from '../../components/RailSelected';
import Label from '../../components/Label';
import Notch from '../../components/Notch';
import strings from '../../translations/translateConstant';
import {Modal} from 'react-native';
import ActionButton from 'react-native-circular-action-menu';
import {Alert} from 'react-native';
import {deleteAdAction} from '../../actions/deleteAds.action';
import {MyAdsListAction} from '../../actions/myAds.action';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {ImageBackground} from 'react-native';
import {Dimensions} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {ScrollView} from 'react-native-gesture-handler';
import {award_bidAction} from '../../actions/bidder/award_bid.action';
import {bidListAction} from '../../actions/bidder/bidList.action';
import {getModelAction} from '../../actions/getModel.action';
import {getBrands} from '../../actions/getBrands.action';
import {getYearAction} from '../../actions/getYear.action';
import {getSubCategories} from '../../actions/getSubCategories.action';
import {getCityAction} from '../../actions/addCity.action';
import {getCountryAction} from '../../actions/getCountry.action';
import {getCategories} from '../../actions/bidder/getCategories.action';
import {updateNormalAd} from '../../actions/update_ads.action';
import {getProductInfo} from '../../actions/getProductInfo.action';
import * as ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Linking} from 'react-native';
import Share from 'react-native-share';
import {ActionSheet} from 'react-native-cross-actionsheet';
import Video from 'react-native-video';
import SimpleToast from 'react-native-simple-toast';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import Progress from '../../components/Progress/progress';
import RBSheet from 'react-native-raw-bottom-sheet';
import {slackServiceFun} from '../../service/slack/slack';

const styles = require('../../assets/css/style');

// for onRefresh
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
class MyProducts extends ValidationComponent<{}> {
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

  // OnRefresh

  _onRefresh = () => {
    this.setState({refreshing: true}, () => {
      this.getMyAdsList();
    });
    wait(1500).then(() => {
      this.setState({refreshing: false});
    });
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      productList: [],
      productInfo: [],
      MyAdsList: [],
      refreshing: false,
      progress: false,
      loading: false,
      isChecked: false,
      search_title: '',
      title: '',
      customer_id: '',
      name: '',
      auction_type: '',
      brand_id: [],
      model_id: [],
      watchCheck: false,
      mobileCheck: false,
      laptop: false,
      camera: false,
      vehicle: false,
      modalVisible: false,
      editModalVisible: false,
      delele_List: [],
      activeIndex: 0,
      delete_id: 0,
      product_id: 0,
      isSideMenuVisible: false,
      bidderList: [],
      award_bid: [],
      award_bidList: '',
      userName: '',
      start_date_time: new Date(),
      end_date_time: new Date(),
      start_time: new Date(),
      end_time: new Date(),
      openStartDate: false,
      openEndDate: false,
      startTime: false,
      endTime: false,

      subfilteredArray: [],
      brandfilteredArray: [],
      modelfilteredArray: [],
      cityfilteredArray: [],

      resourcePath: {},
      setValue: '',
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
      model: [
        {label: 'Gran Coupé DIESEL', value: '1'},
        {label: 'Gran Coupé PETROL', value: '2'},
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
      country_Id: '',
      city_Id: '',
      modal_Id: '',
      brand_Id: '',
      category_Id: '',
      sub_category_Id: '',
      year_Id: '',
      bidCount: 0,

      bid_id: 0,
      isYear: false,
    };

    // this.getProductInfo = this.getProductInfo.bind(this);
    this.getProductList = this.getProductList.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.deleteAd = this.deleteAd.bind(this);
  }

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
            Actions.replace('create_ad');
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
                    Actions.replace('live_now');
                  },
                },
                {
                  text: strings.scheduleLive,
                  onPress: () => {
                    console.log('Schedule Live');
                    Actions.replace('schedule_live');
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
        videoQuality: 'high',
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
        videoQuality: 'high',
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

  // Search for Filter

  Search_Fun = itemValue => {
    console.log('Search Filter Console');
    console.log(itemValue);
    console.log(
      '******************************************************************************************************',
    );
    console.log(itemValue);
    console.log(itemValue.itemValue);
    this.setState({title: itemValue.itemValue});
    // this.getMyAdsList();
  };

  // Modal for Bidder List

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  // Modal for Edit

  setEditModalVisible = visible => {
    this.setState({editModalVisible: visible});
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

  // open Drawer Modal

  toggleSideMenu = () =>
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});

  // go to My Bids

  goToMyBids = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.replace('my_order');
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
              // this.componentDidMount();
            } else {
              if (value === 'en') {
                strings.setLanguage('ar');
                AsyncStorage.setItem('UniversalAppLanguage', 'ar');
                this.setState({UniversalLangString: 'English'});
                // this.componentDidMount();
              } else {
                console.log('if else');
                strings.setLanguage('en');
                AsyncStorage.setItem('UniversalAppLanguage', 'en');
                this.setState({UniversalLangString: 'Arabic'});
                // this.componentDidMount();
              }
            }
          }
        } else {
          console.log('elses');
          strings.setLanguage('en');
          AsyncStorage.setItem('UniversalAppLanguage', 'en');
          this.setState({UniversalLangString: 'Arabic'});
          // this.componentDidMount();
        }
      });
    } catch (error) {
      console.log(' Store Lang Catch error: ');
      console.log(error);
    }
    this.setState({});
    // RNRestart.Restart();
  };

  tabChangeFunc = (id, name) => {
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
      this.state.name,
      auctionTypeStr,
      this.state.category_id,
      this.state.sub_category_id,
    );
    // this.filterList(this.state.customer_id, this.state.name, this.state.auction_type, category_id_str, this.state.sub_category_id)
  };

  // get User Name

  getUserName = () => {
    AsyncStorage.getItem('userName').then(value => {
      console.log('value');
      console.log(value);
      this.setState({userName: value});
    });
  };

  componentDidMount() {
    this.getUserName();
    this._onRefresh();
    this.getMyAdsList();

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

    // this.setState({})

    // this.getProductList();

    console.log('Getting Data:');
    // this.getCategories();
    // this.getCountryFun();
    // this.getCityFun();
    // this.getSubCategoryFun();
    // this.getYearFun();
    // this.getBrandsFun();
    // this.getModelFun();
    // this.bid_ListFun();
    // this.bid_ListFun();

    //this.getProductInfo();
    // this.filterList(this.state.customer_id, this.state.name, this.state.auction_type,
    //     this.state.category_id, this.state.sub_category_id, this.state.brand_id, this.state.model_id, this.state.starting_price)
  }

  UNSAFE_componentWillMount() {}
  // componentWillUnmount() {
  //   this.getMyAdsList();
  // }

  getMyAdsList = async () => {
    this.setState({progress: true});
    var error = 'MY ADS LIST TESTING';
    var statusType = 'error';
    var errorLogData = '' + error + '';
    var screenName = 'MY ADS';
    var methodFunName = 'getMyAdsList';
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
      const {navigation, dispatch} = this.props;
      console.log('navigation getMyAdsList');
      // console.log(navigation.getParam('product_id'))

      // const { navigate } = this.props.navigation;
      // const product_ID = navigation.getParam('product_id')
      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        var customer_id = sessionData.user_id;

        // console.log(sessionData);
        // console.log('customer_id');
        // console.log(customer_id);
        // console.log('authToken');
        // console.log(authToken);

        dispatch(MyAdsListAction(authToken, customer_id, this.state.title))
          // console.log('Dispatch')

          .then(response => {
            console.log('dispatch response My Ads List: ');
            console.log(response);
            console.log(
              '***************************************************************************',
            );
            console.log(this.state.title);

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              // this.setState({ progress: false });
              this.setState({MyAdsList: response.data, progress: false});
              // this.getMyAdsList();
            } else {
              // this.setState({ progress: false });
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch(async error => {
            this.setState({progress: false});
            // console.log('My Ads List dispatch error: ');
            // console.log(error);
            // Alert.alert(error.message);
            var statusType = 'error';
            var errorLogData = '' + error + '';
            var screenName = 'MY ADS';
            var methodFunName = 'getMyAdsList';
            var noteDesc = 'dispatch try-catch';
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
      // Alert.alert(errorCatch.message);
      // console.log(errorCatch);
      var statusType = 'error';
      var errorLogData = '' + error + '';
      var screenName = 'MY ADS';
      var methodFunName = 'getMyAdsList';
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
      this.setState({progress: false});
    }
  };

  // Award Bid Function

  award_bidFun = async () => {
    try {
      const {navigation, dispatch} = this.props;
      console.log('navigation');
      // console.log(navigation.getParam('product_id'))

      // const { navigate } = this.props.navigation;
      // const product_ID = navigation.getParam('product_id')
      // console.log('product_ID');
      // console.log(product_ID);
      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        var customer_id = sessionData.user_id;
        console.log('customer_id');
        console.log(customer_id);
        console.log('authToken');
        console.log(authToken);
        // console.log('product_ID');
        // console.log(product_ID);

        dispatch(
          award_bidAction(
            authToken,
            this.state.customer_id,
            this.state.bid_id,
            this.state.product_id,
          ),
        )
          // console.log('Dispatch')
          .then(response => {
            console.log(
              ' +++++++++++++++++++++++++++ dispatch response My award_bidFun List +++++++++++++++++++++++++++: ',
            );
            console.log(response.data);
            // alert(response.message)
            SimpleToast.show(strings.bidUpdate, SimpleToast.SHORT);

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({award_bid: response.data});
            } else {
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch(error => {
            console.log('My award_bidFun List dispatch error: ');
            console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      console.log(errorCatch);
      // this.setState({ progress: false });
    }
  };

  // Bidder List Function

  bid_ListFun = async () => {
    this.setState({loading: true});
    try {
      const {navigation, dispatch} = this.props;
      console.log('navigation');
      // console.log(navigation.getParam('product_id'))

      // const { navigate } = this.props.navigation;
      // const product_ID = navigation.getParam('product_id')
      // console.log('product_ID');
      // console.log(product_ID);
      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        var customer_id = sessionData.user_id;
        console.log('authToken');
        console.log(authToken);
        // console.log('product_ID');
        // console.log(product_ID);

        dispatch(bidListAction(authToken, this.state.product_id))
          // console.log('Dispatch')
          .then(response => {
            console.log(
              '******************************* dispatch response My Ads Bidder List *******************************: ',
            );
            console.log(response.data);

            this.setState({product_id: 0});

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({bidderList: response.data, loading: false});
            } else {
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch(error => {
            console.log('My Bidder List dispatch error: ');
            console.log(error);
            this.setState({loading: false});
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      console.log('errorCatch');
      console.log(errorCatch);
      this.setState({loading: false});
    }
  };

  // Delete API

  deleteAd = async () => {
    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;

        dispatch(deleteAdAction(authToken, this.state.delete_id))
          .then(response => {
            console.log('dispatch response getProduct: ');
            console.log(response);

            this.setState({delete_id: 0});
            // this.getMyAdsList();

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({delele_List: response.data});
              this.getMyAdsList();
              SimpleToast.show(strings.successfull, SimpleToast.SHORT);
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
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
  };

  onPressDeleteConfirm = delete_id => {
    console.log('onPressDeleteConfirm: ');
    console.log(delete_id);

    this.setState({delete_id: delete_id});

    Alert.alert(strings.ConfirmDelete, strings.Areyousureyouwanttodelete, [
      {
        text: strings.Cancel,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: strings.ok, onPress: () => this.deleteAd()},
    ]);
  };

  showBidListModal = product_id => {
    console.log('product ID for Bidder List: ');
    console.log(product_id);

    this.setState({product_id: product_id});

    this.setModalVisible(true);

    this.bid_ListFun();
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
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({productInfo: response.data});
              this.setState({title: response.data[0].title});
              this.setState({country_Id: response.data[0].country_id});
              this.setState({city_Id: response.data[0].city_id});
              this.setState({category_Id: response.data[0].category_id});
              this.setState({
                sub_category_Id: response.data[0].sub_category_id,
              });
              this.setState({brand_Id: response.data[0].brand_id});
              this.setState({modal_Id: response.data[0].model_id});
              this.setState({year_Id: response.data[0].year_id});
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
              // this.setState({ start_date_time: response.data[0].start_date_time });
              // this.setState({ end_date_time: response.data[0].end_date_time });
              // this.setState({ start_time: response.data[0].startTime });
              // this.setState({ endTime: response.data[0].startTime });

              if (
                response.data[0].year_id &&
                typeof response.data[0].year_id !== 'undefined' &&
                response.data[0].year_id !== ''
              ) {
                this.setState({isYear: true});
              }
              // console.log('response.data[0].starting_price');
              // console.log(response.data[0].starting_price);

              // Country change, city change, brand change, model change

              this.getCityFun();
              this.getSubCategoryFun();
              this.getBrandsFun();
              this.getModelFun();
              this.getYearFun();
            } else {
              this.setState({progress: false});
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch(error => {
            console.log('dispatch error: ');
            console.log(error);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
    }
    // this.getCategories();
    // this.getCountryFun();
    // this.getCityFun();
    // this.getSubCategoryFun();
    // this.getYearFun();
    // this.getBrandsFun();
    // this.getModelFun();
  };

  openSearch = () => {
    // Actions.search();
    Actions.replace('search');
  };

  openNormalBid = () => {
    // Actions.normal_bid();
    Actions.replace('normal_bid');
  };

  openLiveBid = () => {
    // Actions.live_bid();
    Actions.replace('live_bid');
  };

  openHome = () => {
    // Actions.home();
    Actions.replace('home');
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

    console.log('Sub-Category Fun Item');
    console.log(item.sub_category_id);
    console.log('item.sub_category_id');
    console.log(item);
    if (item.sub_category_year_applies === 1) {
      this.setState({isYear: true});
    } else {
      this.setState({isYear: false});
    }
    // this.state.sub_category
    // isYear

    // var selected_year_data = this.state.sub_category.find(obj => obj.education_id == education_id);

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
    this.setState({model_Id: item.model_id});
    console.log('Model Fun Item');
    console.log(item.model_id);
  };

  // Create Ad button Validation

  onCreatePostValidation = () => {
    this.validate({
      video: {required: false},
      product_img1: {required: false},
      product_img2: {required: false},
      product_img3: {required: false},
      title: {required: true},
      country_Id: {required: true},
      city_Id: {required: true},
      category_Id: {required: true},
      sub_category_Id: {required: true},
      brand_Id: {required: true},
      model_Id: {required: true},
      year_Id: {required: false},
      starting_price: {required: false},
      keywords: {required: false},
      description: {required: true},
    });
    console.log('if Validation');

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
      // this.onUpdatePost();
      console.log('else Validation');
      console.log('update Successfully');
      // this.getMyAdsList();
      // this.componentDidMount();
      this.setEditModalVisible(false);
    }
  };

  // Update Ad button

  onUpdatePost = async () => {
    // console.log('*****************Product Image1*****************');
    // console.log(this.state.product_img1);

    // console.log('*****************Product ID*****************');
    // console.log(this.state.product_id);

    // console.log('*****************Title*****************');
    // console.log(this.state.title);

    // console.log('*****************Select Country ID*****************');
    // console.log(this.state.country_Id);

    // console.log('*****************Select City ID*****************');
    // console.log(this.state.city_Id);

    // console.log('*****************Select Category ID*****************');
    // console.log(this.state.category_Id);

    // console.log('*****************Select Sub-Category ID*****************');
    // console.log(this.state.sub_category_Id);

    // console.log('*****************Select Year ID*****************');
    // console.log(this.state.year_Id);

    // console.log('*****************Select Brand ID*****************');
    // console.log(this.state.brand_Id);

    // console.log('*****************Select Model ID*****************');
    // console.log(this.state.modal_Id);

    // console.log('*****************Select Starting Price*****************');
    // console.log(this.state.starting_price);

    // console.log('*****************Select Description*****************');
    // console.log(this.state.description);

    try {
      const {dispatch} = this.props;
      const {navigation} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        // title, description, keywords, category_id, sub_category_id, starting_price, video, product_img, brand_id, modal_id, city_id, country_id, year_id

        // token, product_id, title, name, description, keywords, category_id, sub_category_id, starting_price, video, product_img1, product_img2, product_img3, start_date_time, end_date_time, brand_id, model_id, city_id, country_id, start_time, end_time, year_id, auction_type
        dispatch(
          updateNormalAd(
            authToken,
            this.state.product_id,
            this.state.title,
            this.state.name,
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
            this.state.start_time
              .toTimeString()
              .replace('GMT+0530', ' ')
              .substring(0, 19),
            this.state.end_time
              .toTimeString()
              .replace('GMT+0530', ' ')
              .substring(0, 19),
            this.state.year_Id,
            this.state.auction_type,
          ),
        )
          .then(response => {
            console.log('update Normal Ad Token: ');
            console.log(authToken);
            console.log('dispatch response update Normal Ad : ');
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
              // Actions.home();
            }
          })
          .catch(error => {
            this.setState({progress: false});
            console.log('update Normal Ad  dispatch error: ');
            console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
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
            console.log('getBrand Token: ');
            console.log(authToken);
            console.log('dispatch response get: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({category: response.data});
            }
          })
          .catch(error => {
            this.setState({progress: false});
            console.log('dispatch error: ');
            console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
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
            console.log('get Country Token: ');
            console.log(authToken);
            console.log('dispatch response get: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({country: response.data});
            }
          })
          .catch(error => {
            this.setState({progress: false});
            console.log('dispatch error: ');
            console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
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
            console.log('get City Token: ');
            console.log(authToken);
            console.log('dispatch response get: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({
                city: response.data,
                cityfilteredArray: response.data,
              });
            }
            if (
              this.state.country_Id &&
              typeof this.state.country_Id !== 'undefined'
            ) {
              console.log('if ');

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              let filteredArray = this.state.city.filter(item => {
                if (this.state.country_Id === item.country_id) {
                  console.log('this.state.country_id');
                  console.log(this.state.country_Id);
                  console.log('item.country_id');
                  console.log(item.country_id);
                  console.log('if');
                  return true;
                } else {
                  console.log('this.state.country_Id');
                  console.log(this.state.country_Id);
                  console.log('item.country_id');
                  console.log(item.country_id);
                  console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                console.log(this.state.subCategorieList); */

              console.log('if filteredArray: ');
              console.log(filteredArray);

              this.setState({cityfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              console.log('else filteredArray: ');
              console.log(filteredArray);

              this.setState({cityfilteredArray: filteredArray});
              this.setState({});
            }
          })
          .catch(error => {
            this.setState({progress: false});
            console.log('dispatch error: ');
            console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
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
            console.log('getSubCategory Token: ');
            console.log(authToken);
            console.log('dispatch response getSubCategory: ');
            console.log(response);
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
              // Alert.alert('something went wrong..!!');
            }

            console.log('this.state.category_id');
            console.log(this.state.category_Id);
            console.log(typeof this.state.category_Id);
            if (
              this.state.category_Id &&
              typeof this.state.category_Id !== 'undefined'
            ) {
              console.log('if ');

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              let filteredArray = this.state.sub_category.filter(item => {
                if (this.state.category_Id === item.category_id) {
                  console.log('this.state.category_id');
                  console.log(this.state.category_Id);
                  console.log('item.category_id');
                  console.log(item.category_id);
                  console.log('if');
                  return true;
                } else {
                  console.log('this.state.category_id');
                  console.log(this.state.category_Id);
                  console.log('item.category_id');
                  console.log(item.category_id);
                  console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                console.log(this.state.subCategorieList); */

              console.log('if sub_category filteredArray: ');
              console.log(filteredArray);

              this.setState({subfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              console.log('else sub_category filteredArray: ');
              console.log(filteredArray);

              this.setState({subfilteredArray: filteredArray});
              this.setState({});
            }
          })
          .catch(error => {
            this.setState({progress: false});
            console.log('dispatch error: ');
            console.log(error);
            // Alert.alert(error.message);
          });
      });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
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
            console.log('getSubCategory Token: ');
            console.log(authToken);
            console.log('dispatch response getSubCategory: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              this.setState({progress: false});
              this.setState({year: response.data});
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
            console.log('getBrand Token: ');
            console.log(authToken);
            console.log('dispatch response getBrand: ');
            console.log(response);
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
              console.log('if ');

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              let filteredArray = this.state.brand.filter(item => {
                if (this.state.sub_category_Id === item.sub_category_id) {
                  console.log('this.state.sub_category_id');
                  console.log(this.state.sub_category_Id);
                  console.log('item.sub_category_id');
                  console.log(item.sub_category_id);
                  console.log('if');
                  return true;
                } else {
                  console.log('this.state.sub_category_id');
                  console.log(this.state.sub_category_Id);
                  console.log('item.sub_category_id');
                  console.log(item.sub_category_id);
                  console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                console.log(this.state.subCategorieList); */

              console.log('if brand filteredArray: ');
              console.log('this.state.brand_Id');
              console.log(this.state.brand_Id);
              console.log(this.state.sub_category_Id);
              console.log(filteredArray);

              this.setState({brandfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              console.log('else brand filteredArray: ');
              console.log(this.state.brand_Id);
              console.log(this.state.brand_id);
              console.log(filteredArray);

              this.setState({brandfilteredArray: filteredArray});
              this.setState({});
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
            console.log('getBrand Token: ');
            console.log(authToken);
            console.log('dispatch response getBrand: ');
            console.log(response);
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

              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
              //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

              let filteredArray = this.state.model.filter(item => {
                if (this.state.brand_Id === item.brand_id) {
                  console.log('this.state.brand_id');
                  console.log(this.state.brand_Id);
                  console.log('item.brand_id');
                  console.log(item.brand_id);
                  console.log('if');
                  return true;
                } else {
                  console.log('this.state.brand_id');
                  console.log(this.state.brand_Id);
                  console.log('item.brand_id');
                  console.log(item.brand_id);
                  console.log('else');
                  return false;
                }
              });

              /* console.log("this.state.subCategorieList: ");
                                console.log(this.state.subCategorieList); */

              console.log('if filteredArray: ');

              console.log(filteredArray);

              this.setState({modelfilteredArray: filteredArray});
              this.setState({});
            } else {
              console.log('else ');

              let filteredArray = [];
              console.log('else filteredArray: ');

              console.log(filteredArray);

              this.setState({modelfilteredArray: filteredArray});
              this.setState({});
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

  onPressEditModalFun = (product_id, auction_type) => {
    console.log('product ID for Bidder List: ');
    console.log(product_id);

    console.log('auction_type');
    console.log(auction_type);

    this.setState({product_id: product_id, auction_type: auction_type});

    // if (auction_type == 'offline') {
    //     this.setEditModalVisible(true);

    // } else

    // this.getProductList();
    this.setEditModalVisible(true);
  };

  // Award Bid

  onAwardPressFun = (customer_id, bid_id, product_id) => {
    this.setState({customer_id: customer_id});
    this.setState({bid_id: bid_id});
    this.setState({product_id: product_id});

    this.award_bidFun();

    this.setModalVisible(false);
    // this.componentDidMount();
  };

  // Edit Ads Modal

  EmptyListBid = () => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        // height: 800,
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

  bidListModal() {
    return (
      <Modal
        animationType="fade"
        visible={this.state.modalVisible}
        hardwareAccelerated={true}
        onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}>
        <View style={{flex: 1}}>
          {(() => {
            if (this.state.loading === true) {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      elevation: 2,
                      backgroundColor: 'white',
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                    }}>
                    <Progress />
                  </View>
                </View>
              );
            } else {
              return (
                <>
                  <IconButton
                    color="#505B98"
                    style={{
                      alignSelf: 'flex-end',
                      marginTop: '5%',
                    }}
                    onPress={() => {
                      this.setModalVisible(false);
                      this.setState({
                        bidderList: [],
                      });
                    }}
                    icon="close"
                  />
                  <FlatList
                    data={this.state.bidderList}
                    contentContainerStyle={{flexGrow: 1}}
                    ListEmptyComponent={this.EmptyListBid}
                    renderItem={({item}) => (
                      // <View>
                      <View
                        style={{
                          borderRadius: 10,
                          elevation: 5,
                          backgroundColor: 'white',
                          margin: 10,
                          padding: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View>
                            <Text
                              style={{
                                fontSize: 18,
                                fontFamily: 'Cairo-SemiBold',
                                width: 280,
                                textAlign: 'left',
                              }}
                              ellipsizeMode={'tail'}
                              numberOfLines={2}>
                              {strings['MobileNo.']}: {item.mobile_no}
                            </Text>

                            <Text
                              style={{
                                fontSize: 18,
                                fontFamily: 'Cairo-SemiBold',
                                width: 280,
                                textAlign: 'left',
                              }}
                              ellipsizeMode={'tail'}
                              numberOfLines={2}>
                              {strings.Email}: {item.email_id}
                            </Text>

                            <Text
                              style={{
                                fontSize: 18,
                                fontFamily: 'Cairo-SemiBold',
                                width: 190,
                                textAlign: 'left',
                              }}
                              ellipsizeMode={'tail'}
                              numberOfLines={2}>
                              {strings.BidAmounts}: {strings.priceSymbol}{' '}
                              {item.bid_amount}
                            </Text>
                          </View>

                          <View
                            style={{
                              flex: 1,
                              alignItems: 'flex-end',
                            }}>
                            {(() => {
                              if (item.bid_status === 'accepted') {
                                return (
                                  <TouchableOpacity
                                    disabled
                                    onPress={() => {
                                      console.log(
                                        'Bid ID On Press********************************************************',
                                      );
                                      console.log(item);
                                      this.onAwardPressFun(
                                        item.customer_id,
                                        item.bid_id,
                                        item.product_id,
                                      );
                                    }}
                                    style={{
                                      backgroundColor: '#505B98',
                                      borderRadius: 8,
                                      padding: 5,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        fontFamily: 'Cairo-Bold',
                                        textAlign: 'justify',
                                        color: 'white',
                                      }}
                                      numberOfLines={1}>
                                      {strings.award}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              } else {
                                if (item.bid_status === 'rejected') {
                                  return (
                                    <TouchableOpacity
                                      disabled
                                      onPress={() => {
                                        console.log(
                                          'Bid ID On Press********************************************************',
                                        );
                                        console.log(item);
                                        this.onAwardPressFun(
                                          item.customer_id,
                                          item.bid_id,
                                          item.product_id,
                                        );
                                      }}
                                      style={{
                                        backgroundColor: 'grey',
                                        borderRadius: 8,
                                        padding: 5,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          fontFamily: 'Cairo-Bold',
                                          textAlign: 'justify',
                                          color: 'white',
                                        }}
                                        numberOfLines={1}>
                                        {strings.award}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                } else {
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        console.log('Award Pressed');
                                        console.log(item);
                                        this.onAwardPressFun(
                                          item.customer_id,
                                          item.bid_id,
                                          item.product_id,
                                        );
                                      }}
                                      style={{
                                        backgroundColor: '#505B98',
                                        borderRadius: 8,
                                        padding: 5,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          fontFamily: 'Cairo-Bold',
                                          textAlign: 'justify',
                                          color: 'white',
                                        }}
                                        numberOfLines={1}>
                                        {strings.award}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                }
                              }
                            })()}
                          </View>
                        </View>
                      </View>
                      // </View>
                    )}
                  />
                </>
              );
            }
          })()}
        </View>
      </Modal>
    );
  }

  render() {
    const {productList} = this.state;

    return (
      <Provider>
        <View style={{backgroundColor: '#FAFAFA', flex: 1}}>
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
                alignSelf: 'center',
                flexDirection: 'row',
                borderRadius: 15,
                borderColor: '#2D2C71',
                height: 45,
                borderWidth: 1,
              }}>
              {/* <TextInput
                                style={{ width: '88%', fontSize: 18, alignSelf: 'center', height: 45, paddingHorizontal: 10, fontFamily: 'Cairo-SemiBold', justifyContent: 'center', textAlignVertical: 'center' }}
                                placeholder={strings.Search}
                                placeholderTextColor="#37474F"
                                autoCapitalize="none"
                                ref="search_title"
                                textAlignVertical='center'
                                value={this.state.search_title}
                                onChangeText={(itemValue) => this.Search_Fun({ itemValue })}
                                keyboardType='default'
                                returnKeyType='search'
                            /> */}
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
                ref="title"
                textAlignVertical="center"
                value={this.state.title}
                onChangeText={itemValue => {
                  this.setState({title: itemValue});
                  this.getMyAdsList();
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

          {/* <View
                    style={{
                        height: 30, justifyContent: 'center', marginTop: 5
                    }}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>

                        <View style={{ padding: 10, flexDirection: 'row', }}>
                            {
                                this.stateName.names.map((item, index) =>
                                (
                                    <TouchableOpacity
                                        key={item.id}
                                        // onPress={() => { this.setState({ activeIndex: item.id }), console.log(item.name) }}
                                        onPress={() => { this.tabChangeFunc(item.id, item.name); }}
                                        style={this.state.activeIndex === item.id ? ProductStyle.btnActive : ProductStyle.btn}>
                                        <Text style={this.state.activeIndex === item.id ? ProductStyle.activetext : ProductStyle.text}> {item.name} </Text>
                                    </TouchableOpacity>
                                )
                                )

                            }
                        </View>
                    </View >

                </View> */}

          <FlatList
            // pagingEnabled={true}
            initialNumToRender={3}
            maxToRenderPerBatch={5}
            refreshControl={
              <RefreshControl
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.refreshing}
                colors={['#505B98', '#EF493E']}
              />
            }
            keyExtractor={item => item.product_id}
            numColumns={1}
            data={this.state.MyAdsList}
            ListEmptyComponent={this.EmptyList}
            // renderItem={({item}) => this.myAdsRender(item)}
            renderItem={({item}) => this.adsRender(item)}
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
            style={style.sideMenuStyle}>
            {/* <ImageBackground
                            source={images.bgcolor} resizeMode="cover" style={{ height: '100%', }}
                        > */}
            {/* <ScrollView> */}
            <View style={[style.modal, {backgroundColor: '#505B98'}]}>
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
                      source={images.drawerMyProducts}
                    />
                    <Text
                      style={{
                        fontFamily: 'Cairo-Bold',
                        fontSize: 16,
                        color: 'black',
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
            {/* </ScrollView> */}
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

  adsRender(item) {
    return (
      <TouchableOpacity
        disabled={item.auction_type === 'offline' ? true : false}
        onPress={() =>
          this.gotoZoom(
            item.meeting_id,
            item.meeting_password,
            item.auction_type,
            item.product_id,
          )
        }
        style={{
          borderRadius: 10,
          elevation: 5,
          margin: 10,
          backgroundColor: 'white',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={style.image}
            source={
              item.product_img != ''
                ? {uri: item.product_img}
                : images.ic_harjj_logo
            }
          />

          <View style={{marginHorizontal: 10}}>
            <Text
              style={style.titleText}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {item.title}
            </Text>

            {(() => {
              if (
                item.auction_type === 'online' ||
                item.auction_type === 'golivenow'
              ) {
                return <></>;
              } else {
                return (
                  <Text style={style.price}>
                    {strings.priceSymbol} {item.starting_price}
                  </Text>
                );
              }
            })()}
          </View>

          <View style={{justifyContent: 'flex-end', flex: 1}}>
            <View
              style={{
                alignSelf: 'flex-end',
                marginBottom: 10,
                marginRight: 10,
              }}>
              <TouchableOpacity
                onPress={() => this.showBidListModal(item.product_id)}>
                {(() => {
                  if (item.auction_type === 'offline') {
                    return (
                      <View
                        style={{
                          backgroundColor: '#505B98',
                          borderRadius: 30,
                          // padding: 2,
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}>
                        <Text style={style.bidNos}>
                          {(() => {
                            if (item.bidCount === null) {
                              return (
                                <Text style={style.bidNos}>
                                  0 {strings.Bids}
                                </Text>
                              );
                            } else {
                              return (
                                <Text style={style.bidNos}>
                                  {item.bidCount} {strings.Bids}
                                </Text>
                              );
                            }
                          })()}
                        </Text>
                      </View>
                    );
                  }
                })()}
              </TouchableOpacity>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('update_ad', {
                      product_id: item.product_id,
                      auction_type: item.auction_type,
                    });
                  }}
                  style={{
                    backgroundColor: '#505B98',
                    borderRadius: 10,
                    margin: 2,
                  }}>
                  <Image
                    style={{
                      height: 18,
                      width: 18,
                      tintColor: 'white',
                      margin: 5,
                    }}
                    source={images.editIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.onPressDeleteConfirm(item.product_id);
                    console.log(item.product_id);
                  }}
                  style={{
                    backgroundColor: '#505B98',
                    borderRadius: 10,
                    margin: 2,
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
        </View>
        {this.bidListModal()}
      </TouchableOpacity>
    );
  }

  myAdsRender(item) {
    return (
      <TouchableOpacity
        disabled={item.auction_type === 'offline' ? true : false}
        onPress={() =>
          this.gotoZoom(
            item.meeting_id,
            item.meeting_password,
            item.auction_type,
            item.product_id,
          )
        }
        style={{
          marginTop: '3%',
          flex: 1,
          marginBottom: '3%',
          marginHorizontal: '3%',
          backgroundColor: 'white',
          elevation: 5,
          borderRadius: 10,
        }}>
        {/* <TouchableOpacity
                          style={{ backgroundColor: 'transparent' }}> */}

        {/* Custom Card */}

        <View style={style.card}>
          <View style={{justifyContent: 'center'}}>
            {/* Image */}

            <Image style={style.image} source={{uri: item.product_img}} />
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginTop: '3%',
              marginLeft: 3,
            }}>
            {/* My Orders Title and others */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 230,
                maxWidth: 230,
              }}>
              <Text
                style={style.titleText}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {item.title}
              </Text>
              {/* <Text style={style.regularText} ellipsizeMode={'tail'} numberOfLines={0}>01:49 min left</Text> */}
            </View>

            {/* Bid Price and number of bids */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 220,
                marginTop: 2,
              }}>
              {(() => {
                if (
                  item.auction_type === 'online' ||
                  item.auction_type === 'golivenow'
                ) {
                  return <></>;
                } else {
                  return (
                    <Text style={style.price}>
                      {strings.priceSymbol} {item.starting_price}
                    </Text>
                  );
                }
              })()}

              <TouchableOpacity
                onPress={() => this.showBidListModal(item.product_id)}>
                {(() => {
                  if (item.auction_type === 'offline') {
                    return (
                      <View
                        style={{
                          backgroundColor: '#505B98',
                          borderRadius: 30,
                          padding: 2,
                        }}>
                        <Text style={style.bidNos}>
                          {(() => {
                            if (item.bidCount === null) {
                              return (
                                <Text style={style.bidNos}>
                                  0 {strings.Bids}
                                </Text>
                              );
                            } else {
                              return (
                                <Text style={style.bidNos}>
                                  {item.bidCount} {strings.Bids}
                                </Text>
                              );
                            }
                          })()}
                        </Text>
                      </View>
                    );
                  }
                })()}
              </TouchableOpacity>
            </View>

            {this.bidListModal()}

            <View
              style={{
                flexDirection: 'row',
                marginRight: '3%',
                marginTop: 15,
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginBottom: 10,
              }}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('update_ad', {
                      product_id: item.product_id,
                      auction_type: item.auction_type,
                    });
                  }}
                  style={{
                    backgroundColor: '#505B98',
                    borderRadius: 10,
                    margin: 2,
                  }}>
                  <Image
                    style={{
                      height: 18,
                      width: 18,
                      tintColor: 'white',
                      margin: 5,
                    }}
                    source={images.editIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.onPressDeleteConfirm(item.product_id);
                    console.log(item.product_id);
                  }}
                  style={{
                    backgroundColor: '#505B98',
                    borderRadius: 10,
                    margin: 2,
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
        </View>
        {/* </TouchableOpacity> */}
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  MyProducts,
);

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
    borderRadius: 10,
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
    height: 50,
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
    fontFamily: 'Cairo-SemiBold',
  },
});
