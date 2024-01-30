import React, {useEffect, useState, useRef} from 'react';
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Keyboard,
  Platform,
  ActionSheetIOS,
  useWindowDimensions,
  Image,
  BackHandler,
} from 'react-native';
import {VideoView} from '../../components/video-view';
import {Icon} from '../../components/icon';
import {useIsMounted} from '../../utils/hooks';
import generateJwt from '../../utils/jwt';
import LinearGradient from 'react-native-linear-gradient';
import {ActionSheet} from 'react-native-cross-actionsheet';
import EncryptedStorage from 'react-native-encrypted-storage';
import strings from '../../translations/translateConstant';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import {
  EventType,
  useZoom,
  ZoomVideoSdkUser,
  ZoomVideoSdkUserType,
  ZoomVideoSdkChatMessage,
  ZoomVideoSdkChatMessageType,
  ShareStatus,
  LiveStreamStatus,
  RecordingStatus,
  Errors,
} from '@zoom/react-native-videosdk';
import {
  KeyboardArea,
  RNKeyboard,
  SoftInputMode,
} from 'react-native-keyboard-area';
import images from '../../assets/images/images';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {Actions} from 'react-native-router-flux';
import {IconButton} from 'react-native-paper';

type CallScreenProps = {
  navigation: any;
  route: any;
};

