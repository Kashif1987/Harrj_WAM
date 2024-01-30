import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Appbar, IconButton, Menu, Provider} from 'react-native-paper';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {getOfflineProductAction} from '../../actions/bidder/getOfflineProducts.action';
import BottomNav from '../../components/BottomNavigation';
import EnglishLan from '../../translations/en.json';
import ArabicLan from '../../translations/ar.json';
import images from '../../assets/images/images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RangeSlider from 'rn-range-slider';
import CustomCheckBox from '../../components/CustomCheckBox';
import Thumb from '../../components/Thumb';
import Rail from '../../components/Rail';
import RailSelected from '../../components/RailSelected';
import Label from '../../components/Label';
import Notch from '../../components/Notch';
import {getCategoriesSubCategories} from '../../actions/bidder/getCategories.action';
import {getBrands} from '../../actions/getBrands.action';
import CheckBox from '@react-native-community/checkbox';
import strings from '../../translations/translateConstant';
import {Modal} from 'react-native';
import {Actions} from 'react-native-router-flux';
import ActionButton from 'react-native-circular-action-menu';
import {getSubCategories} from '../../actions/getSubCategories.action';
import {getModelAction} from '../../actions/getModel.action';
import {getProductListAction} from '../../actions/getProductList.action';
import {ScrollView} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {Slider} from '@miblanchard/react-native-slider';
import {getNotificationService} from '../../actions/get_notification.action';
import {ActionSheet} from 'react-native-cross-actionsheet';
import SimpleToast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import FastImage from 'react-native-fast-image';

var applanguage = '';
var lanStaticData = [];

// for onRefresh
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

class NormalBid extends React.Component {
  // OnRefresh

