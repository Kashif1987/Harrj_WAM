import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  BackHandler,
  I18nManager,
  Image,
  ImageBackground,
  Text,
  View,
} from 'react-native';
import LocalizedStrings from 'react-native-localization';
import RNRestart from 'react-native-restart';
import { Actions } from 'react-native-router-flux';
import images from '../assets/images/images';
import AboutHarrj from '../screens/About_Harrj';
import Home from '../screens/Bidder/Home';
import MyOrders from '../screens/Bidder/My_Orders';
import My_Products from '../screens/Bidder/My_Products';
import MyReport from '../screens/Bidder/My_Report';
import Products from '../screens/Bidder/Products';
import ContactUs from '../screens/ContactUs';
import Privacy_Policy from '../screens/Privacy_Policy';
import ArabicLan from '../translations/ar.json';
import EnglishLan from '../translations/en.json';
import strings from '../translations/translateConstant';

var applanguage = '';
var lanStaticData = [];

// const strings = new LocalizedStrings({
//     en: EnglishLan,
//     ar: ArabicLan,
// })

const Drawer = createDrawerNavigator();

class DrawerNav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      applanguage: '',
      lanStaticData: [],
    };
  }

  // Change Language

  langFun = () => {
    AsyncStorage.getItem('AppLanguage').then((value) => {
      if (value != null) {
        this.setState({ applanguage: value });
        applanguage = value;
      } else {
        console.log('Drawer');
      }
    });
  };

  componentDidMount = async () => {
    console.log(' Drawer 1  componentDidmount');

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
        if (value != null) {
          console.log('componentDidmount if');
          console.log(value);
          strings.setLanguage(value);
        } else {
          console.log('componentDidmount  elses');
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }

    this.setState({});
  };

  render() {
    return (
      <ImageBackground
        source={images.bgcolor}
        resizeMode="cover"
        style={{ height: '100%' }}
      >
        <NavigationContainer>
          {/* Drawer Navigator */}

          <Drawer.Navigator
            overlayColor="transparent"
            initialRouteName="home"
            backBehavior="initialRoute"
            drawerType="slide"
            drawerStyle={{ backgroundColor: 'transparent' }}
            screenOptions={{
              headerShown: false,
            }}
            drawerContentOptions={{
              itemStyle: { marginBottom: 10 },
              activeTintColor: 'white',
              inactiveTintColor: 'white',

              labelStyle: {
                textAlign: I18nManager.getConstants ? 'left' : 'right',
                fontFamily: 'Rubik-Bold',
                fontSize: 16,
              },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            {/* Drawer Screens */}

            <Drawer.Screen
              name={strings.Home}
              component={Home}
              options={{
                headerShown: false,
                headerTitle: '',
                drawerIcon: ({ focused, size }) => (
                  <Image
                    style={{ height: size, width: size }}
                    source={images.drawerHome}
                  />
                ),
                headerTitleStyle: {},
                headerRight: () => (
                  <View>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: 75,
                        height: 35,
                        marginRight: 270,
                      }}
                      source={images.ic_harjj_logo}
                    />
                  </View>
                ),
              }}
            />

            {/* <Drawer.Screen name="Products" component={Products}
                            options={{
                                drawerIcon: ({ focused, size }) => <Image
                                    style={{ height: size, width: size, tintColor: 'white' }}
                                    source={images.drawerProduct}
                                />,
                            }}
                        /> */}

            <Drawer.Screen
              name={strings.MyBids}
              component={MyOrders}
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Image
                    style={{ height: size, width: size, tintColor: 'white' }}
                    source={images.drawerBids}
                  />
                ),
              }}
            />

            <Drawer.Screen
              name={strings.myProducts}
              component={My_Products}
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Image
                    style={{ height: size, width: size, tintColor: 'white' }}
                    source={images.drawerMyProducts}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name={strings.Contactus}
              component={ContactUs}
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Image
                    style={{ height: size, width: size, tintColor: 'white' }}
                    source={images.drawerContact}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name={strings.AboutHarrj}
              component={AboutHarrj}
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Image
                    style={{ height: size, width: size, tintColor: 'white' }}
                    source={images.drawerAboutus}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name={strings.privacyPolicy}
              component={Privacy_Policy}
              options={{
                drawerIcon: ({ focused, size }) => (
                  <Image
                    style={{ height: size, width: size, tintColor: 'white' }}
                    source={images.drawerPrivacy}
                  />
                ),
              }}
            />
            {/* <Drawer.Screen name="My Report" component={MyReport}
                            options={{
                                drawerIcon: ({ focused, size }) => <Image
                                    style={{ height: size, width: size, tintColor: 'white' }}
                                    source={images.drawerReport}
                                />,
                            }}
                        /> */}
          </Drawer.Navigator>
        </NavigationContainer>
      </ImageBackground>
    );
  }
}

