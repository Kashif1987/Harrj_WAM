import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class forgotPassword {
  forgotPasswordService(user_id) {
    try {
      const url = BASE_URL + '/login/forgotpassword';
      const insertData = new FormData();

      insertData.append('user_id', user_id);

      console.log(' forgotPassword insertData ');
      console.log(insertData);

      console.log(' forgotPassword url ');
      console.log(url);

      return axios.post(url, insertData).then(response => {
        console.log('forgotPassword service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('forgotPassword service error:');
      console.log(error);

      return error;
    }
  }

  // Check OTP

  checkOTPService(email_id, otp) {
    try {
      const url = BASE_URL + '/login/check_otp';
      const insertData = new FormData();

      insertData.append('email_id', email_id);
      insertData.append('otp', otp);

      console.log(' checkOTP insertData ');
      console.log(insertData);

      console.log(' checkOTP url ');
      console.log(url);

      return axios.post(url, insertData).then(response => {
        console.log('checkOTP service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('checkOTP service error:');
      console.log(error);

      return error;
    }
  }

  // update password

  updatePasswordService(email_id, password) {
    try {
      const url = BASE_URL + '/login/updatepassword';
      const insertData = new FormData();

      insertData.append('email_id', email_id);
      insertData.append('password', password);

      console.log(' updatePassword insertData ');
      console.log(insertData);

      console.log(' updatePassword url ');
      console.log(url);

      return axios.post(url, insertData).then(response => {
        console.log('updatePassword service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('updatePassword service error:');
      console.log(error);

      return error;
    }
  }
}

export default new forgotPassword();