  _onRefresh = () => {
    this.setState(
      {
        refreshing: true,
        productList: [],
        last_id: 0,
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
        // this.filterList(
        //   this.state.customer_id,
        //   this.state.title,
        //   this.state.auction_type,
        //   this.state.category_id,
        //   this.state.sub_category_id,
        //   this.state.brand_id,
        //   this.state.model_id,
        //   this.state.max_price_filter,
        // );
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
      user_id: '',
      refreshing: false,
      isChecked: false,
      productList: [],
      applanguage: '',
      lanStaticData: [],
      watchCheck: false,
      mobileCheck: false,
      laptop: false,
      camera: false,
      vehicle: false,
      product_id: '',
      isVisible: false,
      modalVisible: false,
      notificationModalVisible: false,
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
      auction_type: 'offline',
      category_id: [],
      sub_category_id: [],
      brand_id: [],
      model_id: [],
      city_id: [],
      max_price_filter: '0',

      subfilteredArray: [],
      BrandsList: [],
      brandfilteredArray: [],
      modelfilteredArray: [],

      selectedLan: true,

      last_id: 0,
      page_records: 10,
      is_first_call: true,
      onEndReachedCalledDuringMomentum: true,
      progress: false,
      search_icon: true,
    };

    this.onPressButton = this.onPressButton.bind(this);
    this.openLiveBid = this.openLiveBid.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.openHome = this.openHome.bind(this);
    // this.getProductInfo = this.getProductInfo.bind(this);
    this.getCategorySubCategory = this.getCategorySubCategory.bind(this);
    this.toggleCheckBox_Category = this.toggleCheckBox_Category.bind(this);
    this.toggleCheckBox_Brand = this.toggleCheckBox_Brand.bind(this);
    this.toggleCheckBox_SubCat = this.toggleCheckBox_SubCat.bind(this);
    this.toggleCheckBox_Model = this.toggleCheckBox_Model.bind(this);
    this.getModelList = this.getModelList.bind(this);
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

    // this.getCategorySubCategory();
    // this.getSubCategory();
    // this.getBrands();
    // this.getModelList();
  };

  componentWillUnmount() {
    console.log('componentWillUnmount');

    // this.setState({ toggleCheckBox_Category: false })
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

  setModalVisible = visible => {
    this.getCategorySubCategory();
    this.setState({modalVisible: visible});
    this.componentDidMount();
  };

  setNotificationModalVisible = visible => {
    this.getNotification();
    this.setState({notificationModalVisible: visible});
  };

  openMenu = () => this.setState({isVisible: true});

  closeMenu = () => this.setState({isVisible: false});

  openLiveBid = () => {
    this.props.navigation.replace('live_bid');
  };
  openHome = () => {
    this.props.navigation.replace('home');
  };
  openSearch = () => {
    this.props.navigation.replace('search');
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

    // this.filterList(
    //   this.state.customer_id,
    //   this.state.title,
    //   this.state.auction_type,
    //   this.state.category_id,
    //   this.state.sub_category_id,
    //   this.state.brand_id,
    //   this.state.model_id,
    //   value
    // );
    // this.filterListFun();
  };

  // Search for Filter

  Search_Fun = async itemValue => {
    console.log('Search Filter Console');
    console.log(itemValue);
    console.log(itemValue.itemValue);
    this.setState(
      {
        search_string: itemValue.itemValue,
        // title: itemValue.itemValue,
        last_id: 0,
        productList: [],
        progress: true,
      },
      () => {
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
      },
    );
  };

  // Check Box for Categories

  toggleCheckBox_Category = async check_id => {
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
      console.log(
        'if ***********************************************************************************category_id_arry',
      );
      console.log(category_id_arry);
    } else {
      checkCopy[check_id] = true;
      console.log(
        'else if***********************************************************************************category_id_arry',
      );
      console.log(category_id_arry);

      if (!category_id_arry.includes(check_id)) {
        category_id_arry.push(check_id);
        console.log(
          ' ***********************************************************************************category_id_arry',
        );
        console.log(category_id_arry);
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
    // this.filterListFun();

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
    // this.filterListFun();

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
    // this.filterListFun();
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
    this.getModelList();
    this.getBrands();
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

    // this.filterListFun();

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

        /* console.log("getBrand Token: ");
                            console.log(this.token);
                            console.log("dispatch response getBrand: ");
                            console.log(response); */

        if (
          this.state.category_id.length > 0 &&
          this.state.sub_category_id.length > 0
        ) {
          let filteredArray = this.state.BrandsList.filter(item => {
            if (
              this.state.category_id.includes(item.category_id) &&
              this.state.sub_category_id.includes(item.sub_category_id)
            ) {
              /*console.log("this.state.category_id");
                                              console.log(this.state.category_id);
                                              console.log("item.category_id");
                                              console.log(item.category_id);
                                              console.log("if"); */
              return true;
            } else {
              /* console.log("this.state.category_id");
                                              console.log(this.state.category_id);
                                              console.log("item.category_id");
                                              console.log(item.category_id);
                                              console.log("else"); */
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
                /*console.log("this.state.category_id");
                                                    console.log(this.state.category_id);
                                                    console.log("item.category_id");
                                                    console.log(item.category_id);
                                                    console.log("if"); */
                return true;
              } else {
                /* console.log("this.state.category_id");
                                                    console.log(this.state.category_id);
                                                    console.log("item.category_id");
                                                    console.log(item.category_id);
                                                    console.log("else"); */
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
                  /*                     console.log("this.state.category_id");
                                                                              console.log(this.state.category_id);
                                                                              console.log("item.category_id");
                                                                              console.log(item.category_id);
                                                                              console.log("if"); */
                  return true;
                } else {
                  /* console.log("this.state.category_id");
                                                          console.log(this.state.category_id);
                                                          console.log("item.category_id");
                                                          console.log(item.category_id);
                                                          console.log("else"); */
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
        /* if (response && typeof response !== "undefined" && response !== "") {
                              this.setState({ progress: false });
                              this.setState({ BrandsList: response.data })
                            } */
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
              /*                     console.log("this.state.category_id");
                                                                              console.log(this.state.category_id);
                                                                              console.log("item.category_id");
                                                                              console.log(item.category_id);
                                                                              console.log("if"); */
              return true;
            } else {
              /* console.log("this.state.category_id");
                                                          console.log(this.state.category_id);
                                                          console.log("item.category_id");
                                                          console.log(item.category_id);
                                                          console.log("else"); */
              return false;
            }
          });

          /* console.log("this.state.subCategorieList: ");
                                              console.log(this.state.subCategorieList); */

          console.log('if filteredArray: ');
          // console.log(filteredArray);

          this.setState({subfilteredArray: filteredArray});
          this.setState({});
        } else {
          console.log('else ');

          let filteredArray = [];
          console.log('else filteredArray: ');
          // console.log(filteredArray);

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
        // console.log(response);
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

          //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))
          //let filteredArray = this.state.subCategorieList.filter(item => this.state.category_id.includes(item.category_id))

          let filteredArray = this.state.modelList.filter(item => {
            if (this.state.brand_id.includes(item.brand_id)) {
              /*                     console.log("this.state.category_id");
                                                                              console.log(this.state.category_id);
                                                                              console.log("item.category_id");
                                                                              console.log(item.category_id);
                                                                              console.log("if"); */
              return true;
            } else {
              /* console.log("this.state.category_id");
                                                          console.log(this.state.category_id);
                                                          console.log("item.category_id");
                                                          console.log(item.category_id);
                                                          console.log("else"); */
              return false;
            }
          });

          /* console.log("this.state.subCategorieList: ");
                                              console.log(this.state.subCategorieList); */

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
      // Alert.alert('Try Catch');
      // Alert.alert(errorCatch.message);
      this.setState({progress: false});
    }
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

  // Getting Normal Products API

  // getProductInfo = () => {
  //     try {
  //         const { navigation, dispatch } = this.props;
  //         const { navigate } = this.props.navigation;

  //         dispatch(getOfflineProductAction(this.token))

  //             .then((response) => {
  //                 console.log("dispatch response getProduct: ");
  //                 console.log(response);
  //                 if (response && typeof response !== "undefined" && response !== "") {
  //                     this.setState({ progress: false });
  //                     this.setState({ productList: response.data });
  //                 } else {
  //                     this.setState({ progress: false });
  //                     Alert.alert('something went wrong..!!');
  //                 }
  //             })
  //             .catch((error) => {
  //                 this.setState({ progress: false });
  //                 console.log("dispatch error: ");
  //                 console.log(error);
  //                 Alert.alert(error.message);
  //             });
  //     } catch (errorCatch) {
  //         Alert.alert(errorCatch.message);
  //         this.setState({ progress: false });
  //     }
  // }

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
    // this.setState({ productList: [], last_id: 0 });
    try {
      const {dispatch} = this.props;
      var authToken = '';
      await Keychain.getGenericPassword()
        .then(credentials => {
          var sessionData = JSON.parse(credentials.password);

          authToken = sessionData.token;
        })
        .catch(error => {
          console.log('dispatch error: ');
          console.log(error);
          this.setState({progress: false});
          // SimpleToast.show(strings.someError, SimpleToast.SHORT);
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
        console.log('dispatch response getProduct: ');
        console.log(response);
        var responseData = response.data;
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
          // Alert.alert('something went wrong..!!');
        }
      });
    } catch (errorCatch) {
      SimpleToast.show(strings.someError, SimpleToast.SHORT);
      this.setState({progress: false});
      // Alert.alert(errorCatch.message);
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
          // console.log(response);
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

  onPressButton = () => {
    console.log(this.state.product_id);
    console.log('this.state.product_id');
    this.props.navigation.navigate('product_details', {
      product_id: this.state.product_id,
    });
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
    const {DummyData, productList} = this.state;

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

          <View>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
              {/* back button */}

              {/* <Appbar.BackAction onPress={() => { this.props.navigation.goBack(null) }} /> */}

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

                    {/* Categories */}

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

                    {/* Brands */}

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
                        marginRight: 10,
                        marginBottom: 5,
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
                          onValueChange={this.rangeSliderHandle}
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
                  // this.props.navigation.navigate('profile');
                  if (this.state.user_id === null) {
                    // console.log(this.state.user_id);
                    this.goToLogin();
                  } else {
                    this.props.navigation.navigate('profile');
                  }
                }}
              />

              {/* Notification Icon */}

              {/* <Appbar.Action
                                animated={false}
                                icon={() =>
                                    <Image style={{ height: 24, width: 22, alignSelf: 'flex-end', tintColor: '#505B98' }}
                                        source={images.bell} />
                                }
                                onPress={() => { this.setNotificationModalVisible(true) }} /> */}

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

                          {/* <View style={{ width: 10 }} /> */}
                          {/* <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}> */}

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
                  ref={input => {
                    this.textInput = input;
                  }}
                  placeholderTextColor="#37474F"
                  autoCapitalize="none"
                  textAlignVertical="center"
                  value={this.state.title}
                  onChangeText={itemValue => {
                    // this.Search_Fun({ itemValue })
                    this.setState({title: itemValue});
                  }}
                  keyboardType="default"
                  returnKeyType="search"
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

                {/* <TouchableOpacity style={{ justifyContent: 'center', }}>
                                    <Image style={{ height: 32, width: 40, right: 2 }}
                                        source={images.SearchBg} />

                                    <Image style={{ tintColor: 'white', alignSelf: 'center', position: 'absolute', height: 24, width: 24, }}
                                        source={images.search_icon} />

                                </TouchableOpacity> */}
              </View>
            </View>
          </View>

          {/* Normal Bids List */}

          <FlatList
            onRefresh={() => this._onRefresh()}
            refreshing={this.state.refreshing}
            numColumns={2}
            keyExtractor={item => item.product_id}
            ListEmptyComponent={this.EmptyList}
            contentContainerStyle={{}}
            data={productList}
            onEndReachedThreshold={0.2}
            onEndReached={data => {
              console.warn('Scroll End');
              console.log(data.distanceFromEnd);

              if (!this.state.onEndReachedCalledDuringMomentum) {
                this.setState({
                  progress: true,
                  onEndReachedCalledDuringMomentum: true,
                });
                this.filterListFun();
              }
            }}
            onMomentumScrollBegin={() => {
              console.warn('Scroll Begin');
              this.setState({
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
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 35,
                    backgroundColor: 'white',
                    elevation: 5,
                    // height: 20,
                    width: 180,
                    shadowColor: '#171717',
                    shadowOffset: {width: -2, height: 4},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    paddingBottom: 10,
                    paddingLeft: 10,
                  }}
                  onPress={() => {
                    console.log('pressed');
                    this.props.navigation.navigate('product_details', {
                      product_id: item.product_id,
                    });
                  }}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        width: 190,
                      }}>
                      {/* Auction Type */}

                      {/* <View
                        style={{
                          backgroundColor: '#FF2133',
                          width: 110,
                          height: 40,
                          alignSelf: 'flex-start',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Cairo-SemiBold',
                            fontSize: 18,
                            color: 'white',
                            textAlignVertical: 'center',
                            alignSelf: 'center',
                          }}
                        >
                          {strings.Normal}
                        </Text>
                      </View> */}

                      {/* <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          marginRight: 20,
                          marginTop: 10,
                        }}
                        onPress={() => {}}
                      >
                        <Image
                          style={{ height: 18, width: 20 }}
                          source={images.fav}
                        />
                      </TouchableOpacity> */}
                    </View>

                    {/* Product Image */}

                    <View style={{alignItems: 'center'}}>
                      <FastImage
                        style={ProductStyle.ImageStyle}
                        source={{uri: item.product_img}}
                      />
                    </View>

                    {/* Product Title, Number of bids, date and time, Price, rating */}

                    <View style={{width: 170, flex: 1, marginLeft: 10}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={ProductStyle.titleText}
                          ellipsizeMode="tail"
                          numberOfLines={1}>
                          {item.title}
                        </Text>

                        {/* <View
                          style={{
                            alignSelf: 'flex-end',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginLeft: 10,
                          }}
                        >
                          <Image
                            source={images.bids}
                            style={{ height: 20, width: 20 }}
                          />

                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 12,
                              marginTop: 5,
                              width: 40,
                              textAlign: 'justify',
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                          >
                            {' '}
                            180{' '}
                          </Text>
                        </View> */}
                      </View>
                    </View>

                    {/* Product Date */}

                    <View style={{flexDirection: 'row', marginLeft: 5}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          alignSelf: 'flex-start',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginLeft: 3,
                            alignSelf: 'flex-start',
                          }}>
                          <Image
                            style={{height: 24, width: 24, borderRadius: 10}}
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

                        {/* Product Time */}

                        {/* <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            alignSelf: 'flex-start',
                          }}
                        >
                          <Image
                            style={{ height: 28, width: 24, borderRadius: 10 }}
                            source={images.time}
                          />
                          <Text
                            style={{
                              fontFamily: 'Cairo-SemiBold',
                              fontSize: 10,
                              marginTop: 5,
                              width: 130,
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                          >
                            {item.start_time} - {item.end_time}
                          </Text>
                        </View> */}

                        {/* Product Price */}

                        <View
                          style={{
                            marginLeft: 10,
                            marginBottom: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: 140,
                          }}>
                          {(() => {
                            if (item.max_bid_amount === null) {
                              return (
                                <Text
                                  style={ProductStyle.price}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>
                                  {strings.priceSymbol} 0
                                </Text>
                              );
                            } else {
                              return (
                                <Text
                                  style={ProductStyle.price}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}>
                                  {strings.priceSymbol}
                                  {item.max_bid_amount}
                                </Text>
                              );
                            }
                          })()}

                          {/* <Text
                            style={ProductStyle.price}
                            ellipsizeMode="tail"
                            numberOfLines={1}
                          >
                            {strings.priceSymbol}
                            {item.max_bid_amount}
                          </Text> */}
                          {/* {(() => {
                            if (item.max_bid_amount === null) {
                              return (
                                <Text
                                  style={ProductStyle.price}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                >
                                  {strings.priceSymbol} 0
                                </Text>
                              );
                            } else {
                              return (
                                <Text
                                  style={ProductStyle.price}
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                >
                                  {strings.priceSymbol}
                                  {item.max_bid_amount}
                                </Text>
                              );
                            }
                          })()} */}

                          {/* <View
                            style={{
                              backgroundColor: 'black',
                              borderRadius: 8,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              marginHorizontal: 5,
                              alignItems: 'center',
                              width: 45,
                              height: 25,
                            }}
                          >
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 12,
                                fontFamily: 'Cairo-SemiBold',
                              }}
                            >
                              4.1{' '}
                            </Text>
                            <MaterialIcons
                              name="star"
                              color="white"
                              size={18}
                            />
                          </View> */}
                        </View>
                      </View>
                    </View>

                    {/* <View style={styles.textContainer}>
                              <Text style={styles.titleText}>{item.name}</Text>
                              <Text style={styles.price}>Price: {item.final_price}</Text>
                              <Text style={styles.mediumText}>End on: {item.end_date_time}</Text>
                              <View style={styles.button}>
                                <TouchableOpacity
                                  onPress={() => { console.log('Bid pressed') }}
                                >
                                  <Text style={styles.regularText}>Bid</Text>
                                </TouchableOpacity>
                              </View>
                            </View> */}
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={{height: 20}}></View>

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
            <BottomNav icon={images.normalBidIcon} color="white" />

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
}

// Styles

const ProductStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 8,
    alignItems: 'center',
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
  },
  ImageStyle: {
    height: 73,
    width: 120,
    borderRadius: 5,
    resizeMode: 'contain',
    marginVertical: '5%',
    marginHorizontal: '5%',
  },

  titleText: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    marginRight: 10,
    // width: 85,
    textAlign: 'justify',
  },

  regularText: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    textAlignVertical: 'center',
    color: 'white',
    textAlign: 'justify',
  },
  mediumText: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    marginTop: 10,
    textAlignVertical: 'center',
    textAlign: 'justify',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    // marginTop: 10,
    textAlignVertical: 'center',
    width: 90,
    textAlign: 'justify',
  },
  priceText: {
    // fontFamily: 'Rubik-Regular',
    textAlignVertical: 'center',
    textAlign: 'justify',
  },
});

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(NormalBid);
