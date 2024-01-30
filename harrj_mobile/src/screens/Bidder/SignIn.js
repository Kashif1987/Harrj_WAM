import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import {Actions} from 'react-native-router-flux';
import SimpleToast from 'react-native-simple-toast';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {compose} from 'redux';
import ValidationComponent from '../../../ValidationComponent';
import {googleLoginService} from '../../actions/google_login.action';
import {userLogin} from '../../actions/userLogin.action';
import images from '../../assets/images/images';
import Progress from '../../components/Progress/progress';
import strings from '../../translations/translateConstant';

const styles = require('../../assets/css/style');

var applanguage = '';
var lanStaticData = [];

class SignIn extends ValidationComponent {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      progress: false,
      email_id: '',
      mobile: '',
      password: '',
      error: '',
      token: '',
      userInfo: [],
      applanguage: '',
      lanStaticData: [],
      user_id: '',
      isSideMenuVisible: false,
      userNme: 'asd',
    };

    this.storeLang = this.storeLang.bind(this);

    this.handleLogin = this.handleLogin.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
  }

  // Component Did Mount

  componentDidMount() {
    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
        if (value != null) {
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
          this.setState({
            UniversalLangString: 'English',
            selectedLan: false,
            value: 'ar',
          });
        }
      });
    } catch (error) {}
  }

  toggleSideMenu = () =>
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});

  closeModal = () => {
    this.setState({isSideMenuVisible: !this.state.isSideMenuVisible});
    this.props.navigation.navigate('sign_up');
  };

  openSignUp = () => {
    this.props.navigation.navigate('sign_up');
  };
  openForgotPw = () => {
    this.props.navigation.navigate('forgot_password');
  };
  openHome = () => {
    this.props.navigation.replace('home');
  };

  onPressButton = () => {
    this.validate({
      // mobile: { required: true, minlength: 10, },
      user_id: {required: true},
      password: {required: true},
    });

    if (this.getErrorMessages()) {
    } else {
      this.handleLogin();
    }
  };

  handleLogin = async () => {
    this.setState({progress: true});
    try {
      const {navigation, dispatch} = this.props;
      const {navigate} = this.props.navigation;

      const firebase_token = await AsyncStorage.getItem('firebase_token');

      dispatch(
        userLogin(this.state.user_id, this.state.password, firebase_token),
      )
        .then(response => {
          console.log('dispatch Login response: ');
          console.log(response);

          if (response && typeof response !== 'undefined' && response !== '') {
            this.setState({progress: false});

            Keychain.getGenericPassword() // Retrieve the credentials from the keychain
              .then(async credentials => {
                var usernameArry = {is_authenticated: true};
                var passwordArry = {
                  token: response.token,
                  role: response.role,
                  user_id: response.data[0].id,
                  user_mobile_id: response.data[0].mobile_no.toString(),
                  email_id: response.data[0].email_id,
                };

                var username = JSON.stringify(usernameArry);
                var password = JSON.stringify(passwordArry);

                Keychain.resetGenericPassword();
                Keychain.setGenericPassword(username, password);

                try {
                  AsyncStorage.setItem(
                    'userId',
                    response.data[0].id.toString(),
                  );
                  AsyncStorage.setItem(
                    'userMobileId',
                    response.data[0].mobile_no,
                  );
                  AsyncStorage.setItem('userName', response.data[0].name);
                  AsyncStorage.setItem(
                    'userEmail_id',
                    response.data[0].email_id,
                  );
                  AsyncStorage.setItem('userRole', response.data[0].role);
                } catch (e) {}

                SimpleToast.show(strings.LoginSuccessful, SimpleToast.SHORT);

                this.props.navigation.replace('home');
              })
              .catch(errorKeychain => {
                console.log('errorKeychain: ');
                console.log(errorKeychain);

                var notFoundmsg = 'Account not found, Please register';
                var inCorrect = 'Invalid mobile no/email_id Or Password..!';
                var responseMsg = response.message;

                if (responseMsg === notFoundmsg) {
                  Alert.alert(
                    strings.Alert,
                    strings.AccountNotFound,
                    [{text: strings.ok, style: 'destructive'}],
                    {cancelable: true},
                  );
                } else if (responseMsg === inCorrect) {
                  Alert.alert(
                    strings.Alert,
                    strings.InvalidCred,
                    [{text: strings.ok, style: 'destructive'}],
                    {cancelable: true},
                  );
                }
              });
          } else {
            this.setState({progress: false});
            Alert.alert(
              strings.Alert,
              strings.someError,
              [{text: strings.ok, style: 'destructive'}],
              {cancelable: true},
            );
          }
        })
        .catch(error => {
          this.setState({progress: false});
          console.log(' catch login dispatch error: ');
          console.log(error);
          SimpleToast.show(strings.someError, SimpleToast.SHORT);
        });
    } catch (errorCatch) {
      SimpleToast.show(strings.someError, SimpleToast.SHORT);
      this.setState({progress: false});
    }
  };

  signup = () => {
    Actions.register();
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
    const {handleSubmit, loginUser} = this.props;

    return (
      <View style={{flex: 1}}>
        <Dialog visible={this.state.progress}>
          <DialogContent style={{width: '80%'}}>
            <Progress />
          </DialogContent>
        </Dialog>

        <ImageBackground
          source={images.harrj_bg}
          resizeMode="stretch"
          style={{height: '100%'}}>
          <View
            style={{
              alignSelf: 'center',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {/* HARRJ LOGO */}

              <View style={{height: 0}}>
                <Image
                  style={{
                    height: 50,
                    marginTop: '20%',
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                  source={images.ic_harjj_logo}
                />
              </View>
              <View
                style={{
                  marginTop: '84%',
                  flex: 1,
                  marginBottom: '10%',
                  width: '85%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'column'}}>
                  {/* User ID Input */}
                  <View style={style.textInputView}>
                    <Feather
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginLeft: 18,
                      }}
                      name="user"
                      color="#2D2C71"
                      size={24}
                    />

                    <TextInput
                      style={style.textInput}
                      underlineColorAndroid="transparent"
                      placeholder={strings.MobileNo}
                      placeholderTextColor="#2D2C71"
                      autoCapitalize="none"
                      ref="user_id"
                      value={this.state.user_id}
                      onChangeText={(itemValue, itemIndex) =>
                        this.setState({user_id: itemValue})
                      }
                      keyboardType="email-address"
                      textAlign={'left'}
                    />
                  </View>

                  {this.isFieldInError('user_id') &&
                    this.getErrorsInField('user_id').map(errorMessage => (
                      <Text style={style.error_text}>
                        {strings.fieldUser}
                        {/* {errorMessage} */}
                      </Text>
                    ))}

                  {/* Password Input */}
                  <View style={style.textInputView}>
                    <MaterialCommunityIcons
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginLeft: 18,
                      }}
                      name="lock-outline"
                      color="#2D2C71"
                      size={24}
                    />

                    <TextInput
                      style={style.textInput}
                      underlineColorAndroid="transparent"
                      placeholder={strings.Password}
                      placeholderTextColor="#2D2C71"
                      autoCapitalize="none"
                      ref="password"
                      value={this.state.password}
                      onChangeText={(itemValue, itemIndex) =>
                        this.setState({password: itemValue})
                      }
                      keyboardType="default"
                      secureTextEntry={true}
                    />
                  </View>

                  {this.isFieldInError('password') &&
                    this.getErrorsInField('password').map(errorMessage => (
                      <Text style={style.error_text}>
                        {strings.fieldPassword1}
                      </Text>
                    ))}

                  {/* Login Button */}

                  <View style={{flexDirection: 'column', marginTop: 15}}>
                    <TouchableOpacity
                      style={{
                        height: 50,
                        backgroundColor: '#505B98',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 2,
                      }}
                      onPress={() => {
                        this.onPressButton();
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontFamily: 'Cairo-Bold',
                          color: 'white',
                        }}>
                        {strings.Login}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Forget Password Button */}

                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 30,
                    }}>
                    <TouchableOpacity onPress={this.openForgotPw}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#CC1212',
                          fontFamily: 'Cairo-Bold',
                        }}>
                        {strings.ForgotPs}{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Register Button */}

                  <View style={{flexDirection: 'column', marginTop: '25%'}}>
                    <TouchableOpacity
                      style={{
                        height: 50,
                        borderRadius: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={this.openSignUp}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Cairo-SemiBold',
                          color: 'white',
                        }}>
                        {strings.dontHaveac}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={{
                      marginHorizontal: 10,
                      alignItems: 'center',
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
                          // marginLeft: 10,
                        }}
                        source={images.drawerLang}
                      />
                      <Text
                        style={{
                          fontFamily: 'Cairo-Bold',
                          fontSize: 16,
                          color: 'white',
                          marginLeft: 10,
                        }}>
                        {strings.TranslatetoEnglish}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const {width} = Dimensions.get('window');

const style = StyleSheet.create({
  textInputView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    flex: 1,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#2D2C71',
    height: 50,
    marginBottom: 15,
  },

  textInput: {
    borderBottomColor: '#FFFFFF',
    paddingHorizontal: 15,
    width: '88%',
    textAlign: 'left',
    alignSelf: 'center',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
  },

  image: {
    flex: 1,
    justifyContent: 'center',
    height: Dimensions.get('window').height / 1.6,
    transform: [{scaleX: 1.8}, {scaleY: 1.25}],
  },

  error_text: {
    padding: 10,
    color: 'red',
    backgroundColor: '#ffebe6',
    borderRadius: 24,
    margin: 5,
  },

  modal: {
    backgroundColor: 'transparent',
    height: '100%',
  },

  sideMenuStyle: {
    margin: 0,
    width: width * 0.75, // SideMenu width
  },
});

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(SignIn);
