import axios from 'axios';
import { Platform } from 'react-native';
import ReactNativeVersionInfo from 'react-native-version-info';
import { SLACK_API_URL } from '../../../config';

export const slackServiceFun = {
  slackErrorFun: function (
    statusType,
    errorLogData,
    screenName,
    methodFunName,
    noteDesc,
    callingServer,
    apiUrl,
    apiMethod,
    apiRequestData,
    apiResponseData
  ) {
    var finalObj = {
      Platform: Platform.OS,
      GV: Platform.constants['Release'],
      AppVersion: ReactNativeVersionInfo.appVersion,
      errorData: '' + errorLogData + '',
      screenName: '' + screenName + '',
      functionName: '' + methodFunName + '',
        api: {
          apiUrl: '' + apiUrl + '',
          apiMethod: '' + apiMethod + '',
          apiRequestData: apiRequestData,
          apiResponseData: apiResponseData,
        },
    };

    var dateCurrent = new Date();
    var formatDate = dateCurrent.toLocaleString();

    let insertData = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Something Went Wrong@' + formatDate,
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: JSON.stringify(finalObj),
          },
        ],
      },
      {
        type: 'divider',
      },
    ];

    var insertNewData = {};
    insertNewData['blocks'] = insertData;

    return axios
      .post(SLACK_API_URL, insertNewData)
      .then((response) => {
        return true;
      })
      .catch((error) => {
        return false;
      });
  },
};
