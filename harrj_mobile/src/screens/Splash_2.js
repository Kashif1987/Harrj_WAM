import React, { Component, useState  } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Icon,
  ImageBackground
} from 'react-native';

import * as Keychain from 'react-native-keychain';
import EncryptedStorage from 'react-native-encrypted-storage';

import {connect} from "react-redux";
import {compose} from "redux";
import { Field, reduxForm } from 'redux-form';

import {userLogin} from "../actions/userLogin.action";
import {Actions} from 'react-native-router-flux';

import images from '../assets/images/images';

const styles = require('../assets/css/style');

import ValidationComponent from '../../ValidationComponent';

class Splash_2 extends ValidationComponent<{}> {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      progress: false,
      email_id: '',
      password: '',
      error: '',
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  onPressButton = () => {
    this.validate({
      email_id: {required: true, email: true},
      password: {required: true, minlength:8, hasUpperCase:true, hasLowerCase:true, hasSpecialCharacter:true},
      //password: {required: true},
    });

    if(this.getErrorMessages()){
      Alert.alert("Form Not Validate..");
    }else{
      this.handleLogin();  
    }
  }


  handleLogin = () => {
    
    this.setState({ progress: true });
    try {
      const { navigation, dispatch } = this.props;
      const { navigate } = this.props.navigation;

      var mobile_no = this.state.mobilePhoneCode+" "+this.state.mobilePhone;

      dispatch(userLogin(this.state.email_id, this.state.password))
      .then((response) => {
        console.log("dispatch response: ");
        console.log(response);
        if(response && typeof response !=="undefined" && response !==""){
          this.setState({ progress: false });
          
          Keychain.getGenericPassword()   // Retrieve the credentials from the keychain
          .then(async (credentials) => {

            var usernameArry = { is_authenticated: true };
            var passwordArry = { token: response.token, role: response.role, user_id: response.data[0].user_id, name: response.data[0].name };

            var username = JSON.stringify(usernameArry);
            var password = JSON.stringify(passwordArry);

            Keychain.resetGenericPassword();
            Keychain.setGenericPassword(username, password);

            Alert.alert(response.message);
            this.props.navigation.navigate('profile');

          }).catch((errorKeychain) => {

            console.log("errorKeychain: ");
            console.log(errorKeychain);

            //Alert.alert(errorKeychain.message);
            Alert.alert(response.message);

          });
        }else{
          this.setState({ progress: false });
          Alert.alert('something went wrong..!!');
        }
      })
      .catch((error) => {
        this.setState({ progress: false });
        console.log("dispatch error: ");
        console.log(error);
        Alert.alert(error.message);
      });
    }catch(errorCatch) {
      Alert.alert(errorCatch.message);
      this.setState({ progress: false });
    }
  }

  signup = () => {
    Actions.register()
  }

  render() {
    const {handleSubmit, loginUser} = this.props;

    return(
        <View style={{backgroundColor:'#FAFAFA', flex: 1,}}>

            <ImageBackground
                resizeMode={'stretch'} // or cover
                style={{flex: 1}} // must be passed from the parent, the number may vary depending upon your screen size
                source={images.ic_splash_2}
                >

                <Image  style={{width:175, height:73, marginTop: 65, alignSelf:'center'}}
                        source={images.ic_harjj_logo}/>

                <Text style={{marginTop:330, alignSelf:'center', fontFamily:'Rasa-Bold', color:'#CC1212', fontSize:24, fontWeight: 'bold',}}>Welcome to Harrj</Text>

            </ImageBackground>
    
        </View>
    )
  }
}

mapStateToProps = (state) => ({
    loginUser: state.authReducer.loginUser
})

mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Splash_2);