import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, Dimensions, Platform} from 'react-native';
import {connect} from 'react-redux';

import Routes from './components/Routes';

const {width} = Dimensions.get('window');

class Main extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isConnected: true,
      isOS: Platform.OS,
    };
  }

  render() {
    const {
      authData: {isLoggedIn},
    } = this.props;
    return (
      <View style={styles.container}>
        {(() => {
          if (this.state.isOS === 'ios') {
            return (
              <View
                style={{
                  width: '100%',
                  height: 40,
                  opacity: 0.5,
                  backgroundColor: '#FFFFFF',
                }}></View>
            );
          } else {
            return <StatusBar barStyle="dark-content" />;
          }
        })()}
        <Routes isLoggedIn={isLoggedIn} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineContainer: {
    backgroundColor: '#0086C3',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    bottom: 0,
  },
  offlineText: {color: '#fff'},
});

const mapStateToProps = state => ({
  authData: state.authReducer.authData,
});

export default connect(mapStateToProps, null)(Main);
