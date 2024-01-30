import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {name as appName} from './app.json';
import Main from './src/Main';
import persist from './src/config/store';
import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import images from './src/assets/images/images';
import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistStore = persist();

const channelId = notifee.createChannel({
  id: 'default',
  name: 'Default Channel',
  badge: true,
  importance: AndroidImportance.HIGH,
  lights: true,
  vibration: true,
});

export default class App extends Component {
  async componentDidMount() {
    await notifee.requestPermission();
    await channelId;

    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    await AsyncStorage.setItem('firebase_token', token);
    console.log('FIREBASE TOKEN: ' + token);
  }
  render() {
    return (
      <Provider store={persistStore.store}>
        <PersistGate loading={null} persistor={persistStore.persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}

async function onMessageReceived(message) {
  var selectedLan = await AsyncStorage.getItem('UniversalAppLanguage');

  const lan = selectedLan === undefined ? 'ar' : selectedLan;

  console.log('Language received: ' + lan);
  const {title, body, product_name, title_arabic, body_arabic} = message.data;
  await notifee.displayNotification({
    title: lan === 'ar' ? title_arabic : title,
    body: lan === 'ar' ? body_arabic : body,
    subtitle: product_name,
    data: message.data,
    android: {
      lightUpScreen: true,
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
}

notifee.onForegroundEvent(async ({type, detail}) => {
  var item = detail.notification.data;

  if (type === 1) {
    setTimeout(() => {
      Actions.live_product_details({
        product_id: item.product_id,
        customer_id: item.add_by,
      });
    }, 1000);
  }
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  var item = detail.notification.data;
  if (type === 1) {
    setTimeout(() => {
      Actions.live_product_details({
        product_id: item.product_id,
        customer_id: item.add_by,
      });
    }, 3000);
  }
});

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

AppRegistry.registerComponent(appName, () => App);
