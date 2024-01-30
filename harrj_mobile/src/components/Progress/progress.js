import { Text, View, ActivityIndicator } from 'react-native';

import React, { Component } from 'react';
import strings from '../../translations/translateConstant';

export class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ width: '100%' }}>
        <Text
          style={{
            fontSize: 17,
            marginBottom: 10,
            marginTop: 10,
            padding: 10,
            color: '#2C2F6B',
          }}
        >
          {strings.loading}
        </Text>
        <ActivityIndicator color={'#E96C2B'} size={'large'} />
      </View>
    );
  }
}

export default Progress;
