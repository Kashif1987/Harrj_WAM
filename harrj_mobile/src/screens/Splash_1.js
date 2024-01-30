import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, Platform, View} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {connect} from 'react-redux';
import {compose} from 'redux';
import ValidationComponent from '../../ValidationComponent';
import images from '../assets/images/images';
import strings from '../translations/translateConstant';
import VersionInfo from 'react-native-version-info';
import {Text} from 'react-native';
import {userInfoAction} from '../actions/userInfo';
import {getMyBiderProductList} from '../actions/getMyBiderProduct.action';
import SimpleToast from 'react-native-simple-toast';

class Splash_1 extends ValidationComponent<{}> {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      progress: false,
      email_id: '',
      password: '',
      error: '',
    };
    this.retrieveUserSession = this.retrieveUserSession.bind(this);
  }

  componentDidMount() {
    // this.retrieveUserSession();
    this.BidListFun();

    try {
      AsyncStorage.getItem('UniversalAppLanguage').then(value => {
        console.log('Value');
        console.log(value);
        if (value && typeof value !== 'undefined' && value !== '') {
          console.log('Value');
          console.log(value);
        } else {
          AsyncStorage.getItem('UniversalAppLanguage').then(value => {
            AsyncStorage.setItem('UniversalAppLanguage', 'ar');
            console.log('componentDidmount if');
            console.log(value);
            strings.setLanguage('ar');
            console.log(value);
          });
        }
      });
    } catch (error) {
      console.log('Try catch componentDidmount');
      console.log(error);
    }
  }

  componentWillMount() {}

  getUserInfoFun = async () => {
    const {dispatch} = this.props;
    var email = '';
    var token = '';
    AsyncStorage.getItem('userEmail_id').then(value => {
      email = value;
      console.log('USER INFO:', email);
    });
    Keychain.getGenericPassword().then(value => {
      let data = JSON.parse(value.password);
      token = data.token;
      console.log(token);
      dispatch(userInfoAction(email, token))
        .then(response => {
          try {
            AsyncStorage.setItem('userId', response.data[0].id.toString());
            AsyncStorage.setItem('userMobileId', response.data[0].mobile_no);
            AsyncStorage.setItem('userName', response.data[0].name);
            AsyncStorage.setItem('userEmail_id', response.data[0].email_id);
            AsyncStorage.setItem('userRole', response.data[0].role);
          } catch (e) {
            // console.log(e);
          }
        })
        .catch(err => {
          // console.log(err);
        });
    });
  };

  retrieveUserSession = async () => {
    try {
      Keychain.getGenericPassword() // Retrieve the credentials from the keychain
        .then(async credentials => {
          let sessionData = JSON.parse(credentials.username);
          console.log('sessionData: ');
          console.log(sessionData);
          if (
            sessionData.is_authenticated &&
            typeof sessionData.is_authenticated !== 'undefined' &&
            sessionData.is_authenticated !== ''
          ) {
            this.setState({is_authenticated: sessionData.is_authenticated});

            await this.getUserInfoFun();

            setTimeout(() => {
              this.props.navigation.replace('home');
            }, 2000);
          }
        })
        .catch(() => {
          Keychain.resetGenericPassword();
          setTimeout(() => {
            this.props.navigation.replace('home');
          }, 2000);
          //Alert.alert(errorKeychain.message);
        });
    } catch (errorRetrieveUserSession) {
      //Alert.alert(errorRetrieveUserSession.message);
    }
  };

  BidListFun = async () => {
    console.log('bid List');

    try {
      const {dispatch} = this.props;
      const {navigate} = this.props.navigation;

      await Keychain.getGenericPassword().then(async credentials => {
        var sessionData = JSON.parse(credentials.password);

        var authToken = sessionData.token;
        console.log('Auth Token:', authToken);

        var userID = sessionData.user_id;
        console.log('userID:', userID);

        dispatch(getMyBiderProductList(authToken, userID))
          .then(response => {
            setTimeout(() => {
              this.props.navigation.replace('home');
            }, 2000);
          })
          .catch(error => {
            console.log('error :', error.response.data.success);
            setTimeout(() => {
              this.props.navigation.replace('sign_in');
              SimpleToast.show(strings.sessionExp, SimpleToast.SHORT);
              Keychain.resetGenericPassword();
              AsyncStorage.removeItem('userId');
              AsyncStorage.removeItem('token');
              AsyncStorage.removeItem('userName');
              AsyncStorage.removeItem('userRole');
            }, 2000);
          });
      });
    } catch (error) {
      this.retrieveUserSession();
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('userName');
      AsyncStorage.removeItem('userRole');
    }
  };

  render() {
    const {handleSubmit, loginUser} = this.props;

    return (
      <View
        style={{
          backgroundColor: '#FAFAFA',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            resizeMode: 'contain',
            height: 400,
            width: 170,
          }}
          source={images.ic_harjj_logo}
        />

        <Text
          style={{
            color: '#505B98',
            fontFamily: 'Cairo-Bold',
            fontSize: 14,
          }}>
          {/* Version: {VersionInfo.appVersion} */}
          {strings.version}: {VersionInfo.appVersion}
        </Text>

        <Text
          style={{
            textTransform: 'capitalize',
            color: '#505B98',
            fontFamily: 'Cairo-Bold',
            textAlign: 'left',
            fontSize: 14,
          }}>
          {/* Platform: {Platform.OS} */}
          {strings.platform}: {Platform.OS}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  loginUser: state.authReducer.loginUser,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(Splash_1);
