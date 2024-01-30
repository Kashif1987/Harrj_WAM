import React from 'react';
import * as Keychain from 'react-native-keychain';
import {Router, Scene} from 'react-native-router-flux';
import AboutHarrj from '../screens/About_Harrj';
import CreateAd from '../screens/Bidder/CreateAd/CreateAd';
import LiveNow from '../screens/Bidder/CreateAd/LiveNow';
import Live_Auction from '../screens/Bidder/CreateAd/Live_Auction';
import ScheduleLiveAuction from '../screens/Bidder/CreateAd/ScheduleLiveAuction';
import ForgotPassword from '../screens/Bidder/ForgotPassword';
import Home from '../screens/Bidder/Home';
import LiveBid from '../screens/Bidder/Live_Bid';
import Live_Product_Details from '../screens/Bidder/Live_Product_Details';
import MainHome from '../screens/Bidder/MainHome';
import MyOrders from '../screens/Bidder/My_Orders';
import My_Products from '../screens/Bidder/My_Products';
import MyReport from '../screens/Bidder/My_Report';
import Normal_bid from '../screens/Bidder/Normal_bid';
import ProductDetails from '../screens/Bidder/ProductDetails';
import Products from '../screens/Bidder/Products';
import Search from '../screens/Bidder/Search';
import SignIn from '../screens/Bidder/SignIn';
import SignUp from '../screens/Bidder/SignUp';
import updateAd from '../screens/Bidder/updateAd';
import ChooseRole from '../screens/Choose_Role';
import ContactUs from '../screens/ContactUs';
import Privacy_Policy from '../screens/Privacy_Policy';
import Profile from '../screens/Profile';
import Splash_1 from '../screens/Splash_1';
import ZoomExampleConfirm from '../screens/ZoomExampleConfirm';
import ProfileUpdate from '../screens/ProfileUpdate';

export default class Routes extends React.Component {
  constructor() {
    super();

    this.state = {
      progress: true,
      is_authenticated: false,
    };

    this.retrieveUserSession = this.retrieveUserSession.bind(this);
  }

  async componentDidMount() {
    this.retrieveUserSession();
  }

  retrieveUserSession = async () => {
    try {
      Keychain.getGenericPassword() // Retrieve the credentials from the keychain
        .then(credentials => {
          let sessionData = JSON.parse(credentials.username);
          console.log('sessionData: ');
          console.log(sessionData);
          if (
            sessionData.is_authenticated &&
            typeof sessionData.is_authenticated !== 'undefined' &&
            sessionData.is_authenticated !== ''
          ) {
            this.setState({is_authenticated: sessionData.is_authenticated});
          }
        })
        .catch(() => {
          Keychain.resetGenericPassword();
        });
    } catch (errorRetrieveUserSession) {}
  };

  render() {
    return (
      <Router>
        <Scene>
          <Scene
            key="root"
            hideNavBar={true}
            initial={!this.state.is_authenticated}>
            <Scene
              key="splash_screen"
              name="splash_screen"
              component={Splash_1}
              title="Splash Screen"
              initial={true}
            />

            <Scene
              key="sign_up"
              name="sign_up"
              component={SignUp}
              title="Sign Up"
            />
            <Scene
              key="forgot_password"
              name="forgot_password"
              component={ForgotPassword}
              title="Forgot Password"
            />
            <Scene
              key="main_home"
              name="main_home"
              component={MainHome}
              title="Main Home"
            />
            <Scene
              key="sign_in"
              name="sign_in"
              component={SignIn}
              title="Sign In"
            />
            <Scene key="home" name="home" component={Home} title="Home" />

            <Scene
              key="profile"
              name="profile"
              component={Profile}
              title="Profile"
            />
            <Scene
              key="profileUpdate"
              name="profileUpdate"
              component={ProfileUpdate}
              title="ProfileUpdate"
            />
            <Scene
              key="products"
              name="products"
              component={Products}
              title="Products"
            />
            <Scene
              key="product_details"
              name="product_details"
              component={ProductDetails}
              title="Product Details"
            />
            <Scene
              key="live_product_details"
              name="live_product_details"
              component={Live_Product_Details}
              title="Live Product Details"
            />
            <Scene
              key="my_order"
              name="my_order"
              component={MyOrders}
              title="My Orders"
            />
            <Scene
              key="contact_us"
              name="contact_us"
              component={ContactUs}
              title="Contact Us"
            />
            <Scene
              key="about_harrj"
              name="about_harrj"
              component={AboutHarrj}
              title="About Harrj"
            />
            <Scene
              key="normal_bid"
              name="normal_bid"
              component={Normal_bid}
              title="Normal Bid"
            />
            <Scene
              key="live_bid"
              name="live_bid"
              component={LiveBid}
              title="Live Bid"
            />
            <Scene
              key="search"
              name="search"
              component={Search}
              title="Search"
            />
            <Scene
              key="privacy_policy"
              name="privacy_policy"
              component={Privacy_Policy}
              title="Privacy Policy"
            />
            <Scene
              key="my_report"
              name="my_report"
              component={MyReport}
              title="My Report"
            />
            <Scene
              key="choose_role"
              name="choose_role"
              component={ChooseRole}
              title="Choose Role"
            />
            <Scene
              key="create_ad"
              name="create_ad"
              component={CreateAd}
              title="Create Ad"
            />
            <Scene
              key="live_auction"
              name="live_auction"
              component={Live_Auction}
              title="Live Auction"
            />
            <Scene
              key="live_now"
              name="live_now"
              component={LiveNow}
              title="Live Now"
            />
            <Scene
              key="schedule_live"
              name="schedule_live"
              component={ScheduleLiveAuction}
              title="Schedule Live"
            />
            <Scene
              key="zoom_example_confirm"
              name="zoom_example_confirm"
              component={ZoomExampleConfirm}
              title="Zoom Example Confirm"
            />

            <Scene
              key="my_products"
              name="my_products"
              component={My_Products}
              title="My Products"
            />
          </Scene>

          <Scene
            key="update_ad"
            name="update_ad"
            component={updateAd}
            title="Update Ad"
            hideNavBar
          />
        </Scene>
      </Router>
    );
  }
}
