import React from 'react';
import {
  AsyncStorage,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import ValidationComponent from '../../ValidationComponent';
import images from '../assets/images/images';
import strings from '../translations/translateConstant';
import * as Keychain from 'react-native-keychain';
import {userUpdateAction} from '../actions/userProfile.action';
import SimpleToast from 'react-native-simple-toast';

export class ProfileUpdate extends ValidationComponent {
  constructor(props) {
    const labels = {
      name: 'Full Name',
      mobile_no: 'Mobile Number',
      email_id: 'Email ID',
    };

    AsyncStorage.getItem('UniversalAppLanguage').then(value => {
      console.log('Sign up language');
      console.log(value);
      if (value === 'ar') {
        labels.name = 'الاسم الكامل';
        labels.mobile_no = 'رقم الجوال';
        labels.email_id = 'البريد الإلكتروني';
      }
    });
    super({...props, labels});
    this.props = props;

    this.state = {
      progress: false,
      email_id: '',
      mobile_no: '',
      name: '',
    };
  }

  onValidate = () => {
    this.validate({
      name: {required: true},
      mobile_no: {required: true, minlength: 10},
      email_id: {required: true, email: true},
    });

    if (this.getErrorMessages()) {
    } else {
      this.updateUser();
    }
  };

  componentDidMount() {
    this.getprofileData();
  }

  // get user profile

  getprofileData() {
    AsyncStorage.getItem('userName').then(value => {
      this.setState({name: value});
    });

    AsyncStorage.getItem('userEmail_id').then(value => {
      this.setState({email_id: value});
    });

    AsyncStorage.getItem('userMobileId').then(value => {
      this.setState({mobile_no: value});
    });
  }

  async updateUser() {
    try {
      this.setState({progress: true});
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        var id = sessionData.user_id;
        dispatch(
          userUpdateAction(
            authToken,
            id,
            this.state.name,
            this.state.email_id,
            this.state.mobile_no,
          ),
        )
          .then(response => {
            if (
              response &&
              typeof response !== 'undefined' &&
              response !== ''
            ) {
              setTimeout(() => {
                SimpleToast.show(strings.updateRes, SimpleToast.SHORT);
                this.userLogoutFun();
              }, 300);
            } else {
              this.setState({progress: false});
              SimpleToast.show(strings.someError, SimpleToast.SHORT);
            }
          })
          .catch(error => {
            console.log('dispatch error: ', error);
            this.setState({progress: false});
          });
      });
    } catch (error) {
      this.setState({progress: false});
    }
  }

  userLogoutFun = async () => {
    try {
      await Keychain.resetGenericPassword();
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('userName');
      AsyncStorage.removeItem('userRole');

      this.props.navigation.replace('sign_in');
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}>
        <ImageBackground
          source={images.harrj_bg}
          resizeMode="stretch"
          style={{height: '100%'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Appbar.Header
              style={{backgroundColor: 'transparent', elevation: 0}}>
              <Appbar.BackAction
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
              <Appbar.Content
                title={strings.UpdateProfile}
                titleStyle={{
                  color: '#505B98',
                  fontFamily: 'Cairo-Bold',
                  fontSize: 24,
                }}
              />
            </Appbar.Header>

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
                    <Text style={style.error_text}>{errorMessage}</Text>
                  ))}
              </View>

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
                    <Text style={style.error_text}>{errorMessage}</Text>
                  ))}
              </View>

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
                    <Text style={style.error_text}>{errorMessage}</Text>
                  ))}
              </View>

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
                  onPress={this.onValidate}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: 'Cairo-Bold',
                      color: 'white',
                    }}>
                    {strings.update}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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

  error_text: {
    padding: 10,
    color: 'red',
    backgroundColor: '#ffebe6',
    borderRadius: 24,
    marginBottom: 10,
  },
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(ProfileUpdate);
