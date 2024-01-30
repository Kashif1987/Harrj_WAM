import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import images from '../assets/images/images';
import strings from '../translations/translateConstant';

class ChooseRole extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.OpenBidderLogin = this.OpenBidderLogin.bind(this);
    this.OpenAuctioneerLogin = this.OpenAuctioneerLogin.bind(this);
  }

  OpenBidderLogin = () => {
    this.props.navigation.navigate('sign_in');
  };

  OpenAuctioneerLogin = () => {
    this.props.navigation.navigate('auctioneer_sign_in');
  };

  render() {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'space-evenly',
            height: '100%',
            width: '60%',
          }}>
          {/* Harrj Logo  */}

          <View>
            <Image
              style={{
                width: 110,
                height: 50,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
              source={images.ic_harjj_logo}
            />
          </View>

          {/* Auctioneer Choice Button */}

          <View
            style={{
              height: '30%',
            }}>
            <TouchableOpacity
              style={RoleStyles.cardStyle}
              onPress={this.OpenAuctioneerLogin}>
              {/* Custom Auctioneer Card */}

              <View>
                <Image
                  style={{
                    height: '70%',
                    width: '70%',
                    alignSelf: 'center',
                    resizeMode: 'contain',
                    tintColor: '#2D2C71',
                    marginTop: '8%',
                  }}
                  source={images.auctioner}
                />

                <Text style={RoleStyles.textStyle}>{strings.Aucitoneer}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bidder Choice Button */}

          <View
            style={{
              height: '30%',
            }}>
            {/* Custom Bidder Card */}

            <TouchableOpacity
              style={RoleStyles.cardStyle}
              onPress={this.OpenBidderLogin}>
              <View>
                <Image
                  style={{
                    height: '70%',
                    width: '70%',
                    alignSelf: 'center',
                    resizeMode: 'contain',
                    tintColor: '#EF493E',
                    marginTop: '8%',
                  }}
                  source={images.bidder}
                />
                <Text style={RoleStyles.textStyle}>{strings.Bidder}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ChooseRole;

const RoleStyles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Rubik-Medium',
    fontSize: 18,
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: '5%',
  },
  cardStyle: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    height: '100%',
    marginHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
  },
});
