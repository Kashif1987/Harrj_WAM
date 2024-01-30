import React from 'react';
import {
  Alert,
  AsyncStorage,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomCard from '../../components/card';
import EnglishLan from '../../translations/en.json';
import ArabicLan from '../../translations/ar.json';
import images from '../../assets/images/images';
import ValidationComponent from '../../../ValidationComponent';
import { Modal } from 'react-native';
import { Button, Divider, IconButton } from 'react-native-paper';
import OTPTextView from 'react-native-otp-textinput';
import strings from '../../translations/translateConstant';
import {
  checkOTPService,
  forgotPasswordService,
  updatePasswordService,
} from '../../actions/forgotPassword.action';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { string } from 'prop-types';
import SimpleToast from 'react-native-simple-toast';

var applanguage = '';
var lanStaticData = [];

class ForgotPassword extends ValidationComponent<{}> {
  constructor(props) {
    const labels = {
      email_id: 'Email ID',
    };

    AsyncStorage.getItem('UniversalAppLanguage').then((value) => {
      console.log('Sign up language');
      console.log(value);
      if (value === 'ar') {
        labels.email_id = 'البريد الإلكتروني';
      }
    });

    super({ ...props, labels });
    this.props = props;
    this.state = {
      applanguage: '',
      lanStaticData: [],
      email_id: '',
      OTPModalVisible: false,
      resetPasswordModal: false,
      otpInput: '',
      inputText: '',

      password: '', // to store password
      passwordErrorMessage: '', // password error message
      confirmPassword: '', // to store password
      confirmPasswordErrorMessage: '',
    };
  }

  formValidation = async () => {
    // input validation
    if (this.state.password.length == 0) {
      this.setState({ passwordErrorMessage: strings.fieldPassword });
    } else if (this.state.password !== this.state.confirmPassword) {
      errorFlag = true;
      this.setState({ confirmPasswordErrorMessage: strings.SamePassword });
    }
    if (this.state.confirmPassword.length == 0) {
      errorFlag = true;
      this.setState({ confirmPasswordErrorMessage: strings.ConfirmPassReq });
    } else if (this.state.password === this.state.confirmPassword) {
      console.log('this.state.password');
      console.log(this.state.password);
      console.log('this.state.confirmPassword');
      console.log(this.state.confirmPassword);

      try {
        const { dispatch } = this.props;
        const { navigate } = this.props.navigation;

        dispatch(
          updatePasswordService(this.state.email_id, this.state.password)
        )
          .then((response) => {
            console.log('dispatch forgotPassword response get banners: ');
            console.log(response);
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              if (response.success) {
                // Alert.alert("Password has been updated");
                SimpleToast.show(strings.PasswordUpdated, SimpleToast.SHORT);
                this.setResetPassModalVisible(false);
                setTimeout(() => {
                  this.props.navigation.goBack();
                }, 500);
              } else {
                // Alert.alert(response.message)
              }
              this.setState({ productList: response.data });

              console.log('Else Clicked');
            } else {
              this.setState({ progress: false });
              SimpleToast.show(strings.someError, SimpleToast.SHORT);
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch((error) => {
            this.setState({ progress: false });
            console.log('forgotPassword dispatch error: ');
            console.log(error);
            // Alert.alert(error.message);
          });
      } catch (errorCatch) {
        // Alert.alert(errorCatch.message);
        console.log(' catch forgotPassword dispatch error: ');
        console.log(errorCatch);
        this.setState({ progress: false });
      }
    }
  };

  onPressButton = () => {
    console.log('Pressed');
    this.validate({
      email_id: { required: true, email: true },
    });

    if (this.getErrorMessages()) {
      // Alert.alert("Form Not Validate..");
      // Alert.alert("Please enter valid a Email ID");
      // this.setOTPModalVisible(false)
      // this.OTPModal()
    } else {
      // Alert.alert('Check your Email for the OTP');
      // this.setOTPModalVisible(true);
      // this.OTPModal()
      console.log('Else Clicked');

      try {
        const { dispatch } = this.props;
        const { navigate } = this.props.navigation;

        dispatch(forgotPasswordService(this.state.email_id))
          .then((response) => {
            console.log('dispatch forgotPassword response : ');
            console.log(response);

            var mailSentRes = 'Mail sent ';
            var mailSent = 'Mail has been sent';

            var responseErrorMgs = 'Something Went Wrong...in mail';
            var responseError = 'User not found';

            if (mailSentRes === response.message) {
              console.log('Simple Taost');
              SimpleToast.show(strings.MailSent, SimpleToast.SHORT);
            }

            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              // this.setState({ productList: response.data });
              if (response.success) {
                this.setOTPModalVisible(true);
                this.OTPModal();
                console.log('Else Clicked');
              } else {
                this.setOTPModalVisible(false);
                if (responseErrorMgs === response.message) {
                  SimpleToast.show(strings.UserNotFound, SimpleToast.SHORT);
                }
                // Alert.alert(response.message);
              }
            } else {
              this.setState({ progress: false });
              SimpleToast.show(strings.someError, SimpleToast.SHORT);
              // Alert.alert('something went wrong..!!');
            }
          })
          .catch((error) => {
            this.setState({ progress: false });
            console.log('forgotPassword dispatch error: ');
            console.log(error);
            this.setOTPModalVisible(false);

            // Alert.alert(error.message);
            SimpleToast.show(strings.someError, SimpleToast.SHORT);
          });
      } catch (errorCatch) {
        // Alert.alert(errorCatch.message);
        console.log(' catch forgotPassword dispatch error: ');
        console.log(errorCatch);
        this.setOTPModalVisible(false);

        this.setState({ progress: false });
      }
    }
  };

  setOTPModalVisible = (visible) => {
    this.setState({ OTPModalVisible: visible });
  };

  setResetPassModalVisible = (visible) => {
    this.setState({ resetPasswordModal: visible });
  };

  checkOTP = () => {
    // will automatically trigger handleOnTextChange callback passed
    this.input1.setValue(this.state.inputText);
    console.log('this.state.inputText');
    console.log(this.state.inputText);

    try {
      const { dispatch } = this.props;
      const { navigate } = this.props.navigation;

      dispatch(checkOTPService(this.state.email_id, this.state.inputText))
        .then((response) => {
          console.log('dispatch forgotPassword response get banners: ');
          console.log(response);
          if (response && typeof response !== 'undefined' && response !== '') {
            if (response.success) {
              Alert.alert(strings.Alert, strings.VerifiedOTP, [
                {
                  text: strings.resetPass,
                  onPress: () => {
                    console.log('reset');
                    this.setOTPModalVisible(false);
                    this.setResetPassModalVisible(true);
                    console.log('Password');
                    // this.resetPassword();
                  },
                },
              ]);
            } else {
              // Alert.alert(response.message);
              SimpleToast.show(strings.someError, SimpleToast.SHORT);
            }
            this.setState({ productList: response.data });

            console.log('Else Clicked');
          } else {
            this.setState({ progress: false });
            SimpleToast.show(strings.someError, SimpleToast.SHORT);
            // Alert.alert('something went wrong..!!');
          }
        })
        .catch((error) => {
          this.setState({ progress: false });
          console.log('forgotPassword dispatch error: ');
          console.log(error);
          // Alert.alert(error.message);
        });
    } catch (errorCatch) {
      // Alert.alert(errorCatch.message);
      console.log(' catch forgotPassword dispatch error: ');
      console.log(errorCatch);
      this.setState({ progress: false });
    }
  };

  OTPModal = () => {
    return (
      <Modal
        animationType="fade"
        visible={this.state.OTPModalVisible}
        onRequestClose={() => this.setOTPModalVisible(false)}
        transparent={true}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <IconButton
              icon="close"
              color="#505B98"
              style={{ alignSelf: 'flex-end' }}
              onPress={() => this.setOTPModalVisible(false)}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Cairo-SemiBold',
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
            >
              {strings.otpDisc}
            </Text>

            <View style={{ marginTop: 20 }}>
              <OTPTextView
                ref={(e) => (this.input1 = e)}
                handleTextChange={(text) => this.setState({ inputText: text })}
                inputCount={4}
                keyboardType="numeric"
                containerStyle={style.textInputContainer}
                textInputStyle={style.roundedTextInput}
                tintColor="#2D2C71"
              />
            </View>

            <TouchableOpacity onPress={this.checkOTP} style={style.otpButton}>
              <Text
                style={{ fontSize: 18, fontFamily: 'Cairo-Bold', color: 'red' }}
              >
                {strings.verifyOTP}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  resetPassword = () => {
    return (
      <Modal
        animationType="fade"
        visible={this.state.resetPasswordModal}
        onRequestClose={() => this.setResetPassModalVisible(false)}
        transparent={true}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <IconButton
              icon="close"
              color="#505B98"
              style={{ alignSelf: 'flex-end' }}
              onPress={() => this.setResetPassModalVisible(false)}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Cairo-SemiBold',
                textAlign: 'center',
                textAlignVertical: 'center',
                marginBottom: 25,
              }}
            >
              {strings.resetPass}
            </Text>

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
                  this.setState({ password: itemValue })
                }
                keyboardType="default"
                secureTextEntry={true}
              />
              <View style={{ marginTop: 5 }} />
            </View>

            {this.state.passwordErrorMessage.length > 0 && (
              <Text style={style.error_text}>
                {this.state.passwordErrorMessage}
              </Text>
            )}

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
                placeholder={strings.ConfirmPassword}
                placeholderTextColor="#2D2C71"
                autoCapitalize="none"
                ref="confirmPassword"
                value={this.state.confirmPassword}
                onChangeText={(itemValue, itemIndex) =>
                  this.setState({ confirmPassword: itemValue })
                }
                keyboardType="default"
                secureTextEntry={true}
              />
            </View>
            {/* <View style={{ marginTop: 10 }} />  */}
            {this.state.confirmPasswordErrorMessage.length > 0 && (
              <Text style={style.error_text}>
                {this.state.confirmPasswordErrorMessage}
              </Text>
            )}

            <View style={{ marginTop: 20 }}></View>

            <TouchableOpacity
              onPress={this.formValidation}
              style={style.otpButton}
            >
              <Text
                style={{ fontSize: 22, fontFamily: 'Cairo-Bold', color: 'red' }}
              >
                {strings.resetPass}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Change Language

  langFun = () => {
    AsyncStorage.getItem('AppLanguage').then((value) => {
      if (value != null) {
        this.setState({ applanguage: value });
        applanguage = value;
      } else {
        console.log('elses');
      }
    });
  };

  componentDidMount = async () => {
    await this.langFun();
    if (
      applanguage &&
      typeof applanguage !== 'undefined' &&
      applanguage === 'en'
    ) {
      this.setState({ lanStaticData: EnglishLan });
      lanStaticData = EnglishLan;
    } else {
      if (
        applanguage &&
        typeof applanguage !== 'undefined' &&
        applanguage === 'ar'
      ) {
        this.setState({ lanStaticData: ArabicLan });
        lanStaticData = ArabicLan;
      }
    }
  };

  // forgotPassword = () => {
  //     try {
  //         const { dispatch } = this.props;
  //         const { navigate } = this.props.navigation;

  //         dispatch(forgotPasswordService())
  //             .then((response) => {
  //                 console.log("dispatch forgotPassword response get banners: ");
  //                 console.log(response);
  //                 if (response && typeof response !== "undefined" && response !== "") {
  //                     this.setState({ progress: false });
  //                     var responseData = response.data;
  //                 } else {
  //                     this.setState({ progress: false });
  //                     Alert.alert('something forgotPassword went wrong..!!');
  //                 }
  //             })
  //             .catch((error) => {
  //                 this.setState({ progress: false });
  //                 console.log("forgotPassword dispatch error: ");
  //                 console.log(error);
  //                 Alert.alert(error.message);
  //             });
  //     } catch (errorCatch) {
  //         Alert.alert(errorCatch.message);
  //         this.setState({ progress: false });
  //     }
  // }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={images.harrj_bg}
          resizeMode="stretch"
          style={{ height: '100%' }}
        >
          {/* <ImageBackground source={images.bgellipse} resizeMode="stretch" style={style.image} > */}

          <View
            style={{
              alignSelf: 'center',
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* HARRJ LOGO */}

              <View style={{ height: 0 }}>
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
                  marginTop: '60%',
                  flex: 1,
                  marginBottom: '10%',
                  width: '85%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              >
                <View style={{ alignItems: 'center', marginBottom: '13%' }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'Cairo-Bold',
                      color: '#2D2C71',
                    }}
                  >
                    {strings.ForgotPass}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Cairo-SemiBold',
                      color: '#2D2C71',
                      marginTop: '8%',
                    }}
                  >
                    {strings.forgotText}
                  </Text>
                </View>

                {/* Email Text Input */}
                <View>
                  <View style={style.textInputView}>
                    {/* <Image style={{ width: 24, height: 24, marginLeft: 18, marginRight: 10, marginVertical: 8, tintColor: '#2d2c71' }}
                                        source={images.ic_email} /> */}

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
                      keyboardType="email-address"
                      ref="email_id"
                      value={this.state.email_id}
                      onChangeText={(itemValue, itemIndex) =>
                        this.setState({ email_id: itemValue })
                      }
                    />
                  </View>
                  {this.isFieldInError('email_id') &&
                    this.getErrorsInField('email_id').map((errorMessage) => (
                      <Text style={style.error_text}>
                        {/* {strings.fieldEmail} */}
                        {errorMessage}
                      </Text>
                    ))}
                </View>

                <View style={{ flexDirection: 'column', marginTop: '5%' }}>
                  <TouchableOpacity
                    onPress={this.onPressButton}
                    style={{
                      height: 50,
                      backgroundColor: '#505B98',
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: 'Cairo-Bold',
                        color: 'white',
                      }}
                    >
                      {strings.forgotBtn}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Divider */}

                {/* <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    marginTop: 30,
                  }}
                >
                  <Divider
                    style={{ height: 1, backgroundColor: 'black', flex: 1 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Cairo-Bold',
                      color: 'black',
                      marginHorizontal: 15,
                    }}
                  >
                    {strings.or}
                  </Text>
                  <Divider
                    style={{ height: 1, backgroundColor: 'black', flex: 1 }}
                  />
                </View> */}

                {/* Login Button */}

                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '50%',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#ffffff',
                        fontFamily: 'Cairo-Bold',
                      }}
                    >
                      {strings.RememberPass}{' '}
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#ffffff',
                        }}
                      >
                        {strings.Login}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                {this.OTPModal()}
                {this.resetPassword()}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        {/* </ImageBackground > */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ForgotPassword
);

const style = StyleSheet.create({
  textInputView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#2D2C71',
    marginBottom: 10,
    height: 50,
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
    height: Dimensions.get('window').height / 1.3,
    transform: [{ scaleX: 1.8 }, { scaleY: 1.25 }],
  },
  modal: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D2C71',
    width: '70%',
    marginTop: 15,
    marginHorizontal: 10,

    // marginTop: 80,
    // marginLeft: 40,
  },

  otpButton: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2D2C71',
    // alignItems: "center",
    shadowColor: '#000',
    // alignSelf:'flex-end',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // width: 250
  },
  resetModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2D2C71',
    // alignItems: "center",
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

  error_text: {
    padding: 10,
    color: 'red',
    backgroundColor: '#ffebe6',
    borderRadius: 24,
    margin: 5,
    marginBottom: 10,
  },
});
