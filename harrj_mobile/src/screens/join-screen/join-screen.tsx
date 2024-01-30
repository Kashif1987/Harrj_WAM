import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {TextInputRow} from '../../components/text-input-row';
import {Appbar} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import {BackHandler} from 'react-native';
import {Actions} from 'react-native-router-flux';
import images from '../../assets/images/images';
import strings from '../../translations/translateConstant';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  checkMultiple,
  openSettings,
  Permission,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import type {PermissionStatus} from 'react-native';

const DEFAULT_SESSION_NAMES = [
  'grand-canyon',
  'yosemite',
  'yellowstone',
  'disneyland',
  'golden-gate-bridge',
  'monument-valley',
  'death-valley',
  'brooklyn-bridge',
  'hoover-dam',
  'lake-tahoe',
];

type JoinScreenProps = {
  route: any;
  navigation: any;
};

// TODO: Enable photo library permission when sharing view is done.
const platformPermissions = {
  ios: [
    PERMISSIONS.IOS.CAMERA,
    PERMISSIONS.IOS.MICROPHONE,
    //PERMISSIONS.IOS.PHOTO_LIBRARY,
  ],
  android: [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    //PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  ],
};

export function JoinScreen({route, navigation}: JoinScreenProps) {
  function goBackFun() {
    navigation.goBack();
  }

  const [sessionName, setSessionName] = useState('a');
  const [sessionPassword, setSessionPassword] = useState('b');
  const [displayName, setDisplayName] = useState('c');
  const [sessionIdleTimeoutMins, setSessionIdleTimeoutMins] = useState('120');
  const [roleType, setRoleType] = useState('d');
  const [ProductId, setProductId] = useState('0');
  const [userId, setUserId] = useState('0');
  const [checkUser, setCheckUser] = useState('0');
  const [meeting_status, setMeetingStatus] = useState('0');
  const [progress, setProgress] = useState(true);

  const isJoin = route?.params?.isJoin;

  const getProductInfo = async () => {
    // setProgress(true);
    var user_zoom_session_obj = await EncryptedStorage.getItem(
      'user_zoom_session_obj',
    );
    var user_zoom_session_obj_temp = JSON.parse(user_zoom_session_obj);
    setProductId(user_zoom_session_obj_temp.zoom_product_id);

    const BASE_URL = 'https://harrj.app:3443/api/product/getinfo';
    // const BASE_URL = 'http://185.185.83.220:3021/api/product/getinfo';

    try {
      await Keychain.getGenericPassword().then(credentials => {
        const url = BASE_URL;

        console.log('getProductInfo url: ');
        console.log(url);
        console.log(user_zoom_session_obj_temp.zoom_product_id);

        const insertData = new FormData();

        insertData.append(
          'product_id',
          user_zoom_session_obj_temp.zoom_product_id,
        );

        return axios
          .post(url, insertData)
          .then(async response => {
            console.log(response.data.data);

            setCheckUser(response.data.data[0].add_by);
            setMeetingStatus(response.data.data[0].meeting_status);
            // console.log(meeting_status);

            setTimeout(() => {
              setProgress(false);
            }, 500);
          })
          .catch(error => {
            setTimeout(() => {
              // setProgress(false);
            }, 2000);
            console.log('getProductInfo error: ');
            console.log(error);
            // Alert.alert(JSON.stringify(error));
            //return error;
          });
      });
    } catch (e) {
      console.log('getProductInfo try catch error');
      console.log(e);
      setTimeout(() => {
        // setProgress(false);
      }, 2000);
      // Alert.alert(JSON.stringify(e));
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

    const permissions = platformPermissions[Platform.OS];
    let blockedAny = false;
    let notGranted: Permission[] = [];

    checkMultiple(permissions).then(
      (statuses: Record<Permission[number], PermissionStatus>) => {
        permissions.map((p: Permission) => {
          const status = statuses[p];
          if (status === RESULTS.BLOCKED) {
            blockedAny = true;
          } else if (status !== RESULTS.GRANTED) {
            notGranted.push(p);
          }
        });
        notGranted.length && requestMultiple(notGranted);
        blockedAny && openSettings();
      },
    );
  }, []);
  useEffect(async () => {
    navigation.setOptions({
      title: !isJoin ? 'Session' : 'Join a Session',
    });
    setProgress(true);
    getProductInfo();
    var user_zoom_session_obj = await EncryptedStorage.getItem(
      'user_zoom_session_obj',
    );
    var user_zoom_session_obj_temp = JSON.parse(user_zoom_session_obj);
    console.log('user_zoom_session_obj_temp');
    console.log(user_zoom_session_obj_temp);
    setDisplayName(user_zoom_session_obj_temp.zoom_mobile_no);
    setSessionName(user_zoom_session_obj_temp.zoom_meeting_id.toString());
    setSessionPassword(user_zoom_session_obj_temp.zoom_metteing_pass);
    setRoleType(user_zoom_session_obj_temp.zoom_user_role);
    setProductId(user_zoom_session_obj_temp.zoom_product_id);
    console.log(user_zoom_session_obj_temp.zoom_product_id);

    AsyncStorage.getItem('userId').then(value => {
      console.log(
        '**************************** join screen user id ****************************',
      );
      console.warn(value);
      setUserId(value);
    });
    // if (!isJoin) {
    //   const defaultSessionName =
    //     DEFAULT_SESSION_NAMES[
    //       Math.floor(Math.random() * DEFAULT_SESSION_NAMES.length)
    //     ] +
    //     '-' +
    //     Math.floor(Math.random() * 1000);
    //   setSessionName(defaultSessionName.trim());
    // }
  }, [navigation, isJoin]);

  return (
    <View style={styles.container}>
      {/* App Bar */}

      <Appbar
        style={{
          backgroundColor: 'white',
          elevation: 0,
        }}>
        <Appbar.BackAction
          onPress={() => {
            Actions.pop();
          }}
        />
        <View style={{flex: 1}}>
          <Image
            style={{resizeMode: 'contain', width: 75}}
            source={images.ic_harjj_logo}
          />
        </View>
      </Appbar>

      {/* <Appbar.Header
        style={{ backgroundColor: 'white', elevation: 0 }}
      >


        <View style={{ flex: 1 }}>
          <Image style={{ resizeMode: 'contain', width: 75, }}
            source={images.ic_harjj_logo} />
        </View>
      </Appbar.Header> */}

      {/* <TextInputRow
        label="Session Name"
        placeholder="Required"
        keyboardType="default"
        value={sessionName}
        onChangeText={setSessionName}
      />
      <TextInputRow
        label="Display Name"
        placeholder="Required"
        keyboardType="default"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInputRow
        label="Password"
        placeholder="Optional"
        keyboardType="default"
        value={sessionPassword}
        onChangeText={setSessionPassword}
        secureTextEntry
      />
      <TextInputRow
        label="SessionIdleTimeoutMins"
        placeholder="Optional"
        keyboardType="default"
        value={sessionIdleTimeoutMins}
        onChangeText={setSessionIdleTimeoutMins}
      />
      <TextInputRow
        label="Role Type"
        keyboardType="numeric"
        placeholder="Required (1 for Host, 0 for attendee)"
        value={roleType}
        onChangeText={setRoleType}
      />*/}
      <View style={{height: '90%', justifyContent: 'center'}}>
        {(() => {
          if (progress === true) {
            return (
              <>
                <ActivityIndicator color={'#E96C2B'} size={'large'} />
              </>
            );
          } else {
            return (
              <>
                {/* <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Call', {
                      sessionName,
                      displayName,
                      sessionPassword,
                      roleType,
                      sessionIdleTimeoutMins,
                    })
                  }
                  style={styles.button}>
                  <Text style={styles.buttonText}>
                    {!isJoin ? strings.GoLive : strings.GoLive}
                  </Text>
                </TouchableOpacity> */}
                {(() => {
                  if (userId == checkUser && meeting_status == '0') {
                    return (
                      <>
                        <Text
                          style={{
                            borderBottomColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            width: '100%',
                            textAlign: 'center',
                            alignSelf: 'center',
                            borderRadius: 10,
                            fontSize: 18,
                            fontFamily: 'Cairo-Bold',
                          }}>
                          {strings.joinClick}
                        </Text>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Call', {
                              sessionName,
                              displayName,
                              sessionPassword,
                              roleType,
                              sessionIdleTimeoutMins,
                            })
                          }
                          style={styles.button}>
                          <Text style={styles.buttonText}>
                            {!isJoin ? strings.GoLive : strings.GoLive}
                          </Text>
                        </TouchableOpacity>
                      </>
                    );
                  } else if (userId == checkUser && meeting_status != '1') {
                    return (
                      <>
                        <Text
                          style={{
                            borderBottomColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            width: '100%',
                            textAlign: 'center',
                            alignSelf: 'center',
                            borderRadius: 10,
                            fontSize: 20,
                            fontFamily: 'Cairo-Bold',
                          }}>
                          {/* {strings.joinClick} */}
                          {/* Meeting Ended! */}
                          {strings.MeetinghasEnded}
                        </Text>
                      </>
                    );
                  } else if (userId != checkUser && meeting_status == '1') {
                    return (
                      <>
                        <Text
                          style={{
                            borderBottomColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            width: '100%',
                            textAlign: 'center',
                            alignSelf: 'center',
                            borderRadius: 10,
                            fontSize: 18,
                            fontFamily: 'Cairo-Bold',
                          }}>
                          {strings.joinClick}
                        </Text>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Call', {
                              sessionName,
                              displayName,
                              sessionPassword,
                              roleType,
                              sessionIdleTimeoutMins,
                            })
                          }
                          style={styles.button}>
                          <Text style={styles.buttonText}>
                            {!isJoin ? strings.GoLive : strings.GoLive}
                          </Text>
                        </TouchableOpacity>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <Text
                          style={{
                            borderBottomColor: '#FFFFFF',
                            paddingHorizontal: 15,
                            width: '100%',
                            textAlign: 'center',
                            alignSelf: 'center',
                            borderRadius: 10,
                            fontSize: 20,
                            fontFamily: 'Cairo-Bold',
                          }}>
                          {/* {strings.joinClick} */}
                          {/* Meeting Started, Can't Join again! */}
                          {strings.MeetingStarted}
                        </Text>
                      </>
                    );
                  }
                })()}
              </>
            );
          }
        })()}
        {/* <Modal visible={false}>
          <ActivityIndicator
            color={'#E96C2B'}
            size={'large'}
            style={{ flex: 1 }}
          />
        </Modal> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#006bb3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    height: 55,
    width: 200,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Rubik-Bold',
    fontSize: 18,
  },
});
