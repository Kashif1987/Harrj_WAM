import React from 'react';
import {
  AsyncStorage,
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
import {Actions} from 'react-native-router-flux';
import SimpleToast from 'react-native-simple-toast';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {compose} from 'redux';
import ValidationComponent from '../../../ValidationComponent';
import {userRegister} from '../../actions/userRegister.action';
import images from '../../assets/images/images';
import strings from '../../translations/translateConstant';

class SignUp extends ValidationComponent {
  constructor(props) {
    const labels = {
      name: 'Full Name',
      mobile_no: 'Mobile Number',
      email_id: 'Email ID',
      password: 'Password',
    };

    AsyncStorage.getItem('UniversalAppLanguage').then(value => {
      console.log('Sign up language');
      console.log(value);
      if (value === 'ar') {
        labels.name = 'الاسم الكامل';
        labels.mobile_no = 'رقم الجوال';
        labels.email_id = 'البريد الإلكتروني';
        labels.password = 'كلمة المرور';
      }
    });

    super({...props, labels});
    this.props = props;
    this.state = {
      progress: false,
      email_id: '',
      password: '',
      error: '',
      mobile_no: '',
      name: '',
      applanguage: '',
      lanStaticData: [],
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

    this.handleLogin = this.handleLogin.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
    this.openSignIn = this.openSignIn.bind(this);
  }

  componentDidMount = () => {
    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
        if (value != null) {
          strings.setLanguage(value);
        } else {
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }

    this.setState({});
  };

  openSignIn = () => {
    this.props.navigation.navigate('sign_in');
  };
  openHome = () => {
    this.props.navigation.navigate('main_home');
  };

  onPressButton = () => {
    this.validate({
      name: {required: true},
      mobile_no: {required: true, minlength: 10},
      email_id: {required: true, email: true},
      password: {required: true},
    });

    if (this.getErrorMessages()) {
    } else {
      this.handleLogin();
    }
  };

  handleLogin = () => {
    this.setState({progress: true});
    try {
      const {navigation, dispatch} = this.props;
      const {navigate} = this.props.navigation;

      // var mobile_no = this.state.mobilePhoneCode + " " + this.state.mobilePhone;

      dispatch(
        userRegister(
          this.state.name,
          this.state.mobile_no,
          this.state.email_id,
          this.state.password,
        ),
      )
        .then(response => {
          console.log('dispatch response: ');
          console.log(response);

          var uniqueMsg = 'Email Id & Mobile No must be unique';
          var uniqueRes = response.message;

          if (uniqueRes === uniqueMsg) {
            SimpleToast.show(strings.mustUnique, SimpleToast.SHORT);
          } else if (
            response &&
            typeof response !== 'undefined' &&
            response !== '' 
          ) {
            this.setState({progress: false});

            // Alert.alert(strings.RegisteredSuccessfullyPleaseLogin);
            SimpleToast.show(
              strings.RegisteredSuccessfullyPleaseLogin,
              SimpleToast.SHORT,
            );
            this.props.navigation.navigate('sign_in');
          } else {
            this.setState({progress: false});
            SimpleToast.show(strings.someError, SimpleToast.SHORT);

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

  signup = () => {
    Actions.register();
  };

  render() {
    return (
      <View style={{flex: 1}}>
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
              {/* Harrj Logo  */}

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
                  marginTop: '55%',
                  flex: 1,
                  marginBottom: '10%',
                  width: '85%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'column', flex: 1}}>
                  {/* Full Name Input */}
                  <View>
                    <View style={style.textInputView}>
                      <MaterialIcons
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          marginLeft: 18,
                        }}
                        name="person-outline"
                        color="#2D2C71"
                        size={24}
                      />

                      <TextInput
                        style={style.textInput}
                        underlineColorAndroid="transparent"
                        placeholder={strings.fullname}
                        placeholderTextColor="#2D2C71"
                        autoCapitalize="none"
                        ref="name"
                        value={this.state.name}
                        onChangeText={(itemValue, itemIndex) =>
                          this.setState({name: itemValue})
                        }
                        keyboardType="default"
                      />
                    </View>
                    {this.isFieldInError('name') &&
                      this.getErrorsInField('name').map(errorMessage => (
                        <Text style={style.error_text}>
                          {/* {strings.fieldName}   */}
                          {errorMessage}
                        </Text>
                      ))}
                  </View>

                  {/* Mobile Number Input */}
                  <View>
                    <View style={style.textInputView}>
                      <Feather
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          marginLeft: 18,
                        }}
                        name="phone"
                        color="#2D2C71"
                        size={24}
                      />

                      <TextInput
                        style={style.textInput}
                        underlineColorAndroid="transparent"
                        placeholder={strings.Mobile}
                        placeholderTextColor="#2D2C71"
                        autoCapitalize="none"
                        ref="mobile_no"
                        value={this.state.mobile_no}
                        onChangeText={(itemValue, itemIndex) =>
                          this.setState({mobile_no: itemValue})
                        }
                        keyboardType="number-pad"
                        maxLength={10}
                      />
                    </View>
                    {this.isFieldInError('mobile_no') &&
                      this.getErrorsInField('mobile_no').map(errorMessage => (
                        <Text style={style.error_text}>
                          {/* {strings.fieldMobile} */}
                          {errorMessage}
                        </Text>
                      ))}
                  </View>

                  {/* Email Input */}
                  <View>
                    <View style={style.textInputView}>
                      <MaterialCommunityIcons
                        style={{
                          flexDirection: 'row',
                          alignSelf: 'center',
                          marginLeft: 18,
                        }}
                        name="email-outline"
                        color="#2D2C71"
                        size={24}
                      />

                      <TextInput
                        style={style.textInput}
                        underlineColorAndroid="transparent"
                        placeholder={strings.Email}
                        placeholderTextColor="#2D2C71"
                        autoCapitalize="none"
                        ref="email_id"
                        value={this.state.email_id}
                        onChangeText={(itemValue, itemIndex) =>
                          this.setState({email_id: itemValue})
                        }
                        keyboardType="email-address"
                      />
                    </View>
                    {this.isFieldInError('email_id') &&
                      this.getErrorsInField('email_id').map(errorMessage => (
                        <Text style={style.error_text}>
                          {/* {strings.fieldEmail} */}
                          {errorMessage}
                        </Text>
                      ))}
                  </View>

                  {/* Password Input */}
                  <View>
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
                        <Text style={style.error_text}>{errorMessage}</Text>
                      ))}
                  </View>

                  {/* Register Button */}

                  <View style={{flexDirection: 'column', marginTop: '1%'}}>
                    <TouchableOpacity
                      style={{
                        height: 50,
                        backgroundColor: '#505B98',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 2,
                      }}
                      onPress={this.onPressButton}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontFamily: 'Cairo-Bold',
                          color: 'white',
                        }}>
                        {strings.SignUp}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{flexDirection: 'column', marginTop: '25%'}}>
                    <TouchableOpacity
                      style={{
                        height: 50,
                        borderRadius: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={this.openSignIn}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Cairo-SemiBold',
                          color: 'white',
                        }}>
                        {strings.haveAcc}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

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
    marginTop: 10,
    marginBottom: 15,
  },

  textInput: {
    borderBottomColor: '#FFFFFF',
    paddingHorizontal: 15,
    width: '88%',
    textAlign: 'left',
    alignSelf: 'center',
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    tintColor: '#2D2C71',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    height: Dimensions.get('window').height / 1.43,
    transform: [{scaleX: 1.8}, {scaleY: 1.25}],
  },

  error_text: {
    padding: 10,
    color: 'red',
    backgroundColor: '#ffebe6',
    borderRadius: 24,
    marginBottom: 10,
  },
});

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(SignUp);
