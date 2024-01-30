import React from 'react';
import {
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import images from '../assets/images/images';
import CustomCard from '../components/card';
import EnglishLan from '../translations/en.json';
import ArabicLan from '../translations/ar.json';
import strings from '../translations/translateConstant';
import ValidationComponent from '../../ValidationComponent';
import {Alert} from 'react-native';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {contactUs} from '../actions/contactUs.action';
import {Appbar} from 'react-native-paper';
import SimpleToast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

var applanguage = '';
var lanStaticData = [];

class ContactUs extends ValidationComponent {
  constructor(props) {
    const labels = {
      name: 'Full Name',
      mobile_no: 'Mobile Number',
      email_id: 'Email ID',
      message: 'Message',
    };

    AsyncStorage.getItem('UniversalAppLanguage').then(value => {
      console.log('Sign up language');
      console.log(value);
      if (value === 'ar') {
        labels.name = 'الاسم الكامل';
        labels.mobile_no = 'رقم الجوال';
        labels.email_id = 'البريد الإلكتروني';
        labels.message = 'الرسائل';
      }
    });
    super({...props, labels});
    this.props = props;
    this.state = {
      applanguage: '',
      lanStaticData: [],
      name: '',
      email_id: '',
      mobile_no: '',
      message: '',
    };
  }

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

  componentDidMount = async () => {
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

    this.setState({});
  };

  onPressButton = () => {
    this.validate({
      name: {required: true},
      email_id: {required: true, email: true},
      mobile_no: {required: true, minlength: 10},
      message: {required: true},
    });

    if (this.getErrorMessages()) {
    } else {
      this.handleContact();
    }
  };

  handleContact = () => {
    try {
      const {navigation, dispatch} = this.props;
      const {navigate} = this.props.navigation;

      dispatch(
        contactUs(
          this.state.name,
          this.state.email_id,
          this.state.mobile_no,
          this.state.message,
        ),
      )
        .then(response => {
          console.log('contactUs dispatch response: ');
          console.log(response);
          if (response && typeof response !== 'undefined' && response !== '') {
            this.setState({progress: false});

            SimpleToast.show(strings.thanksforContact, SimpleToast.SHORT);
            this.props.navigation.replace('home');
          } else {
            this.setState({progress: false});
            SimpleToast.show(strings.someError, SimpleToast.SHORT);
          }
        })
        .catch(error => {
          this.setState({progress: false});
          console.log('contactUs dispatch error: ');
          console.log(error);
        });
    } catch (errorCatch) {
      console.log('errorCatch.message');
      this.setState({progress: false});
    }
  };
  render() {
    return (
      <View style={{flex: 1, overflow: 'hidden'}}>
        <Appbar style={{elevation: 0, zIndex: 1, backgroundColor: 'white'}}>
          <Appbar.BackAction
            onPress={props => {
              this.props.navigation.goBack();
            }}
          />
        </Appbar>

        <ImageBackground
          source={images.harrj_bg}
          resizeMode="stretch"
          style={{height: '100%'}}>
          <View
            style={{
              alignSelf: 'center',
              height: '100%',
              paddingBottom: 50,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* HARRJ LOGO */}

              <View style={{height: 0}}>
                <Image
                  style={{
                    height: 50,
                    marginTop: '10%',
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                  source={images.ic_harjj_logo}
                />
              </View>

              <View
                style={{
                  marginTop: '30%',
                  flex: 1,
                  marginBottom: '10%',
                  width: '85%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <View style={{flexDirection: 'column'}}>
                  <View style={{alignItems: 'center', marginBottom: 28}}>
                    <Text
                      style={{
                        fontSize: 30,
                        fontFamily: 'Cairo-SemiBold',
                        color: '#505B98',
                      }}>
                      {strings.GetinTouch}
                    </Text>
                  </View>

                  {/* Name Input */}
                  <View style={style.textInputView}>
                    <Ionicons
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginLeft: 18,
                      }}
                      name="person"
                      color="#2D2C71"
                      size={24}
                    />

                    <TextInput
                      style={style.textInput}
                      underlineColorAndroid="transparent"
                      placeholder={strings.fullname}
                      placeholderTextColor="#2D2C71"
                      autoCapitalize="none"
                      keyboardType="default"
                      ref={'name'}
                      value={this.state.name}
                      onChangeText={itemValue =>
                        this.setState({name: itemValue})
                      }
                    />
                  </View>

                  {this.isFieldInError('name') &&
                    this.getErrorsInField('name').map(errorMessage => (
                      <Text style={style.error_text}>
                        {errorMessage}
                        {/* {strings.fieldName} */}
                      </Text>
                    ))}

                  {/* Email Input */}
                  <View style={style.textInputView}>
                    <Ionicons
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginLeft: 18,
                      }}
                      name="mail"
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
                      onChangeText={itemValue =>
                        this.setState({email_id: itemValue})
                      }
                      keyboardType="email-address"
                    />
                  </View>

                  {this.isFieldInError('email_id') &&
                    this.getErrorsInField('email_id').map(errorMessage => (
                      <Text style={style.error_text}>{errorMessage}</Text>
                    ))}

                  {/* Mobile Number Input */}

                  <View style={style.textInputView}>
                    <MaterialCommunityIcons
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
                      keyboardType="number-pad"
                      ref={'mobile_no'}
                      value={this.state.mobile_no}
                      onChangeText={itemValue =>
                        this.setState({mobile_no: itemValue})
                      }
                    />
                  </View>

                  {this.isFieldInError('mobile_no') &&
                    this.getErrorsInField('mobile_no').map(errorMessage => (
                      <Text style={style.error_text}>{errorMessage}</Text>
                    ))}

                  {/* Message Input */}

                  <View style={style.MsgInputView}>
                    <TextInput
                      style={style.MsgtextInput}
                      underlineColorAndroid="transparent"
                      placeholder={strings.contactmsg}
                      placeholderTextColor="#2D2C71"
                      autoCapitalize="none"
                      onChangeText={itemValue =>
                        this.setState({message: itemValue})
                      }
                      multiline={true}
                      numberOfLines={3}
                      value={this.state.message}
                      ref={'message'}
                    />
                  </View>

                  {this.isFieldInError('message') &&
                    this.getErrorsInField('message').map(errorMessage => (
                      <Text style={style.error_text}>{errorMessage}</Text>
                    ))}

                  {/* send Button */}

                  <View style={{flexDirection: 'column'}}>
                    <TouchableOpacity
                      onPress={this.onPressButton}
                      style={{
                        height: 60,
                        backgroundColor: '#505B98',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontFamily: 'Cairo-Bold',
                          color: 'white',
                        }}>
                        {strings.contact}
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

// export default ContactUs

const style = StyleSheet.create({
  textInputView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 80,
    flex: 1,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#2D2C71',
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
  },

  MsgInputView: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    flex: 1,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#2D2C71',
    marginBottom: 10,
    justifyContent: 'center',
    height: 100,
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
  MsgtextInput: {
    borderBottomColor: '#FFFFFF',
    paddingHorizontal: 15,
    width: '100%',
    textAlign: 'left',
    alignSelf: 'center',
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    tintColor: '#2D2C71',
  },
  image: {
    flex: 1,
    height: Dimensions.get('window').height / 1.5,
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(ContactUs);
