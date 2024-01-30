'use strict';
const images = {
  logo: require('./logo_new.png'),
  login_bg: require('./login_bg.png'),
  forgot_password: require('./forgot_password.png'),
  bidder: require('./bid.png'),
  auctioner: require('./auctioneer.png'),
  calendar: require('./calendar.png'),
  bgCurve: require('./bg1.png'),
  bgcolor: require('./bg2.png'),
  bgcolor1: require('./bg3.png'),
  bgellipse: require('./ellipse.png'),
  mask1: require('./mask1.png'),
  mask2: require('./mask2.png'),
  privacy_bg: require('./privacy_policy_bg.png'),
  about_bg: require('./about_us_bg.png'),

  // Harrj BG
  harrj_bg: require('./harrjbg/harrjBg.png'),

  // Example Img
  img1: require('./rolex.jpg'),
  img2: require('./Titan.jpg'),
  img3: require('./diamond-necklace.png'),
  img4: require('./acer.jpg'),
  img5: require('./Nikon.png'),
  img6: require('./rolex.jpg'),
  img7: require('./iphone.png'),
  img8: require('./msi.png'),
  img9: require('./rolex.jpg'),

  // Drawer Icons

  DrawerHomeIcon: require('./DrawerIcons/home.png'),
  DrawerProductsIcon: require('./DrawerIcons/products.png'),
  DrawerBidsIcon: require('./DrawerIcons/mybids.png'),
  DrawerContactusIcon: require('./DrawerIcons/contactus.png'),
  DrawerAboutIcon: require('./DrawerIcons/aboutus.png'),
  DrawerPrivacyIcon: require('./DrawerIcons/policy.png'),
  DrawerReportIcon: require('./DrawerIcons/list.png'),
  DrawerShareIcon: require('./DrawerIcons/share.png'),
  DrawerSignoutIcon: require('./DrawerIcons/signout.png'),
  DrawerTranslationIcon: require('./DrawerIcons/translation.png'),
  DrawerLogoutIcon: require('./DrawerIcons/logout.png'),
  DrawerMyProductsIcon: require('./DrawerIcons/myproducts.png'),
  MenuIcon: require('./DrawerIcons/menuIcon.png'),
  SearchBg: require('./DrawerIcons/searchbg.png'),
  bell: require('./DrawerIcons/bell.png'),
  drawerHome: require('./DrawerIcons/drawer_home.png'),
  drawerAboutus: require('./DrawerIcons/drawer_AboutUs.png'),
  drawerShare: require('./DrawerIcons/drawer_share.png'),
  drawerLogout: require('./DrawerIcons/drawer_logout.png'),
  drawerProduct: require('./DrawerIcons/drawer_product.png'),
  drawerBids: require('./DrawerIcons/drawer_bids.png'),
  drawerMyProducts: require('./DrawerIcons/drawer_my_products.png'),
  drawerContact: require('./DrawerIcons/drawer_contact_us.png'),
  drawerPrivacy: require('./DrawerIcons/drawer_privacy_policy.png'),
  drawerReport: require('./DrawerIcons/drawer_my_reports.png'),
  drawerSignout: require('./DrawerIcons/drawer_signout.png'),
  drawerLang: require('./DrawerIcons/drawer_langauge.png'),

  // Home Screen

  orangeLine: require('./HomeScreen/orangeLine.png'),
  sun: require('./HomeScreen/sun.png'),
  fav: require('./HomeScreen/fav.png'),
  not_fav: require('./HomeScreen/not_fav.png'),
  bids: require('./HomeScreen/bids.png'),
  date: require('./HomeScreen/date.png'),
  time: require('./HomeScreen/time.png'),
  cart: require('./HomeScreen/cart.png'),
  filter_icon: require('./HomeScreen/filter_icon.png'),
  search_icon: require('./HomeScreen/search_icon.png'),
  my_profile: require('./HomeScreen/myProfile.png'),
  start_time: require('./clock.png'),
  noAdFound : require('./HomeScreen/noAdFound.png'),

  // Profile

  profile_bg: require('./profile/profile.png'),

  //  My Products Icons

  finishIcon: require('./my_products_icons/finish.png'),
  deleteIcon: require('./my_products_icons/delete.png'),
  editIcon: require('./my_products_icons/edit.png'),

  // Create Ads Icons

  normal_ads: require('./CreateAd/normal_ads.png'),
  schedule_live: require('./CreateAd/schedule_live.png'),
  live_now: require('./CreateAd/live_now.png'),
  gallery_icon: require('./CreateAd/gallery.png'),
  photo_camera: require('./CreateAd/photo_camera.png'),

  // Bottom Bar Icons

  homeIcon: require('./BottomBarIcons/homepage.png'),
  normalBidIcon: require('./BottomBarIcons/compass.png'),
  liveBidIcon: require('./BottomBarIcons/video-camera.png'),
  searchIcon: require('./BottomBarIcons/search.png'),
  // createAd: require('./BottomBarIcons/createAd.png'),
  createAd: require('./BottomBarIcons/plus.png'),

  arrowLeft: require('./signup/arrow_left.png'),
  arrowRight: require('./signup/arrow_right.png'),
  leftArrow: require('./signup/left_arrow.png'),
  leftArrow1: require('./signup/left_arrow1.png'),
  arrowLeftGreen: require('./signup/arrow_left_green.png'),
  check: require('./signup/check.png'),
  eyeClosed: require('./signup/eye_closed.png'),
  ic_down_arrow: require('./signup/ic_down_arrow.png'),
  ic_arrow_up: require('./signup/ic_arrow_up.png'),
  ic_arrow_down: require('./signup/ic_arrow_down.png'),
  chevron_right: require('./signup/chevron_right.png'),
  caret_down: require('./signup/caret_down.png'),
  clock: require('./signup/clock.png'),
  caret_up: require('./signup/caret_up.png'),
  ic_arrows_clockwise: require('./signup/ic_arrows_clockwise.png'),
  ic_arrow_left: require('./signup/ic_arrow_left.png'),

  ic_splash_1: require('./signup/harjj_splash_1.png'),
  ic_splash_2: require('./signup/harjj_splash_2.png'),

  ic_auction_1: require('./signup/auction_log1.png'),
  ic_auction_2: require('./signup/auction_log2.png'),
  ic_auction_3: require('./signup/auction_log3.png'),
  ic_auction_4: require('./signup/auction_log4.jpg'),
  ic_auction_5: require('./signup/auction_log5.jpg'),

  ic_harjj_logo: require('./harrj_logo.png'),
  ic_harjj_logo1: require('./signup/harjj_logo1.png'),

  ic_sign_up_bg: require('./signup/sign_up_bg.png'),
  ic_sign_up_lg: require('./signup/sign_up_logo.png'),

  ic_person: require('./signup/user.png'),
  ic_phone: require('./signup/phone.png'),
  ic_email: require('./signup/email.png'),
  ic_password: require('./signup/locked.png'),

  ic_sign_in_bg: require('./signup/sign_in_bg.png'),
  ic_sign_in_lg: require('./signup/sign_in_logo.png'),
  ic_menu_launch: require('./signup/menu_launch.png'),
  ic_search: require('./signup/ic_search.png'),

  ic_ad: require('./signup/ic_ad.png'),
  ic_car: require('./signup/ic_car.jpg'),
  ic_car2: require('./signup/ic_car2.png'),
  ic_tyre: require('./signup/ic_tyre.png'),
  ic_sofa: require('./signup/ic_sofa.png'),
  ic_sofa1: require('./signup/ic_sofa1.png'),
  ic_property: require('./signup/ic_property.png'),
  ic_property1: require('./signup/ic_property1.jpg'),

  ic_bt_home: require('./signup/ic_bt_home.png'),
  ic_bt_compass: require('./signup/ic_bt_compass.png'),
  ic_bt_plus: require('./signup/ic_bt_plus.png'),
  ic_bt_message: require('./signup/ic_bt_message.png'),
  ic_bt_person: require('./signup/ic_bt_person.png'),

  ic_car_sample1: require('./signup/ic_car_sample1.png'),
  ic_car_sample2: require('./signup/ic_car_sample2.png'),
  ic_car_sample3: require('./signup/ic_car_sample3.png'),
  ic_car_sample4: require('./signup/ic_car_sample4.png'),
  ic_car_sample5: require('./signup/ic_car_sample5.png'),
  ic_car_sample6: require('./signup/ic_car_sample6.png'),

  ic_list: require('./signup/list.png'),
  ic_grid: require('./signup/grid.png'),

  ic_scanner: require('./signup/ic_scanner.png'),

  ic_phone_call: require('./signup/ic_phone_call.png'),
  ic_microphone: require('./signup/ic_microphone.png'),
  ic_video_camera: require('./signup/ic_video_camera.png'),
  ic_arrows_clockwise: require('./signup/ic_arrows_clockwise.png'),
  ic_chat: require('./signup/ic_chat.png'),
  ic_logout: require('./signup/switch.png'),
};
export default images;