export function CallScreen({navigation, route}: CallScreenProps) {
  const [isInSession, setIsInSession] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [switchCamera, setSwitchCamera] = useState('0');
  const [users, setUsersInSession] = useState<ZoomVideoSdkUser[]>([]);
  const [fullScreenUser, setFullScreenUser] = useState<ZoomVideoSdkUser>();
  const [sharingUser, setSharingUser] = useState<ZoomVideoSdkUser>();
  const [videoInfo, setVideoInfo] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ZoomVideoSdkChatMessage[]>(
    [],
  );
  const [contentHeight, setContentHeight] = useState<string | number>('100%');
  const [isSharing, setIsSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [isLongTouch, setIsLongTouch] = useState(false);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const isLongTouchRef = useRef(isLongTouch);
  const chatInputRef = useRef<TextInput>(null);
  const videoInfoTimer = useRef<number>(0);
  // react-native-reanimated issue: https://github.com/software-mansion/react-native-reanimated/issues/920
  // Not able to reuse animated style in multiple views.
  const uiOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const chatSendButtonScale = useSharedValue(0);
  const isMounted = useIsMounted();
  const zoom = useZoom();
  const windowHeight = useWindowDimensions().height;
  const [ProductId, setProductId] = useState('0');

  let touchTimer: number;
  isLongTouchRef.current = isLongTouch;

  const setMeetingStatusFun = async meeting_status => {
    var user_zoom_session_obj = await EncryptedStorage.getItem(
      'user_zoom_session_obj',
    );
    var user_zoom_session_obj_temp = JSON.parse(user_zoom_session_obj);
    setProductId(user_zoom_session_obj_temp.zoom_product_id);
    console.log(user_zoom_session_obj_temp.zoom_product_id);

    const BASE_URL = 'https://harrj.app:3443/api/product/update_meeting_status';
    // const BASE_URL =
    //   'http://185.185.83.220:3021/api/product/update_meeting_status';

    try {
      await Keychain.getGenericPassword().then(credentials => {
        const url = BASE_URL;

        // console.log('setMeetingStatusFun url: ');
        // console.log(url);
        // console.log(user_zoom_session_obj_temp.zoom_product_id);

        const insertData = new FormData();

        insertData.append(
          'product_id',
          user_zoom_session_obj_temp.zoom_product_id,
        );
        insertData.append('meeting_status', meeting_status);

        return axios
          .post(url, insertData)
          .then(async response => {
            console.log(
              '$$$$$$$$$$$$$$$$$$$---------setMeetingStatusFun response: ',
            );
            console.log(response.data);

            //return response.data;
          })
          .catch(error => {
            console.log('setMeetingStatusFun error: ');
            console.log(error);
            // Alert.alert(JSON.stringify(error));
            //return error;
          });
      });
    } catch (e) {
      console.log('encounterInfo try catch error');
      console.log(e);
      // Alert.alert(JSON.stringify(e));
    }
  };

  const exportChat = async () => {
    const url = 'https://harrj.app:3443/api/bidchat/add';
    // const url = 'http://185.185.83.220:3021/api/bidchat/add';

    try {
      // var meeting_id = 'meeting_id' + ' : ' + sessionName;
      // var zoomchat = chatMessages.concat(meeting_id);
      // console.log('Chats : ', zoomchat);
      var meeting_id = {meeting_id: sessionName};

      var tempArray = [];

      for (let index = 0; index < chatMessages.length; index++) {
        var userName = chatMessages[index].senderUser.userName;
        var temp1 = {
          content: chatMessages[index].content,
          senderUser: {userName: userName},
          timestamp: chatMessages[index].timestamp,
        };
        tempArray.push(temp1);
        console.log('chatMessages[index].senderUser.userName');
        console.log(chatMessages[index].senderUser.userName);
        console.log('userName+++++++');
        console.log(userName);
        console.log(typeof userName);
      }

      var chat = {data: tempArray, meeting_id: sessionName};

      // var zoomchat = chat.concat(meeting_id);
      console.log('Chats :++++++++');
      console.log(chat);
      console.log(JSON.stringify(chat));

      // const insertData = new FormData();

      // insertData.append('zoomchat', chat);

      var sendData = {zoomchat: chat};

      return axios
        .post(url, sendData)
        .then(async response => {
          console.log('Export Chat Response');
          console.log(response.data.message);
        })
        .catch(error => {
          console.log('Export Chat Error');
          console.log(error);
        });
    } catch (error) {
      console.log('Export Chat Catch Error');
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const {params} = route;
      const token = await generateJwt(params.sessionName, params.roleType);
      // console.log('Token ++++++++++++++++++++');
      // console.log(token);
      try {
        // console.log('params.sessionName');
        // console.log(params.sessionName);

        // console.log('params.sessionPassword');
        // console.log(params.sessionPassword);

        // console.log('params.displayName');
        // console.log(params.displayName);

        // console.log('params.sessionIdleTimeoutMins');
        // console.log(params.sessionIdleTimeoutMins);

        // console.log('params.roleType');
        // console.log(params.roleType);

        // console.log('1');

        var videoOptions_localVideoOn = true;
        var audioOptions_mute = true;

        if (params.roleType === 0) {
          videoOptions_localVideoOn = false;
          audioOptions_mute = true;
          zoom.videoHelper.stopVideo();
        }
        console.log('2');

        try {
          console.log('3');
          await zoom.joinSession({
            sessionName: params.sessionName,
            sessionPassword: params.sessionPassword,
            token: token,
            userName: params.displayName,
            audioOptions: {
              connect: audioOptions_mute,
              mute: true,
            },
            videoOptions: {
              localVideoOn: videoOptions_localVideoOn,
            },
            sessionIdleTimeoutMins: parseInt(params.sessionIdleTimeoutMins, 10),
          });
          // console.log('4');
        } catch (error) {
          // console.log('5');
          // console.log('error======================');
          console.log(error);
        }
        console.log('6');
        if (params.roleType === 1) {
          setMeetingStatusFun(1);
        }
      } catch (e) {
        // console.log('Eeeeeeeeeeeee================');
        console.log(e);
        Alert.alert('Failed to join the session');
        setTimeout(() => navigation.goBack(), 1000);
      }
    })();

    if (Platform.OS === 'android') {
      RNKeyboard.setWindowSoftInputMode(
        SoftInputMode.SOFT_INPUT_STATE_ALWAYS_HIDDEN,
      );
    }

    return () => {
      if (Platform.OS === 'android') {
        RNKeyboard.setWindowSoftInputMode(SoftInputMode.SOFT_INPUT_ADJUST_PAN);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const setHostFullscreen = async () => {
      const host = await zoom.session.getSessionHost();
      setFullScreenUser(host);
    };
    setHostFullscreen();
    const updateVideoInfo = () => {
      videoInfoTimer.current = setTimeout(async () => {
        if (!isMounted()) return;

        const videoOn = await fullScreenUser?.videoStatus.isOn();

        // Video statistic info doesn't update when there's no remote users
        if (!fullScreenUser || !videoOn || users.length < 2) {
          clearTimeout(videoInfoTimer.current);
          setVideoInfo('');
          return;
        }

        const fps = isSharing
          ? await fullScreenUser.shareStatisticInfo.getFps()
          : await fullScreenUser.videoStatisticInfo.getFps();

        const height = isSharing
          ? await fullScreenUser.shareStatisticInfo.getHeight()
          : await fullScreenUser.videoStatisticInfo.getHeight();

        const width = isSharing
          ? await fullScreenUser.shareStatisticInfo.getWidth()
          : await fullScreenUser.videoStatisticInfo.getWidth();

        setVideoInfo(`${width}x${height} ${fps}FPS`);
        updateVideoInfo();
      }, 1000);
    };

    updateVideoInfo();

    return () => clearTimeout(videoInfoTimer.current);
  }, [fullScreenUser, users, isMounted, isSharing]);

  useEffect(() => {
    const sessionJoinListener = zoom.addListener(
      EventType.onSessionJoin,
      async (session: any) => {
        setIsInSession(true);
        toggleUI();
        zoom.session.getSessionName().then(setSessionName);
        const mySelf: ZoomVideoSdkUser = new ZoomVideoSdkUser(session.mySelf);
        const host = await zoom.session.getSessionHost();
        const remoteUsers: ZoomVideoSdkUser[] =
          await zoom.session.getRemoteUsers();
        const muted = await mySelf.audioStatus.isMuted();
        const videoOn = await mySelf.videoStatus.isOn();
        const speakerOn = await zoom.audioHelper.getSpeakerStatus();
        setUsersInSession([mySelf, ...remoteUsers]);
        setIsMuted(muted);
        setIsVideoOn(videoOn);
        setIsSpeakerOn(speakerOn);
        setFullScreenUser(host);
      },
    );

    const sessionLeaveListener = zoom.addListener(
      EventType.onSessionLeave,
      () => {
        console.log('LEAVE ************************************************');
        setIsInSession(false);
        setUsersInSession([]);
        // navigation.navigate('home');
        Actions.replace('home');
      },
    );

    const sessionNeedPasswordListener = zoom.addListener(
      EventType.onSessionNeedPassword,
      () => {
        Alert.alert('SessionNeedPassword');
      },
    );

    const sessionPasswordWrongListener = zoom.addListener(
      EventType.onSessionPasswordWrong,
      () => {
        Alert.alert('SessionPasswordWrong');
      },
    );

    const userVideoStatusChangedListener = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      async ({changedUsers}: {changedUsers: ZoomVideoSdkUserType[]}) => {
        const mySelf: ZoomVideoSdkUser = new ZoomVideoSdkUser(
          await zoom.session.getMySelf(),
        );
        changedUsers.map((u: ZoomVideoSdkUserType) => {
          if (mySelf.userId === u.userId) {
            mySelf.videoStatus.isOn().then(on => setIsVideoOn(on));
          }
        });
      },
    );

    const userAudioStatusChangedListener = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async ({changedUsers}: {changedUsers: ZoomVideoSdkUserType[]}) => {
        const mySelf: ZoomVideoSdkUser = new ZoomVideoSdkUser(
          await zoom.session.getMySelf(),
        );
        changedUsers.map((u: ZoomVideoSdkUserType) => {
          if (mySelf.userId === u.userId) {
            mySelf.audioStatus.isMuted().then(muted => setIsMuted(muted));
          }
        });
      },
    );

    const userJoinListener = zoom.addListener(
      EventType.onUserJoin,
      async ({remoteUsers}: {remoteUsers: ZoomVideoSdkUserType[]}) => {
        if (!isMounted()) return;
        const mySelf: ZoomVideoSdkUser = await zoom.session.getMySelf();
        const remote: ZoomVideoSdkUser[] = remoteUsers.map(
          (user: ZoomVideoSdkUserType) => new ZoomVideoSdkUser(user),
        );
        setUsersInSession([mySelf, ...remote]);
      },
    );

    const userLeaveListener = zoom.addListener(
      EventType.onUserLeave,
      async ({
        remoteUsers,
        leftUsers,
      }: {
        remoteUsers: ZoomVideoSdkUserType[];
        leftUsers: ZoomVideoSdkUserType[];
      }) => {
        if (!isMounted()) return;
        const mySelf: ZoomVideoSdkUser = await zoom.session.getMySelf();
        const remote: ZoomVideoSdkUser[] = remoteUsers.map(
          (user: ZoomVideoSdkUserType) => new ZoomVideoSdkUser(user),
        );
        if (fullScreenUser) {
          leftUsers.map((user: ZoomVideoSdkUserType) => {
            if (fullScreenUser.userId === user.userId) {
              setFullScreenUser(mySelf);
              return;
            }
          });
        } else {
          setFullScreenUser(mySelf);
        }
        setUsersInSession([mySelf, ...remote]);
      },
    );

    const userNameChangedListener = zoom.addListener(
      EventType.onUserNameChanged,
      async ({changedUser}) => {
        setUsersInSession(
          users.map((u: ZoomVideoSdkUser) => {
            if (u && u.userId === changedUser.userId) {
              return new ZoomVideoSdkUser(changedUser);
            }
            return u;
          }),
        );
      },
    );

    const userShareStatusChangeListener = zoom.addListener(
      EventType.onUserShareStatusChanged,
      async ({user, status}: {user: ZoomVideoSdkUser; status: ShareStatus}) => {
        const shareUser: ZoomVideoSdkUser = new ZoomVideoSdkUser(user);
        const mySelf: ZoomVideoSdkUserType = await zoom.session.getMySelf();

        if (user.userId && status === ShareStatus.Start) {
          setSharingUser(shareUser);
          setFullScreenUser(shareUser);
          setIsSharing(shareUser.userId === mySelf.userId);
        } else {
          setSharingUser(undefined);
          setIsSharing(false);
        }
      },
    );

    const commandReceived = zoom.addListener(
      EventType.onCommandReceived,
      (params: {sender: string; command: string}) => {
        console.log(
          'sender: ' + params.sender + ', command: ' + params.command,
        );
      },
    );

    const chatNewMessageNotify = zoom.addListener(
      EventType.onChatNewMessageNotify,
      (newMessage: ZoomVideoSdkChatMessageType) => {
        if (!isMounted()) return;
        setChatMessages([
          new ZoomVideoSdkChatMessage(newMessage),
          ...chatMessages,
        ]);
      },
    );

    const liveStreamStatusChangeListener = zoom.addListener(
      EventType.onLiveStreamStatusChanged,
      ({status}: {status: LiveStreamStatus}) => {
        console.log(`onLiveStreamStatusChanged: ${status}`);
      },
    );

    const cloudRecordingStatusListener = zoom.addListener(
      EventType.onCloudRecordingStatus,
      ({status}: {status: RecordingStatus}) => {
        console.log(`cloudRecordingStatusListener: ${status}`);
        if (status === RecordingStatus.Start) {
          setIsRecordingStarted(true);
        } else {
          setIsRecordingStarted(false);
        }
      },
    );

    const eventErrorListener = zoom.addListener(
      EventType.onError,
      async (error: any) => {
        console.log('Error: ' + JSON.stringify(error));
        switch (error.errorType) {
          case Errors.SessionJoinFailed:
            Alert.alert('Failed to join the session');
            setTimeout(() => navigation.goBack(), 1000);
            break;
          case Errors.SessionNotStarted:
            Alert.alert('Session not started');
            setTimeout(() => navigation.goBack(), 1000);
            break;
          default:
        }
      },
    );

    return () => {
      sessionJoinListener.remove();
      sessionLeaveListener.remove();
      sessionPasswordWrongListener.remove();
      sessionNeedPasswordListener.remove();
      userVideoStatusChangedListener.remove();
      userAudioStatusChangedListener.remove();
      userJoinListener.remove();
      userLeaveListener.remove();
      userNameChangedListener.remove();
      userShareStatusChangeListener.remove();
      chatNewMessageNotify.remove();
      liveStreamStatusChangeListener.remove();
      cloudRecordingStatusListener.remove();
      eventErrorListener.remove();
      commandReceived.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, route, users, chatMessages, isMounted]);

  const keyboardHeightChange = (isOpen: boolean, height: number) => {
    if (!isOpen) {
      scaleChatSend(false);
      chatInputRef.current?.clear();
    }
    setIsKeyboardOpen(!isOpen);
    setContentHeight(windowHeight - height);
  };

  // onPress event for FlatList since RN doesn't provide container-on-press event
  const onListTouchStart = () => {
    touchTimer = setTimeout(() => {
      setIsLongTouch(true);
    }, 200);
  };

  // onPress event for FlatList since RN doesn't provide container-on-press event
  const onListTouchEnd = (event: any) => {
    // Toggle UI behavior
    // - Toggle only when user list or chat list is tapped
    // - Block toggling when tapping on a list item
    // - Block toggling when keyboard is shown
    if (event._targetInst.elementType.includes('Scroll') && isKeyboardOpen) {
      !isLongTouchRef.current && toggleUI();
    }
    clearTimeout(touchTimer);
    setIsLongTouch(false);
  };

  const uiOpacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: uiOpacity.value,
  }));

  const inputOpacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
  }));

  const chatSendButtonScaleAnimatedStyle = useAnimatedStyle(() => ({
    width: 38 * chatSendButtonScale.value,
    marginLeft: 8 * chatSendButtonScale.value,
    transform: [{scale: chatSendButtonScale.value}],
  }));

  const toggleUI = () => {
    const easeIn = Easing.in(Easing.exp);
    const easeOut = Easing.out(Easing.exp);
    uiOpacity.value = withTiming(uiOpacity.value === 0 ? 100 : 0, {
      duration: 300,
      easing: uiOpacity.value === 0 ? easeIn : easeOut,
    });
    inputOpacity.value = withTiming(inputOpacity.value === 0 ? 100 : 0, {
      duration: 300,
      easing: inputOpacity.value === 0 ? easeIn : easeOut,
    });
  };

  const sendChatMessage = () => {
    chatInputRef.current?.clear();
    zoom.chatHelper.sendChatToAll(chatMessage);
    setChatMessage('');
    // send the chat as a command
    zoom.cmdChannel.sendCommand(null, chatMessage);
  };

  const scaleChatSend = (show: boolean) => {
    const easeIn = Easing.in(Easing.exp);
    const easeOut = Easing.out(Easing.exp);
    chatSendButtonScale.value = withTiming(show ? 1 : 0, {
      duration: 500,
      easing: show ? easeIn : easeOut,
    });
  };

  useEffect(() => {
    const backAction = () => {
      onPressLeave();

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const leaveSession = (endSession: boolean) => {
    const {params} = route;
    zoom.leaveSession(endSession);
    console.log('endSession ************************************************');
    // navigation.navigate('home');
    // Actions.home();
    Actions.replace('home');
    if (params.roleType === 1) {
      setMeetingStatusFun(2);
    }
    exportChat();

    // var meeting_id = 'meeting_id' + ' : ' + sessionName;
    // console.log('Chats : ');
    // console.log(chatMessages.concat(meeting_id));
  };

  const onPressAudio = async () => {
    const mySelf = await zoom.session.getMySelf();
    const muted = await mySelf.audioStatus.isMuted();
    setIsMuted(muted);
    muted
      ? zoom.audioHelper.unmuteAudio(mySelf.userId)
      : zoom.audioHelper.muteAudio(mySelf.userId);
  };

  const onPressVideo = async () => {
    const mySelf = await zoom.session.getMySelf();
    const videoOn = await mySelf.videoStatus.isOn();
    setIsVideoOn(videoOn);
    videoOn ? zoom.videoHelper.stopVideo() : zoom.videoHelper.startVideo();
  };

  const onPressShare = async () => {
    const isOtherSharing = await zoom.shareHelper.isOtherSharing();
    const isShareLocked = await zoom.shareHelper.isShareLocked();

    if (isOtherSharing) {
      Alert.alert('Other is sharing');
    } else if (isShareLocked) {
      Alert.alert('Share is locked by host');
    } else if (isSharing) {
      zoom.shareHelper.stopShare();
    } else {
      zoom.shareHelper.shareScreen();
    }
  };

  const switchCameraFun = async () => {
    if (switchCamera === '0') {
      return zoom.videoHelper.switchCamera('1').then(res => {
        setSwitchCamera('1');
      });
    }
    return zoom.videoHelper.switchCamera('0').then(res => {
      setSwitchCamera('0');
    });
  };

  const onPressMore = async () => {
    const mySelf = await zoom.session.getMySelf();
    const isShareLocked = await zoom.shareHelper.isShareLocked();
    const isFullScreenUserManager = await fullScreenUser?.getIsManager();
    const canSwitchSpeaker = await zoom.audioHelper.canSwitchSpeaker();
    const canStartRecording = await zoom.recordingHelper.canStartRecording();
    let options = [
      {text: 'Switch Camera', onPress: () => zoom.videoHelper.switchCamera()},
    ];

    if (canSwitchSpeaker) {
      options = [
        ...options,
        {
          text: `Turn ${isSpeakerOn ? 'off' : 'on'} Speaker`,
          onPress: async () => {
            zoom.audioHelper.setSpeaker(!isSpeakerOn);
            setIsSpeakerOn(!isSpeakerOn);
          },
        },
      ];
    }

    if (mySelf.isHost) {
      options = [
        ...options,
        {
          text: `${isShareLocked ? 'Unlock' : 'Lock'} Share`,
          onPress: () => zoom.shareHelper.lockShare(!isShareLocked),
        },
        {
          text: `${isFullScreenUserManager ? 'Revoke' : 'Make'} Manager`,
          onPress: () => {
            fullScreenUser &&
              (isFullScreenUserManager
                ? zoom.userHelper.revokeManager(fullScreenUser.userId)
                : zoom.userHelper.makeManager(fullScreenUser.userId));
          },
        },
        {
          text: 'Change Name',
          onPress: () => setIsRenameModalVisible(true),
        },
      ];

      if (canStartRecording) {
        options = [
          ...options,
          {
            text: `${isRecordingStarted ? 'Start' : 'Stop'} Recording`,
            onPress: async () => {
              if (!isRecordingStarted) {
                zoom.recordingHelper.startCloudRecording();
              } else {
                zoom.recordingHelper.stopCloudRecording();
              }
            },
          },
        ];
      }
    }

    ActionSheet.options({
      options: options,
      cancel: {text: 'Cancel', onPress: () => {}},
    });
  };

  const onPressLeave = async () => {
    const mySelf = await zoom.session.getMySelf();
    const options = [
      {
        // text: 'Leave Session',
        // onPress: () => leaveSession(false),
        text: strings.leaveSession,
        onPress: () => {
          mySelf.isHost ? leaveSession(true) : leaveSession(false);
        },
      },
    ];

    if (mySelf.isHost) {
      options.unshift({
        // text: 'End Session',
        text: strings.endSession,
        onPress: () => leaveSession(true),
      });
      // exportChat();
      // var meeting_id = 'meeting_id' + ' : ' + sessionName;
      // var chat = ['data' + ':' + chatMessages];

      // var zoomchat = chat.concat(meeting_id);
      // console.log('Chats : ', zoomchat);
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          // options: ['Cancel', ...options.map((option) => option.text)],
          options: [strings.Cancel, ...options.map(option => option.text)],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex !== 0) {
            options[buttonIndex - 1].onPress();
          }
        },
      );
    } else {
      Alert.alert(strings.leaveThisSession, '', options, {
        cancelable: true,
      });
    }
  };

  const contentStyles = {
    ...styles.container,
    height: contentHeight,
  };

  return (
    <View style={contentStyles}>
      <StatusBar hidden />
      <View style={styles.fullScreenVideo}>
        <VideoView
          user={fullScreenUser}
          sharing={fullScreenUser?.userId === sharingUser?.userId}
          onPress={() => {
            isKeyboardOpen ? toggleUI() : Keyboard.dismiss();
          }}
          fullScreen
        />
      </View>

      <LinearGradient
        style={styles.fullScreenVideo}
        colors={[
          'rgba(0,0,0,0.6)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.6)',
        ]}
        locations={[0, 0.12, 0.88, 1]}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <Animated.View
          style={[styles.contents, uiOpacityAnimatedStyle]}
          pointerEvents="box-none">
          <View style={styles.topWrapper} pointerEvents="box-none">
            <View style={styles.sessionInfo}>
              {/* <View style={styles.sessionInfoHeader}>
                <Text style={styles.sessionName}>{sessionName}</Text>
                <Icon
                  name={route.params.sessionPassword ? 'locked' : 'unlocked'}
                />
              </View> */}
              <Text style={styles.numberOfUsers}>
                {`${strings.participants}: ${users.length}`}
              </Text>
            </View>

            <View style={{flex: 1, alignItems: 'center'}}>
              <Image
                style={{resizeMode: 'contain', width: 75, height: 50}}
                source={images.ic_harjj_logo}
              />
            </View>

            <View style={styles.topRightWrapper}>
              <TouchableOpacity
                style={styles.leaveButton}
                onPress={onPressLeave}>
                <Text style={styles.leaveText}>{strings.leave}</Text>
              </TouchableOpacity>
              {fullScreenUser && videoInfo.length !== 0 && (
                <View style={styles.videoInfo}>
                  <Text style={styles.videoInfoText}>{videoInfo}</Text>
                </View>
              )}
            </View>
          </View>

          {/* <View style={{  }}> */}
          <View style={styles.middleWrapper} pointerEvents="box-none">
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                marginTop: '50%',
                marginBottom: '25%',
              }}>
              <FlatList
                contentContainerStyle={[styles.chatList, {}]}
                onTouchStart={onListTouchStart}
                onTouchEnd={onListTouchEnd}
                data={chatMessages}
                renderItem={({item}) => (
                  <View style={styles.chatMessage}>
                    <Text style={styles.chatUser}>
                      {item.senderUser.userName}:
                    </Text>
                    <Text style={styles.chatContent}> {item.content}</Text>
                  </View>
                )}
                keyExtractor={(item, index) =>
                  `${String(item.timestamp)}${index}`
                }
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                inverted
              />
              <View style={styles.controls}>
                {(() => {
                  const {params} = route;

                  if (params.roleType === 1) {
                    return (
                      <Icon
                        containerStyle={styles.controlButton}
                        name={isMuted ? 'unmute' : 'mute'}
                        onPress={onPressAudio}
                      />
                    );
                  } else {
                    return <View />;
                  }
                })()}

                {/* <Icon
                containerStyle={styles.controlButton}
                name={isSharing ? 'shareOff' : 'shareOn'}
                onPress={onPressShare}
              /> */}

                {(() => {
                  const {params} = route;

                  if (params.roleType === 1) {
                    return (
                      <>
                        <Icon
                          containerStyle={styles.controlButton}
                          name={isVideoOn ? 'videoOff' : 'videoOn'}
                          onPress={onPressVideo}
                        />

                        <Icon
                          // containerStyle={{marginLeft:5}}
                          name={
                            switchCamera === '1' ? 'backCamera' : 'frontCamera'
                          }
                          onPress={switchCameraFun}
                        />
                      </>
                    );
                  } else {
                    return <View />;
                  }
                })()}

                {/* <Icon
                  containerStyle={styles.controlButton}
                  name="more"
                  onPress={onPressMore}
                /> */}
                {/* <Icon
                  containerStyle={{width: 50, height: 50, marginBottom: 12, }}
                  name="switchCamera"
                  onPress={switchCameraFun}
                /> */}
              </View>
            </View>
            {/* </View> */}
          </View>
        </Animated.View>

        <View style={styles.bottomWrapper} pointerEvents="box-none">
          {isInSession && isKeyboardOpen && (
            <FlatList
              style={styles.userList}
              contentContainerStyle={styles.userListContentContainer}
              onTouchStart={onListTouchStart}
              onTouchEnd={onListTouchEnd}
              data={users}
              extraData={users}
              renderItem={({item}) => (
                <VideoView
                  user={item}
                  // focused={false}
                  onPress={() => {}}
                  focused={item.userId === fullScreenUser?.userId}
                  // onPress={selectedUser => setFullScreenUser(selectedUser)}
                  key={item.userId}
                />
              )}
              keyExtractor={item => item.userId}
              fadingEdgeLength={50}
              decelerationRate={0}
              snapToAlignment="center"
              snapToInterval={100}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          )}
          <Animated.View style={inputOpacityAnimatedStyle}>
            <View style={styles.chatInputWrapper}>
              <TextInput
                style={styles.chatInput}
                ref={chatInputRef}
                placeholder={strings.typeComment}
                placeholderTextColor="#AAA"
                onChangeText={text => {
                  scaleChatSend(text.length !== 0);
                  setChatMessage(text);
                }}
                onSubmitEditing={sendChatMessage}
              />
              <Animated.View
                style={[
                  chatSendButtonScaleAnimatedStyle,
                  styles.chatSendButton,
                ]}>
                <Icon name="chatSend" onPress={sendChatMessage} />
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isRenameModalVisible}
          statusBarTranslucent>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
            <View style={styles.modal}>
              <Text style={styles.modalTitleText}>Change Name</Text>
              <TextInput
                style={styles.renameInput}
                placeholder="New name"
                placeholderTextColor="#AAA"
                onChangeText={text => setNewName(text)}
              />
              <View style={styles.modalActionContainer}>
                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => {
                    if (fullScreenUser) {
                      zoom.userHelper.changeName(
                        newName,
                        fullScreenUser.userId,
                      );
                      setNewName('');
                      setIsRenameModalVisible(false);
                    }
                  }}>
                  <Text style={styles.modalActionText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalAction}
                  onPress={() => {
                    setNewName('');
                    setIsRenameModalVisible(false);
                  }}>
                  <Text style={styles.modalActionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* @ts-ignore: only calculates the keyboard height */}
        {/* <KeyboardArea
          style={styles.keyboardArea}
          isOpen={false}
          onChange={keyboardHeightChange}
        /> */}

        {!isInSession && (
          <View style={styles.connectingWrapper}>
            <Text style={styles.connectingText}>Connecting...</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#232323',
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  connectingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  safeArea: {
    flex: 1,
  },
  contents: {
    flex: 1,
    alignItems: 'stretch',
  },
  sessionInfo: {
    // width: 200,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sessionInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  numberOfUsers: {
    fontSize: 13,
    color: '#FFF',
  },
  topWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 8,
    paddingTop: 16,
  },
  topRightWrapper: {
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  middleWrapper: {
    // flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  bottomWrapper: {
    paddingHorizontal: 8,
  },
  leaveButton: {
    paddingVertical: 4,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  leaveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E02828',
  },
  videoInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  videoInfoText: {
    fontSize: 12,
    color: '#FFF',
  },
  chatList: {
    paddingRight: 16,
  },
  chatMessage: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  chatUser: {
    fontSize: 14,
    color: '#CCC',
  },
  chatContent: {
    fontSize: 14,
    color: '#FFF',
    maxWidth: '70%',
  },
  controls: {
    alignSelf: 'center',
    paddingTop: 24,
    alignItems: 'center',
  },
  controlButton: {
    marginBottom: 12,
  },
  userList: {
    width: '100%',
  },
  userListContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  chatInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 40,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#666',
    color: '#AAA',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  chatSendButton: {
    height: 36,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  modalTitleText: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalAction: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  moreItem: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreItemText: {
    fontSize: 16,
  },
  moreItemIcon: {
    width: 36,
    height: 36,
    marginLeft: 48,
  },
  moreModalTitle: {
    fontSize: 24,
  },
  renameInput: {
    width: 200,
    marginTop: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#AAA',
    color: '#000',
  },
  keyboardArea: {
    height: 0,
    width: 0,
    zIndex: -100,
  },
});