export default DrawerNav;

// Custom Drawer Content
var currentlan = '';
var applanguage = '';
class CustomDrawerContent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      appLanState: '',
      applanguage: '',
    };

    this.onSignout = this.onSignout.bind(this);
  }

  // Change Language

  langFun() {
    AsyncStorage.getItem('AppLanguage').then((value) => {
      if (value != null) {
        this.setState({ applanguage: value });
        applanguage = value;
      } else {
        console.log('Drawer');
      }
    });
  }

  componentDidMount = async () => {
    console.log(' Drawer 2 componentDidmount');

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
        if (value != null) {
          console.log('componentDidmount if');
          console.log(value);
          strings.setLanguage(value);
        } else {
          console.log('componentDidmount  elses');
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }

    this.setState({});
  };

  openMyReport = () => {
    Actions.my_report();
  };

  onSignout = () => {
    Actions.sign_in();
  };

  CurrentLanFetch() {
    AsyncStorage.getItem('AppLanguage').then((value) => {
      if (value != null) {
        this.setState({ currentlan: value });

        applanguage = value;
        if (value === 'en') {
          currentlan = 'English/Arabic';
          this.setState({ appLanState: 'Arabic' });
        } else {
          if (value === 'ar') {
            currentlan = 'Arabic/English';
            this.setState({ appLanState: 'English' });
          }
        }
        console.log('currentlan: ');
        console.log(currentlan);
      } else {
        console.log('currentlan else: ');
      }
    });
  }

  ChangeLan = () => {
    console.log('Language Change Clicked');
    console.log(this.state.applanguage);
    if (this.state.applanguage === 'en') {
      console.log('if');
      this.setState({ appLanState: 'English', applanguage: 'ar' });
      applanguage = 'ar';
      currentlan = 'Arabic/English';
      AsyncStorage.setItem('AppLanguage', 'ar');
      // RNRestart.Restart();
    } else {
      this.setState({ appLanState: 'Arabic', applanguage: 'en' });
      applanguage = 'en';
      currentlan = 'English/Arabic';
      AsyncStorage.setItem('AppLanguage', 'en');
      // RNRestart.Restart();
    }
    // AsyncStorage.getItem('AppLanguage').then(value => {
    //   if (value != null) {
    //     this.setState({ applanguage: value });
    //     applanguage = value;
    //     // console.log('applanguage');
    // // console.log(applanguage);
    //     // Alert.alert(value);
    //   }else{
    //   }
    // })
  };

  storeLang = () => {
    console.log('Store Lang');

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
        if (value != null) {
          console.log('if');
          console.log(value);
          if (value && typeof value !== 'undefined' && value !== '') {
            if (value === 'ar') {
              strings.setLanguage('en');
              AsyncStorage.setItem('UniversalAppLanguage', 'en');
            } else {
              if (value === 'en') {
                strings.setLanguage('ar');
                AsyncStorage.setItem('UniversalAppLanguage', 'ar');
              } else {
                console.log('if else');
                strings.setLanguage('en');
                AsyncStorage.setItem('UniversalAppLanguage', 'en');
              }
            }
          }
        } else {
          console.log('elses');
          strings.setLanguage('en');
          AsyncStorage.setItem('UniversalAppLanguage', 'en');
        }
      });
    } catch (error) {
      console.log(' Store Lang Catch error: ');
      console.log(error);
    }
    this.setState({});
    RNRestart.Restart();
  };

  render() {
    return (
      <DrawerContentScrollView {...this.props}>
        {/*Custom Drawer Header */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            backgroundColor: 'transparent',
            marginTop: 10,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: 'Rubik-Bold',
                textAlign: 'auto',
                color: 'white',
                fontSize: 18,
                marginTop: 15,
                marginHorizontal: 10,
              }}
            >
              Welcome User{' '}
            </Text>
          </View>
        </View>

        <DrawerItemList {...this.props} />

        {/*Share Harrj Button */}

        <DrawerItem
          label={strings.Share}
          // style={{ borderBottomWidth: 0.5, borderBottomColor: 'grey', }}
          labelStyle={{
            textAlign: I18nManager.getConstants ? 'left' : 'right',
            fontFamily: 'Rubik-Bold',
            fontSize: 16,
            color: 'white',
          }}
          icon={() => (
            <Image
              style={{ height: 24, width: 24, tintColor: 'white' }}
              source={images.drawerShare}
            />
          )}
          onPress={() => {
            Alert.alert(
              strings.Share,
              strings.shareLink,
              [{ text: 'OK', style: 'destructive' }],
              { cancelable: true }
            );
            return true;
          }}
        />

        {/*Sign Out Button */}

        <DrawerItem
          label={strings.signout}
          // style={{ borderBottomWidth: 0.5, borderBottomColor: 'grey', }}
          labelStyle={{
            textAlign: I18nManager.getConstants ? 'left' : 'right',
            fontFamily: 'Rubik-Bold',
            fontSize: 16,
            color: 'white',
          }}
          onPress={() => {
            // this.props.navigation.dispatch(DrawerActions.closeDrawer())
            Alert.alert(
              strings.signout,
              strings.signoutDisc,
              [
                { text: strings.no, style: 'cancel' },
                {
                  text: strings.yes,
                  onPress: () => {
                    Actions.sign_in();
                  },
                },
              ],
              { cancelable: true }
            );
            return true;
          }}
          icon={() => (
            <Image
              style={{ height: 24, width: 24, tintColor: 'white' }}
              source={images.drawerSignout}
            />
          )}
        />

        {/*Toggle Button for Language change */}

        <DrawerItem
          label={this.state.appLanState}
          // style={{ borderBottomWidth: 0.5, borderBottomColor: 'grey', }}
          labelStyle={{
            textAlign: I18nManager.getConstants ? 'left' : 'right',
            fontFamily: 'Rubik-Bold',
            fontSize: 16,
            color: 'white',
          }}
          onPress={this.ChangeLan}
          icon={() => (
            <Image
              style={{ height: 24, width: 24, tintColor: 'white' }}
              source={images.drawerLang}
            />
          )}
        />

        {/*Exit Button */}

        {/*<DrawerItem
                    label={strings.logout}
                    style={{ borderBottomWidth: 0.5, borderBottomColor: 'grey', }}
                    labelStyle={{
                        textAlign: I18nManager.getConstants ? 'left' : 'right',
                        fontFamily: 'Rubik-Bold', fontSize: 16, color: 'white',
                    }}
                    onPress={() => {
                        Alert.alert(
                            strings.logout,
                            strings.logoutDec,
                            [
                                { text: strings.no, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                { text: strings.yes, onPress: () => BackHandler.exitApp() },
                            ],
                            { cancelable: false });
                        return true;
                    }
                    }
                    icon={() =>
                        <Image
                            style={{ height: 24, width: 24, tintColor: 'white' }}
                            source={images.drawerLogout}
                        />
                    }
                />*/}
      </DrawerContentScrollView>
    );
  }
}
