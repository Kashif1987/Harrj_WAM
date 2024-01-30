import React from 'react';
import {
  AsyncStorage,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Appbar, IconButton} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import images from '../assets/images/images';
import BottomNav from '../components/BottomNavigation';
import strings from '../translations/translateConstant';
import {Alert, Dimensions, StyleSheet} from 'react-native';
import {ActionSheet} from 'react-native-cross-actionsheet';
import * as Keychain from 'react-native-keychain';
import ReactNativeModal from 'react-native-modal';
import Share from 'react-native-share';
import Dialog, {DialogContent} from 'react-native-popup-dialog';

class AboutHarrj extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      alert: false,
      applanguage: '',
      user_id: '',
      lanStaticData: [],
      lang: '',
      appLanState: '',
      isSideMenuVisible: false,
      userName: '',
    };

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
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

    this.storeLang = this.storeLang.bind(this);
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

  componentDidMount() {
    this.getUserName();
    console.log('About componentDidmount');

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

    this.setState({});
  }

  openSearch = () => {
    Actions.search();
  };

  openNormalBid = () => {
    Actions.normal_bid();
  };

  openLiveBid = () => {
    Actions.live_bid();
  };

  openHome = () => {
    Actions.home();
  };

  openCreateAd = () => {
    // this.setCreateAdModalVisible(false)
    Actions.create_ad();
  };

  openLiveNow = () => {
    Actions.live_now();
  };

  openSchedule_live = () => {
    Actions.schedule_live();
  };

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

  // go to Home

  goToHome = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.replace('home');
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
            // this.signoutFun();
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

  signoutFun = () => {
    this.props.navigation.replace('sign_in');
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
              this.componentDidMount();
            } else {
              if (value === 'en') {
                strings.setLanguage('ar');
                AsyncStorage.setItem('UniversalAppLanguage', 'ar');
                this.setState({UniversalLangString: 'English'});
                this.componentDidMount();
              } else {
                console.log('if else');
                strings.setLanguage('en');
                AsyncStorage.setItem('UniversalAppLanguage', 'en');
                this.setState({UniversalLangString: 'Arabic'});
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
    // RNRestart.Restart();
  };

  render() {
    return (
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
        {/* App Bar */}

        <Appbar style={{backgroundColor: 'white', elevation: 0}}>
          <IconButton
            icon={() => (
              <Image
                source={images.MenuIcon}
                style={{height: 22, width: 22, tintColor: '#505B98'}}
              />
            )}
            onPress={this.toggleSideMenu}
          />

          <Appbar.Content
            title={strings.AboutHarrj}
            titleStyle={{
              color: '#505B98',
              fontFamily: 'Cairo-Bold',
              alignSelf: 'center',
              fontSize: 22,
              marginRight: 50,
            }}
          />
        </Appbar>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: '3%'}}>
            {/* About Harrj */}

            <Image
              style={{
                resizeMode: 'contain',
                height: 250,
                width: 250,
                alignSelf: 'center',
              }}
              source={images.about_bg}
            />

            <View style={{}}>
              {/* <Button
                                onPress={this.takeScreenShot}
                                title="capture"
                            /> */}

              {/* <TouchableOpacity
                                style={{ height: 30, backgroundColor: 'red' }}
                                onPress={this.storeLang}
                                title='Change'
                            /> */}

              {/* <Button
                                onPress={this.changeLangEN}
                                title="Change to EN"
                            /> */}

              <Text
                style={{
                  fontFamily: 'Cairo-SemiBold',
                  letterSpacing: 0.5,
                  fontSize: 17,
                  textAlign: 'center',
                }}>
                {strings.AboutHarrjP1}
              </Text>
            </View>
          </View>
        </ScrollView>

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
                  }}>
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
                  }}>
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
                    source={images.drawerAboutus}
                  />
                  <Text
                    style={{
                      fontFamily: 'Cairo-Bold',
                      fontSize: 16,
                      color: 'black',
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
                  fontFamily: 'Cairo-Bold',
                  marginTop: 20,
                  //   top: 20,
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
    );
  }
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
    height: '100%',
  },

  sideMenuStyle: {
    margin: 0,
    width: width * 0.75, // SideMenu width
  },
});

export default AboutHarrj;
