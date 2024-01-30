'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
	  errorText: {
	  	textAlign: 'left',
	    color:'#FF3333',
	    fontFamily:'Rubik-Regular',
	    fontSize:12,
	    marginTop:10,
	    marginHorizontal: 28,
	  },
      container : {
	    backgroundColor: '#FAFAFA',
	    flex: 1,
	    alignItems:'center',
	    justifyContent :'center'
	  },
	  centerContainer: {
	      alignItems:'center'
	   },
	  rowContainer: {
	      flexDirection: 'row',
	      justifyContent: 'space-between',
	      alignItems: 'center',
	      marginHorizontal: 20,
	      marginTop:30,
	   },
	   headTextContainer: {
	   	flexDirection: 'row', 
	   	alignItems:'center', 
	   	marginTop:16, 
	   	marginHorizontal: 28,
	   },
	   onboardingRowContainer: {
	      marginHorizontal: 28,
	      alignItems:'center'
	   },
	  otpSubcontainer : {
	    width: '100%',
	    marginHorizontal: 0,
	    marginRight:0,
	    marginTop :16,
	    justifyContent: 'center',
	  },
	  otpcontainer : {
	    flexDirection: 'row',
	    marginHorizontal: 20,
	    marginTop :20,
	  },
	  formRowContainer : {
	    flexDirection:'row',
	    marginHorizontal: 20,
	    marginTop: 25,
	  },
	  headingContainerBlackShade:{
	  	backgroundColor: "#000000", paddingLeft:5, paddingTop:2, paddingRight:5, paddingBottom:2,
	  },
	  textTitleBlackShade:{
	  	fontFamily:'Rubik-Regular', textAlign: 'left', color:'#FFFFFF', fontSize:11,
	  },
	  chooseSuboneContainer : {
	    backgroundColor:'#FAFAFA',
	    alignItems:'center',
	    width: 160,
	    height: 160,
	    marginTop: 35,
	    borderRadius: 10,
	    elevation: 3,
	  },
	  insuranceIntroDatContainer : {
	    backgroundColor:'#FAFAFA',
	    alignItems:'center',
	    width: 335,
	    height: 150,
	    marginTop: 16,
	    marginHorizontal: 28,
	    marginRight:0,
	    borderRadius: 5,
	    elevation: 3,
	  },
	  previousfacilitiesDatContainer : {
	    backgroundColor:'#FAFAFA',
	    alignItems:'center',
	    width: 335,
	    height: 100,
	    marginTop: 16,
	    marginHorizontal: 28,
	    marginRight:0,
	    borderRadius: 5,
	    elevation: 3,
	  },
	  careCircleDatContainer : {
	    backgroundColor:'#FAFAFA',
	    alignItems:'center',
	    width: 335,
	    height: 128,
	    marginTop: 16,
	    marginHorizontal: 28,
	    marginRight:0,
	    borderRadius: 5,
	    elevation: 3,
	  },
	  insuranceIntroCardHeadContainer : {
	    width:243, 
	    height:19, 
	    flexDirection:'row', 
	    flexGrow: 0, 
	    marginTop:16
	  },
	  insuranceIntroCardSubHeadContainer : {
	    width:268, 
	    height:19, 
	    flexDirection:'row', 
	    flexGrow: 0, 
	    marginTop:9
	  },
	  insuranceIntroCardDataContainer : {
	    width:268, 
	    flexDirection:'row', 
	    flexGrow: 0, 
	    marginTop:8
	  },
	  insuranceIntroAddoptContainer : {
	    flexDirection:'row', 
	    marginTop:16, 
	    marginHorizontal:28, 
	    alignItems: 'center',
	  },
	  containerRadioButtonCollectionPatRatings:{
	  	flexDirection: 'row', marginHorizontal:28
	  },
	  containerRadioButtonPatRatings:{
	  	flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
	  },
	  containerRatingCollectionRating:{
	  	marginHorizontal:28, alignItems:'flex-start', marginTop:7,
	  },
	  containerRatingTextRating:{
	  	marginHorizontal:28, flexDirection: 'row', justifyContent: 'space-between', marginTop:7,
	  },
	  textPoorRatingPatRating:{
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontSize:11,
	  },
	  textExcellentRatingPatRating:{
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontSize:11, marginRight:130,
	  },
	  textInputPatRating:{
	  	backgroundColor:'#FFFFFF', height: 83, marginTop: 2, marginHorizontal: 28, borderRadius: 5, elevation: 3,
	  },
	  searchInputPatCareFeedChat2:{
	  	width:'90%', borderColor: '#FFFFFF',
	  },
	  textHeadingPatClinicalInfo:{
	  	color:'#1B1E29', fontFamily:'Rubik-Bold', fontWeight: '500', fontSize:24, marginTop:35, marginHorizontal:24,
	  },
	  containerSwitchPatClinicalInfo:{
	  	flexDirection: 'row', alignItems: 'center', marginTop:19.5, marginHorizontal:24,
	  },
	  textSwitchPatClinicalInfo:{
	  	color:'#1B1E29', fontFamily:'Rubik-Bold', fontWeight: '400', fontSize:14,
	  },
	  switchPatClinicalInfo:{
	  	marginLeft:16, marginRight:2,
	  },
	  textSwitchStatusPatClinicalInfo:{
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontWeight: '400', fontSize:12,
	  },
	  textMsgSwitchPatClinicalInfo:{
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontWeight: '400', fontSize:14, marginHorizontal:24, marginTop:19.5,
	  },
	  textSubTitlePatClinicalInfo:{
	  	color:'#1B1E29', fontFamily:'Rubik-Bold', fontWeight: '400', fontSize:18, marginTop:19.5, marginHorizontal:24,
	  },
	  containerProfileDataPatClinicalInfo:{
	  	height:48, flexDirection: 'row', alignItems: 'center', marginHorizontal:24, marginTop:17.5,
	  },
	  imageProfileDataPatClinicalInfo:{
	  	width:48,
	  },
	  textProfileTitlePatClinicalInfo:{
	  	color:'#1B1E29', fontFamily:'Rubik-Bold', fontWeight: '400', fontSize:14, marginHorizontal:0, marginTop:0,
	  },
	  textProfileSubTitlePatClinicalInfo:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:14, marginHorizontal:0, marginTop:0,
	  },
	  textCard1TitlePatClinicalInfo:{
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:11,
	  },
	  textCard1SubTitlePatClinicalInfo:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:11, marginLeft:4,
	  },
	  textRequestTitlePatClinicalInfo:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontWeight: '400', fontSize:12, marginTop:9, textTransform: 'uppercase'
	  },
	  textCardTitle2PatClinicalInfo:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:11, marginTop:8,
	  },
	  textOlderDetailsPatClinicalInfo:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontWeight: '400', fontSize:12, marginTop:17, marginBottom:10, marginHorizontal:24, textTransform: 'uppercase'
	  },
	  modalContainerPatPreChatViatal:{
	  	backgroundColor:"#E5E5E5", flex:1, justifyContent: 'center',
	  },
	  modalFramePatPreChatViatal:{
	  	backgroundColor:"#FAFAFA", marginHorizontal:24, padding:24, borderBottomLeftRadius:0, borderBottomRightRadius:0, borderTopLeftRadius:10, borderTopRightRadius:10, flex:0.19, marginTop:0,
	  },
	  modalTitlePatPreChatViatal:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:17, fontWeight:'bold', textAlign:'center', marginTop:24,
	  },
	  modalSubTitlePatPreChatViatal:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:13, fontWeight:'300', textAlign:'center', marginTop:8
	  },
	  modalButtonContainerPatPreChatViatal:{
	  	flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal:24, marginTop:2,
	  },
	  modalNoButtonContainerPatPreChatViatal:{
	  	backgroundColor:"#FAFAFA", marginHorizontal:0, padding:0, borderBottomLeftRadius:15, borderBottomRightRadius:0, borderTopLeftRadius:0, borderTopRightRadius:0, width:'50%', height:38, alignItems:'center', justifyContent:'center',
	  },
	  modalYesButtonContainerPatPreChatViatal:{
	  	backgroundColor:"#FAFAFA", marginHorizontal:0, padding:0, borderBottomLeftRadius:0, borderBottomRightRadius:15, borderTopLeftRadius:0, borderTopRightRadius:0, width:'50%', height:38, alignItems:'center', justifyContent:'center',
	  },
	  modalTextButtonPatPreChatViatal:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:17, fontWeight:'bold', textAlign:'center', marginTop:0,
	  },
	  backContainerHeadMenuVideoChat:{
	  	flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop:24, marginHorizontal:24,
	  },
	  backArrowImageVideoChat:{
	  	width:32, 
	  	height:32,
	  },
	  backArrowTextVideoChat:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', color:'#6D707D', textAlign: 'left', fontSize:14, marginHorizontal:5,
	  },
	  cameraViewContainerVideoChat:{
	  	flexDirection: 'row', justifyContent: 'flex-end', marginTop:12,
	  },
	  cameraViewFrameVideoChat:{
	  	width:104, height:144, backgroundColor:'#1B1E29', borderRadius:5, marginRight:24, flexDirection: 'row', justifyContent: 'flex-end',
	  },
	  modalFrameContainerPatCareCircle:{
	  	backgroundColor:"#E5E5E5", flex:1, justifyContent: 'flex-end',
	  },
	  modalFramePatCareCircle:{
	  	backgroundColor:"#FAFAFA", margin:10, padding:0, borderRadius:10, flex:1,
	  },
	  modalTopButtonCancelCareCircle:{
	  	color: '#6D707D', marginTop: 0, marginHorizontal:0, marginRight:10, fontFamily:'Rubik-Regular', fontSize:14, fontWeight:'300',
	  },
	  modalTopButtonCareTitleCareCircle:{
	  	color: '#6D707D', marginTop: 0, marginHorizontal:0, fontFamily:'Rubik-Regular', fontSize:16, fontWeight:'300', textAlign:'center',
	  },
	  modalTopButtonAddCareCircle:{
	  	width:74, height:32, marginHorizontal:0, backgroundColor:'#0086C3', alignItems:'center', justifyContent: 'center',
	  },
	  modalFrameContainerPreviousFacilities:{
	  	backgroundColor:"#E5E5E5", flex:1, justifyContent: 'flex-end',
	  },
	  modalFramePreviousFacilities:{
	  	// width:375, height:471, 
	  	backgroundColor:"#FAFAFA", margin:10, padding:0, borderRadius:10, flex:0.5,
	  },
	  modalTopButtonContainerPreviousFacilities:{
	  	flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, marginTop:30,
	  },
	  modalTopButtonCancelPreviousFacilities:{
	  	color: '#6D707D', marginTop: 0, marginHorizontal:8, marginRight:34, fontFamily:'Rubik-Regular', fontSize:14, fontWeight:'300',
	  },
	  modalTopButtonDetailsPreviousFacilities:{
	  	color: '#6D707D', marginTop: 0, marginHorizontal:18, fontFamily:'Rubik-Regular', fontSize:16, fontWeight:'300',
	  },
	  modalTopButtonAddPreviousFacilities:{
	  	height:32, marginHorizontal:24, backgroundColor:'#0086C3', alignItems:'center', justifyContent: 'center',
	  },
	  modalEditBoxTitleTextPreviousFacilities:{
	  	fontFamily:'Rubik-Regular', textAlign: 'left', color:'#1B1E29', fontSize:14, marginTop:16, marginHorizontal: 20, textTransform: 'uppercase',
	  },
	  modalEditBoxContainerPreviousFacilities:{
	  	flexDirection:'row', marginHorizontal: 20,  marginVertical:0, backgroundColor: "#FFFFFF", borderColor: '#FFFFFF',  borderWidth: 1, borderBottomWidth :1, borderBottomColor: '#000', alignItems:'center', justifyContent: 'center',
	  },
	  modalFrameContainerSwitchUser:{
	  	backgroundColor:"#E5E5E5", flex:1, justifyContent: 'flex-start',
	  },
	  modalFrameSwitchUser:{
	  	backgroundColor:"#FAFAFA", marginHorizontal:24, padding:16, borderRadius:10, flex:0.1,
	  },
	  modalFrameContainerClinicalFirstTime:{
	  	backgroundColor:"#E5E5E5", flex:1, justifyContent: 'center',
	  },
	  modalFrameClinicalFirstTime:{
	  	backgroundColor:"#FAFAFA", margin:24, padding:16, borderRadius:10, flex:0.3,
	  },
	  textHeadTitleModalClinicalFirstTime:{
	  	color:'#1B1E29', fontFamily:'Rubik-Bold', fontWeight: '400', fontSize:18, marginTop:16,
	  },
	  textHeadTitleSelectSpecProvider:{
	  	fontFamily:'Rubik-Regular', fontWeight: 'bold', textAlign: 'left', color:'#1B1E29', fontSize:14,
	  },
	  buttonShadedSelectSpecProvider:{
	  	height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#29B6F6',
	  },
	  buttonPlaneSelectSpecProvider:{
	  	height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#FFFFFF', borderColor:'#29B6F6', borderWidth:1,
	  },
	  containerSearchPlaneSelectSpecProvider:{
	  	width:'100%', height:40, flexDirection:'row', backgroundColor: "#FFFFFF", borderColor: '#FFFFFF', borderWidth: 1, alignItems:'center', justifyContent: 'center', marginTop:16,
	  },
	  textHeadDataModalClinicalFirstTime:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:16, marginTop:16,
	  },
	  containerButtonModalClinicalFirstTime:{
	  	marginVertical:16, flexDirection: 'row', justifyContent: 'space-between',
	  },
	  noButtonModalClinicalFirstTime:{
	  	width: 144, height:40, backgroundColor:'#FFFFFF', borderColor: '#0086C3', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
	  },
	  noButtonModalProvPatientDetails:{
	  	width: 144, height:40, backgroundColor:'#FFFFFF', borderColor: '#0086C3', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
	  },
	  noButtonTextModalProvPatientDetails:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:14, textAlign:'center',
	  },
	  noButtonTextModalClinicalFirstTime:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:14,
	  },
	  yesButtonModalClinicalFirstTime:{
	  	width: 144, height:40, backgroundColor:'#0086C3', borderColor: '#0086C3', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
	  },
	  yesButtonModalProvPatientDetails:{
	  	width: 144, height:40, backgroundColor:'#0086C3', borderColor: '#0086C3', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
	  },
	  yesButtonTextModalClinicalFirstTime:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:14,
	  },
	  yesButtonTextModalProvPatientDetails:{
	  	color:'#FFFFFF', fontFamily:'Rubik-Regular', fontWeight: '300', fontSize:14,
	  },
	  modalFrameContainerVideoChats:{
	  	backgroundColor:"#C5C5C5", flex:1, justifyContent: 'flex-end',
	  },
	  modalFrameVideoChats:{
	  	width:375, height:471, backgroundColor:"#FAFAFA", margin:10, padding:0, borderRadius:10, flex:1
	  },
	  modalMenuVideoChats:{
	  	flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 24, marginTop:30,
	  },
	  modal2MenuVideoChats:{
	  	flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginTop:30,
	  },
	  modalTitleTextVideoChats:{
	  	fontFamily:'Rubik-Regular', fontWeight: 'bold', textAlign: 'left', color:'#1B1E29', fontSize:14,
	  },
	  modalHeadTitleTextVideoChats:{
	  	fontFamily:'Rubik-Regular', fontWeight: 'normal', textAlign: 'left', color:'#1B1E29', fontSize:16, marginHorizontal:8,
	  },
	  modalItem1TextVideoChats:{
	  	color: '#6D707D', fontFamily:'Rubik-Regular', fontSize:16, fontWeight:'300',
	  },
	  modalItem1ButtonVideoChats:{
	  	borderRadius: 30, backgroundColor: '#F9DC77', alignItems:'center', justifyContent :'center'
	  },
	  modalItem1ButtonTextVideoChats:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:14, paddingLeft:10, paddingRight:10, paddingTop:7, paddingBottom:7
	  },
	  modalItemTitleTextVideoChats:{
	  	fontFamily:'Rubik-Regular', fontWeight: 'bold', textAlign: 'left', color:'#1B1E29', fontSize:12, textTransform: 'uppercase',
	  },
	  modalItemSubTitleTextVideoChats:{
	  	fontFamily:'Rubik-Regular', fontWeight:'300', textAlign: 'left', color:'#00A896', fontSize:11,
	  },
	  modalItemContainerVideoChats:{
	  	flexDirection: 'row', justifyContent: 'space-between', marginTop:8
	  },
	  modalItemTextVideoChats:{
	  	fontFamily:'Rubik-Regular', fontWeight:'300', textAlign: 'left', 

	  },
	  modalItemDataHeadTextVideoChats:{
	  	fontFamily:'Rubik-Regular', fontWeight:'300', textAlign: 'left', color:'#6D707D', fontSize:11,
	  },
	  modalItemDataValueTextVideoChats:{
	  	fontFamily:'Rubik-Regular', fontWeight:'300', textAlign: 'left', color:'#1B1E29', fontSize:14,
	  },
	  pageContainerPreChatVitalPateints:{
	  	backgroundColor:'#1B1E29', 
	  	flex: 1,
	  },
	  modalFrameContainerCareFeed:{
	  	backgroundColor:"#1B1E29", flex:1, justifyContent: 'flex-start', margin:0,
	  },
	  modalFrameCareFeed:{
	  	backgroundColor:"#FAFAFA", margin:0, padding:10, borderRadius:10, flex:0.3,
	  },
	  modalFrameContainerChooseDoc:{
	  	backgroundColor:"#1B1E29", flex:1, justifyContent: 'flex-end', margin:0,
	  },
	  modalFrameChooseDoc:{
	  	backgroundColor:"#FAFAFA", margin:0, padding:10, borderRadius:10, flex:0.6,
	  },
	  modalMenuChooseDoc:{
	  	flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, marginTop:30,
	  },
	  modalFilterMenuContainerChooseDoc:{
	  	flexDirection: 'row', alignItems:'center', marginHorizontal: 20, marginLeft:20
	  },
	  modalFilterMenuTextChooseDoc:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontSize:12, marginTop:0, marginHorizontal: 11,
	  },
	  modalMenu2ContainerChooseDoc:{
	  	borderRadius: 30, backgroundColor: '#FFFFFF', alignItems:'center', justifyContent :'center',
	  },
	  modalMenu2TextChooseDoc:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontSize:14, paddingLeft:11, paddingRight:11, paddingTop:7.5, paddingBottom:7.5,
	  },
	  modalMenu3TextChooseDoc:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:14, paddingLeft:21, paddingRight:21, paddingTop:7.5, paddingBottom:7.5
	  },
	  filterModalHeadTitleTextChoosDoc:{
	  	fontFamily:'Rubik-Regular', textAlign: 'left', color:'#1B1E29', fontSize:12, marginTop:16, marginHorizontal: 20, textTransform: 'uppercase',
	  },
	  filterModalContainerOptionsChoosDoc:{
	  	flexDirection:'row', marginHorizontal: 20,  marginTop:8,
	  },
	  filterModalOptionButtonChoosDoc:{
	  	borderRadius: 30, backgroundColor: '#0086C3', alignItems:'center', justifyContent :'center',
	  },
	  filterModalOptionButtonCareFeedProvider:{
		borderRadius: 30, backgroundColor: '#0086C3', alignItems:'center', justifyContent :'center',
	  },
	  containerModalOptionButtonSelectSpecProvider:{
		borderRadius: 30, alignItems:'center', justifyContent :'center', backgroundColor:'#73E8FF', width:94, height:28
	  },
	  filterModalOptionButton2ChoosDoc:{
	  	borderRadius: 30, backgroundColor: '#EAEAEA', alignItems:'center', justifyContent :'center',
	  },
	  containerModalOptionButton2SelectSpecProvider:{
	  	borderRadius: 30, backgroundColor: '#EAEAEA', alignItems:'center', justifyContent :'center', width:94, height:28,
	  },
	  filterModalOptionButtonTextChoosDoc:{
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontSize:11, paddingLeft:8, paddingRight:8, paddingTop:7.5, paddingBottom:7.5,
	  },
	  backContainerPreChatVitalPateints:{
	  	flexDirection: 'row', 
	  	alignItems: 'center', 
	  	marginHorizontal: 24, 
	  	marginTop:21, 
	  	justifyContent: 'space-between',
	  },
	  backArrowContainerPreChatVitalPateints:{
		flexDirection: 'row', 
		alignItems: 'center',
	  },
	  backArrowImagePreChatVitalPateints:{
	  	width:40, 
	  	height:40,
	  },
	  headTextPreChatVitalPateints:{
	  	fontFamily:'Rubik-Light', 
	  	fontWeight:'300', 
	  	color:'#6D707D', 
	  	textAlign: 'left', 
	  	fontSize:16, 
	  	marginTop:24, 
	  	marginHorizontal:24,
	  },
	  scannerImagePreChatVitalPateints:{
	  	alignItems: 'center', 
	  	justifyContent: 'center', 
	  	marginHorizontal:115, 
	  	marginTop:105,
	  },
	  menuLayoutContainerPreChatVitalPateints:{
	  	marginTop:365, 
	  	marginHorizontal: 24, 
	  	position: 'absolute', 
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between', 
	  	alignItems: 'center',
	  },
	  menu1ItemContainerPreChatVitalPateints:{
	  	width:110, 
	  	height:64, 
	  	backgroundColor:'#FAFAFA', 
	  	marginTop:35, 
	  	opacity:0.9, 
	  	borderRadius: 5, 
	  	elevation: 3,
	  },
	  menu1ItemHeadContainerPreChatVitalPateints:{
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between',
	  },
	  menu1ItemHeadTextPreChatVitalPateints:{
	  	fontFamily:'Rubik-Light', 
	  	fontWeight:'300', 
	  	color:'#424545', 
	  	textAlign: 'left', 
	  	fontSize:12, 
	  	marginTop:7, 
	  	marginHorizontal:4, 
	  	textTransform: 'uppercase', 
	  	fontWeight: 'bold',
	  },
	  menu1ItemHeadIconPreChatVitalPateints:{
	  	width:20, 
	  	height:20, 
	  	marginTop:4, 
	  	marginHorizontal:4,
	  },
	  menu1ItemSubHeadText1PreChatVitalPateints:{
	  	fontFamily:'Rubik-Light', 
	  	fontWeight:'300', 
	  	color:'#424545', 
	  	textAlign: 'left', 
	  	fontSize:30, 
	  	marginTop:3, 
	  	marginHorizontal:4,
	  },
	  menu1ItemSubHeadText2PreChatVitalPateints:{
	  	fontFamily:'Rubik-Light', 
	  	fontWeight:'300', 
	  	color:'#424545', 
	  	textAlign: 'left', 
	  	fontSize:12, 
	  	marginTop:9, 
	  	marginHorizontal:4,
	  },
	  menu2ItemHeadContainerPreChatVitalPateints:{
	  	height:56, 
	  	flexDirection: 'row', 
	  	justifyContent:'center', 
	  	alignItems: 'center',
	  },
	  menu2ItemTextPreChatVitalPateints:{
	  	fontFamily:'Rubik-Light', 
	  	fontWeight:'300', 
	  	color:'#6D707D', 
	  	textAlign: 'left', 
	  	fontSize:14, 
	  	marginRight:12,
	  },
	  menu2ItemContainerPreChatVitalPateints:{
	  	width:56, 
	  	height:56, 
	  	borderRadius:30, 
	  	alignItems: 'center', 
	  	justifyContent: 'center', 
	  	backgroundColor:'#FAFAFA',
	  },
	  menu2ItemIconPreChatVitalPateints:{
	  	width:32, 
	  	height:32, 
	  	tintColor:'#1B1E29',
	  },
	  menu2ItemIconPreChatVitalProvider:{
	  	width:32, 
	  	height:32, 
	  	tintColor:'#1B1E29',
	  },
	  menu2ItemIconPreChatVitalProviderThreeDot:{
	  	width:32, 
	  	height:32, 
	  	tintColor:'#FFFFFF',
	  },
	  bottomMenuContainerPreChatVitalPateints:{
	  	backgroundColor: '#FAFAFA', 
	  	height: 72, 
	  	marginTop: 'auto', 
	  	borderTopWidth :1, 
	  	borderTopColor: '#E5E5E5',
	  },
	  bottomMenuItemContainerPreChatVitalPateints:{
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between', 
	  	marginHorizontal:28, 
	  	marginTop:8,
	  },
	  bottomMenuItemIconPreChatVitalPateints:{
	  	width:32, 
	  	height:32, 
	  	marginTop:0, 
	  	tintColor:'#1B1E29', 
	  	// tintColor:'#F05545'
	  },
	  patientSubScrContainer : {
	    backgroundColor:'#FAFAFA',
	    alignItems:'center',
	    width: 335,
	    height: 180,
	    marginTop: 16,
	    marginHorizontal: 28,
	    marginRight:0,
	    borderRadius: 5,
	    elevation: 3,
	  },
	  chooseSubtwoContainer : {
	    backgroundColor:'#FAFAFA',
	    alignItems:'center',
	    width: 160,
	    height: 160,
	    marginTop: 36,
	    borderRadius: 10,
	    elevation: 3,
	  },
	  containerSub : {
	    flexGrow: 1,
	    alignItems:'center',
	    justifyContent :'center'
	  },
	  scrollView : {
	    backgroundColor:'#FAFAFA',
	    flex: 1,
	  },
	  Othercontainer : {
	    backgroundColor:'#FAFAFA',
	    flex: 1,
	  },
	  insuProgressBarLayout : {
	    marginTop:20.5, 
	    marginHorizontal: 28, 
	    marginBottom:0, 
	    flexDirection:'row', 
	    alignItems:'center',
	  },
	  insuProgressBarContainer : {
	  	width:'90%', 
	  	marginRight:10,
	  },
	  headSubcontainer : {
	    flexDirection:'row',
	    marginHorizontal:20,
	    marginTop:25
	  },
	  headSubcontainerProviderPatientSelected : {
	    flexDirection:'row',
	    marginHorizontal:20,
	    marginTop:39
	  },
	  phonePatientSignContainer : {
	  	flexDirection:'row', 
	  	marginHorizontal:28, 
	  	marginTop:2,
	  	borderColor: '#FFFFFF', 
	  	borderWidth: 1,
	    borderBottomWidth :1,
    	borderBottomColor: '#000',
	  },
	  passwdPatientSignContainer : {
	  	flexDirection:'row', 
	  	marginHorizontal:32, 
	  	marginTop:2,
	  },
	  patientUploadProfileContainer : {
	  	flexDirection:'row', 
	  	marginHorizontal:32, 
	  	marginTop:16,
	  },
	  patientUploadProfileContainer1 : {
	  	flexDirection:'row', 
	  	marginHorizontal:32, 
	  	marginTop:2,
	  },
	  patientUploadProfileContainerLink1 : {
	  	flexDirection:'row', 
	  	marginHorizontal:32, 
	  },
	  phonePatientPickerContainer : {
	  	width:'30%', 
	  	marginHorizontal:0, 
	  	marginVertical:0,
	  	backgroundColor: "#FFFFFF", 
	  	color:'#1B1E29', 
	  	borderColor: '#FFFFFF', 
	  	borderWidth: 1
	  },
	  phonePatientTextContainer : {
	  	flexDirection:'row',
	  	width:'69%', 
	  	marginHorizontal:1, 
	  	marginVertical:0, 
	  	backgroundColor: "#FFFFFF", 
	  	color:'#1B1E29', 
	  	borderColor: '#FFFFFF', 
	  	borderWidth: 1,
	  	alignItems:'center',
		// justifyContent: 'center',
	  },
	  passwordInputIconSubcontainer : {
	    flexDirection:'row',
	    marginHorizontal: 28,
	    marginTop:2,
	    marginVertical:0,
	    backgroundColor: "#FFFFFF",
	    borderColor: '#FFFFFF', 
	    borderWidth: 1,
	    borderBottomWidth :1,
    	borderBottomColor: '#000',
	    alignItems:'center',
	    justifyContent: 'center',
	  },
	  providerTypeSubcontainer : {
	    flexDirection:'row',
	    marginHorizontal: 28,
	    marginTop:16,
	    marginVertical:0,
	    backgroundColor: "#FFFFFF",
	    borderColor: '#FFFFFF', 
	    borderWidth: 1,
	    alignItems:'center',
	    justifyContent: 'center',
	  },
	  loginFootercontainer:{
	    flexDirection:'row',
	    marginHorizontal:0,
	    marginTop:23.5,
	    alignItems:'center',
	    justifyContent: 'center',
	  },
	  onboardingSuccessContainer : {
	    backgroundColor:'#0086C3',
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	  },
	  onboardingSuccessContainer_provider : {
	    backgroundColor:'#0086C3',
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	  },
	  ptRcHomeHeadContainer : {
	  	marginTop: 52, 
	  	marginHorizontal:28, 
	  	flexDirection: 'row'
	  },
	  ptRcHomeHeadTitleContainer : {
	  	width:236, 
	  	height:56,
	  },
	  ptRcHomeHeadIconContainer : {
	  	width:92, 
	  	height:56, 
	  	backgroundColor: '#1B1E29', 
	  	borderRadius: 30, 
	  	backgroundColor: "#FFFFFF", 
	  	flexDirection: 'row', 
	  	justifyContent: 'center', 
	  	alignItems: 'center',
	  },
	  ptRcHomeData1Container : {
	  	backgroundColor:'#FFFFFF', 
	  	width: 335, height: 204, 
	  	marginTop: 16, 
	  	marginHorizontal: 28, 
	  	marginRight:0, 
	  	borderRadius: 5, 
	  	elevation: 3,
	  },
	  ptRcHomeDataStrpi1Container : {
	  	width:296, 
	  	height:40, 
	  	backgroundColor:'#0086C3', 
	  	marginTop: 16, 
	  	marginHorizontal:16, 
	  	justifyContent: 'center', 
	  	alignItems: 'center',
	  },
	  ptRcHomeDataStrpi2Container : {
		width:296, 
		height:40, 
		borderColor:'#0086C3', 
		borderWidth: 1, 
		marginTop: 8, 
		marginHorizontal:16, 
		justifyContent: 'center', 
		alignItems: 'center',
	  },
	  ptRcHomeData2Container : {
	  	backgroundColor:'#FFFFFF', 
	  	width: 335, 
	  	height: 134, 
	  	marginTop: 16, 
	  	marginHorizontal: 28, 
	  	marginRight:0,
	  	borderRadius: 5, 
	  	elevation: 3,
	  },
	  ptRcHomeData3Container:{
	  	width:335, 
	  	height:48, 
	  	backgroundColor:'#EAEAEA', 
	  	marginTop: 8, 
	  	marginHorizontal:28, 
	  	justifyContent: 'center', 
	  	alignItems: 'center',
	  },
	  providerChooseSpecData3Container:{
	  	width:335, 
	  	height:48, 
	  	backgroundColor:'#FFFFFF', 
	  	marginTop: 8, 
	  	marginHorizontal:28, 
	  	justifyContent: 'center', 
	  	alignItems: 'center',
	  },
	  ptRcHomeHeadText : {
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:16, 
	  },
	  ptRcHomeSubHeadText : {
	  	fontFamily:'Rubik-Light', 
	  	fontWeight:'300', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:30, 
	  },
	  ptRcHomeIconImg : {
	  	width:48, 
	  	height:48,
	  },
	  ptRcHomeIcon1Img : {
	  	width:24,
	  	height:24, 
	  	marginHorizontal:7
	  },
	  ptRcHomeDataTitleText : {
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14,
	  	marginTop:16, 
	  	marginHorizontal:16,
	  },
	  ptRcHomeDataStrpi1Text : {
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14,
	  },
	  ptRcHomeDataStrpi2Text : {
	  	color:'#0086C3', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14, 
	  	textAlign: 'center', 
	  	alignItems:'center', 
	  	justifyContent: 'center',
	  },
	  ptRcHomeData2Strpi1Text : {
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14, 
	  	marginTop: 16, 
	  	marginHorizontal:16,
	  },
	  ptRcHomeData2Strpi2Text : {
	  	color:'#0086C3', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14, 
	  	marginHorizontal:16,
	  },
	  ptRcHomeData3Text : {
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14, 
	  	marginTop:16, 
	  	marginHorizontal:28,
	  },
	  logoutContainer : {
	  	height:30, 
	  	marginTop: 160, 
	  	marginHorizontal:24, 
	  	flexDirection: 'row', 
	  	alignItems: 'center',
	  },
	  logoutText : {
	  	width:264, 
	  	height:20, 
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:16, 
	  	marginTop:2,
	  	marginHorizontal:8,
	  },
	  logoutImage : {
	  	width:24, 
	  	height:24,
	  },
	  bottomFilterContainer : {
	  	backgroundColor: '#FAFAFA', flexDirection: 'row', height: 72, justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTopWidth :1, borderTopColor: '#E5E5E5',
	  },
	  bottomFilterMenuContainer : {
	  	flexDirection: 'row', alignItems:'center', marginHorizontal: 20, marginLeft:20,
	  },
	  bottomFilterMenuText : {
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontSize:12, marginTop:0, marginHorizontal: 11,
	  },
	  bottomNavigationContainer : {
	  	backgroundColor: '#FAFAFA', 
	  	flexDirection: 'row', 
	  	height: 72, 
	  	justifyContent: 'center', 
	  	alignItems: 'center', 
	  	marginTop: 'auto', 
	  	borderTopWidth :1, 
	  	borderTopColor: '#E5E5E5',
	  },
	  bottomNavigationMenuContainer : {
	  	width:60, 
	  	height:60, 
	  	alignItems:'center', 
	  	marginHorizontal: 20, 
	  	marginLeft:20
	  },
	  bottomNavigationMenuImageContainer : {
	  	width:32, 
	  	height:32, 
	  	marginTop:5,
	  },
	  bottomNavigationMenuTitleText : {
	  	color:'#6D707D', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:12, 
	  	marginTop:2,
	  },

	  // checkboxContainer: {
	  //   flexDirection: "row",
	  // },
	  checkbox: {
	    marginTop:0,
	    marginHorizontal: 0,
	    color:'#0086C3',
	  },

	  checkbox_provider: {
	    marginTop:0,
	    marginHorizontal: 0,
	    color:'#ff0000',
	  },
	  // checkboxLogin: {
	  //   marginTop:20,
	  //   marginHorizontal: 28,
	  //   color:'#0086C3',
	  // },
	  loginCheckboxContainer: {
	    flexDirection:'row',
	    marginHorizontal:28,
	    marginTop:19.5,
	    alignItems:'center'
	  },
	  prNotifCheckboxContainer: {
	    flexDirection:'row',
	    marginHorizontal:28,
	    marginTop:23,
	    alignItems:'center'
	  },
	  textInputContainer: {
	    textAlign: 'center',
	    color:'#00A896',
	    fontSize:30,
	    marginTop:0,
	    marginHorizontal: 0,
	    marginVertical:28,
	    padding:12
	  },
	  textInputContainernew: {
	    textAlign: 'center',
	    color:'#00A896',
	    fontSize:30,
	    marginTop:0,
	    marginHorizontal: 0,
	    marginVertical:10,
	    padding:12
	  },
	  eyeClosedContainer: {
	  	width:'10%',
	  	// height:"35%",
	  	marginHorizontal:0,
	  	// backgroundColor: "#FFFFFF",
	  	// borderColor: '#FFFFFF',
	  	// borderWidth: 1,
	  	// alignItems:'center',
	  	// justifyContent: 'center'
	  },
	  signupTextCont : {
	  	flexGrow: 1,
	    alignItems:'flex-end',
	    justifyContent :'center',
	    paddingVertical:16,
	    flexDirection:'row'
	  },
	  headText : {
	    // fontFamily:'Rubik-Regular',
	    fontFamily:'Rubik-Light',
	    fontWeight:'300',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:30,
	    marginTop:15.5,
	    marginHorizontal: 28,
	  },
	  headText1 : {
	    // fontFamily:'Rubik-Regular',
	    fontFamily:'Rubik-Light',
	    fontWeight:'300',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:30,
	    marginTop:17.5,
	    marginHorizontal: 28,
	  },
	  textEditBoxHint:{
		fontFamily:'Rubik-Regular', 
		textAlign: 'left', 
		color:'#6D707D', 
		fontSize:14, 
		marginTop:2, 
		marginHorizontal: 28,
	  },
	  containerDataInvitePeerProvider:{
	  	marginTop: 24, 
	  	marginHorizontal:28, 
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between',
	  },
	  textHeading1InvitePeerProvider:{
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight: 'bold', 
	  	fontSize:16,
	  },
	  textHeading2InvitePeerProvider:{
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Italic', 
	  	fontSize:12, 
	  	marginLeft:6, 
	  	marginTop:5,
	  },
	  textSubHeading1InvitePeerProvider:{
	  	fontFamily:'Rubik-Light', 
	  	fontWeight:'300', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:14, marginTop:4,
	  },
	  textSubHeading2InvitePeerProvider:{
	  	color:'#0086C3', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:15, 
	  	marginTop:10,
	  },
	  containerProfileTitleProvider:{
	  	marginTop: 52, 
	  	marginHorizontal:28, 
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between',
	  },
	  containerProfileImageProvider:{
	  	width:56, 
	  	height:56,
	  },
	  containerSearchCareFeedPat:{
		width:'90%', height:40, flexDirection:'row', backgroundColor: "#FFFFFF", borderColor: '#FFFFFF', borderWidth: 1, alignItems:'center', justifyContent: 'center', marginLeft:8,
	  },
	  containerChatCareFeedPat:{
	  	marginHorizontal:28, flexDirection:'row', marginVertical:13,
	  },
	  containerChatProviderPatientDetails:{flexDirection:'row', marginVertical:13,
	  },
	  iconChatCareFeedPat:{
	  	width:40, height:40, marginTop:0, backgroundColor:'#E5E5E5', borderRadius: 30,
	  },
	  textTitleHeadCareFeedProvider:{
		color:'#1B1E29', fontFamily:'Rubik-Regular', fontWeight:'400', fontSize:16, textAlign:'center', marginHorizontal:24, marginTop:16,
	  },
	  containerHeadTextChatCareFeedPat:{
	  	flexDirection: 'row', justifyContent: 'space-between', width:'71%', alignItems: 'center',
	  },
	  containerHeadTextChatCareFeedProvider:{
		flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
	  },
	  containerHeadTextNameCareFeedProvider:{
		flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
	  },
	  textHeadTextOptionCareFeedProvider:{
		fontFamily:'Rubik-Regular', fontSize:11, paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3, color:'#FFFFFF',
	  },
	  headTextChatCareFeedPat:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:14,
	  },
	  headText2ChatCareFeedPat:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:11,
	  },
	  headText2ChatCareFeedProvider:{
		color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:11, textAlign:'center', 
	  },
	  subHeadTextChatCareFeedPat:{
	  	color:'#6D707D', fontFamily:'Rubik-Regular', fontSize:14, marginTop:4,
	  },
	  containerMoreOptionChatCareFeedPat:{
	  	width:'71%', height:24, marginTop:5, alignItems: 'center', flexDirection:'row',
	  },
	  textMoreOptionChatCareFeedPat:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontSize:14, marginTop:0, marginHorizontal:0, textTransform: 'uppercase',
	  },
	  textMoreOptionChatCareFeedProvider:{
		color:'#29B6F6', fontFamily:'Rubik-Regular', fontSize:14, marginTop:0, marginHorizontal:0, textTransform: 'uppercase',
	  },
	  containerButtonOptionChatCareFeedPat:{
	  	flexDirection: 'row', justifyContent: 'space-between', width:'71%', marginTop:13, alignItems: 'center', justifyContent :'center',
	  },
	  containerButtonOptionChatCareFeedProvider:{
		flexDirection: 'row', justifyContent: 'space-between', marginTop:13, alignItems: 'center', justifyContent :'center',
	  },
	  buttonOptionChatCareFeedPat:{
	  	borderRadius: 30, alignItems:'center', justifyContent :'center', backgroundColor: '#FFFFFF',
	  },
	  containerTimerOptionCareFeedProvider:{
		borderRadius: 30, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor:'#0086C3', borderWidth:1, marginTop:10,
	  },
	  containerTimerOptionItem1CareFeedProvider:{
		alignItems:'center', justifyContent :'center', padding:10
	  },
	  containerTimerOptionItem2CareFeedProvider:{
		borderLeftColor:'#0086C3', borderLeftWidth:1, borderRightColor:'#0086C3', borderRightWidth:1, alignItems:'center', justifyContent :'center', paddingLeft:30, paddingRight:30
	  },
	  textTimerOptionCareFeedProvider:{
		color:'#6D707D', fontFamily:'Rubik-Regular', fontSize:12, textTransform: 'uppercase', textAlign:'center',
	  },
	  textButtonOptionChatCareFeedPat:{
	  	color:'#0086C3', fontFamily:'Rubik-Regular', fontSize:12, paddingLeft:39, paddingRight:39, paddingTop:10, paddingBottom:10, textTransform: 'uppercase',
	  },
	  textButtonOptionChatCareFeedProvider:{
		color:'#6D707D', fontFamily:'Rubik-Regular', fontSize:12, paddingLeft:39, paddingRight:39, paddingTop:10, paddingBottom:10, textTransform: 'uppercase',
	  },
	  dividerLine :{
	  	backgroundColor: '#E5E5E5', 
	  	height: 1, 
	  	marginHorizontal: 24, 
	  	// marginTop:28,
	  },
	  containerMenuProfileAccount:{
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between',
	  	 alignItems: 'center',
	  	 marginHorizontal:24,
	  },
	  containerMenuTitleProfileAccount:{
	  	flexDirection: 'row', 
	  	alignItems: 'center',
	  },
	  textMenuProfileAccount:{
	  	height:20, 
	  	color:'#1B1E29', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:16, 
	  	marginVertical:18,
	  },
	  iconMenuProfileAccountPatient:{
	  	width:24, 
	  	height:24,
	  },
	  iconMenuProfileAccountProvider:{
	  	width:24, 
	  	height:24, 
	  	tintColor:'#0086C3',
	  },
	  onboardingSuccessheadText : {
	    fontFamily:'Rubik-Light',
	    textAlign: 'center',
	    color:'#FFFFFF',
	    fontSize:30,
	    marginTop:24,
	  },
	  listHeadText : {
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  listHeadTextProviderPatientSelected : {
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:31,
	    marginHorizontal: 28,
	  },
	  listHeadTextProvider_shaded : {
	    textAlign: 'left',
	    color:'#0086C3',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  listHeadTextProvider_shaded1 : {
	    textAlign: 'left',
	    color:'#29B6F6',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  listHeadTextProvider_shaded_link1 : {
	    textAlign: 'left',
	    color:'#29B6F6',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  imageInfoUpdatedPatient : {
	  	width:80, 
	  	height:80, 
	  	marginHorizontal:20, 
	  	marginTop:17,
	  },
	  imageInfoUpdatedProvider : {
	  	width:80, 
	  	height:80, 
	  	marginHorizontal:20, 
	  	marginTop:72, 
	  	tintColor:'#0086C3',
	  },
	  insuranceHeadTagText : { 
	  	fontFamily:'Rubik-Regular',
      	fontWeight:'300',
      	textAlign: 'left',
      	color:'#00A896',
      	fontSize:16,
      },
	  listFaceText : {
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:30,
	    marginHorizontal: 28,
	  },
	  logoImg : {
	  	width:'70%',
	  	height: 80,
	  	marginTop: 114
	  },
	  welcomeFooterImg:{
	  	//width:420,
	  	//height: 250,
	  	width:380,
	  	height: 200,
	  	marginTop:50
	  },
	  loginFooterImg:{
	  	//width:390,
	  	//height: 230,
	  	width:380,
	  	height: 200,
	  	marginTop:0
	  },
	  chooseRoleFooterImg:{
	  	width:"100%",
	  	height: "100%"
	  },
	  eyeClosedImg: {
	  	width:24,
	  	height:24,
	  	padding:10
	  },
	  eyeClosedImg_provider: {
	  	width:24,
	  	height:24,
	  	padding:10,
	  	tintColor: '#0086C3'
	  },
	  logoText : {
	    marginVertical: 15,
	    fontSize:25,
	    marginTop:26,
	    // fontWeight:300,
	    color:'#0086C3',
	    //fontFamily:'Rubik',
	    // fontFamily:'Rubik-Regular',
	    fontFamily:'Rubik-Light',
	    alignItems: 'center',
	    justifyContent: 'center'
	  },
	  logoWelcomeText : {
	    marginVertical: 0,
	    fontSize:34,
	    // fontWeight:300,
	    color:'#0086C3',
	    //fontFamily:'Rubik',
	    fontFamily:'Rubik-Regular',
	    justifyContent: 'center'
	  },
	  ChosseText : {
	    marginTop: 60,
	    marginVertical: 5,
	    // fontFamily:'Rubik-Regular',
	    fontFamily:'Rubik-Light',
	    fontSize:30,
	    color:'#1B1E29'
	  },
	  chosseSelectText : {
	    marginVertical: 0,
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    textAlign: 'center',
	    alignItems:'center',
	    marginTop:8,
	    color:'#1B1E29'
	  },
	  labelTitleText: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:16,
	    marginTop:0,
	    marginHorizontal: 0,
	  },
	  labelText: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:14,
	    marginTop:16,
	    marginHorizontal: 28,
	    textTransform: 'uppercase'
	  }, 
	  labelText1: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28,
	    textTransform: 'none'
	  },
	  labelText2: {
	    fontFamily:'Rubik-Regular', 
	    textAlign: 'left', 
	    color:'#1B1E29', 
	    fontSize:14, 
	    textTransform: 'uppercase'
	  },
	  skipLabelText: {
	    color: '#C5C5C5',
	    marginTop: 10,
	    marginRight:15,
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    fontWeight:'300',
	    // color:'#1B1E29'
	  },
	  labelTextPassword: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:14,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  labelTextConfirmPassword: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:14,
	    marginTop:16,
	    marginHorizontal:28
	  },
	  inputLayout: {
	  	height:48,
	    marginHorizontal: 28,
	    marginTop:2,
	    backgroundColor: "#FFFFFF",
	    color:'#1B1E29',
	    fontSize:16,
	    fontFamily:'Rubik-Regular',
	    borderColor: '#FFFFFF', 
	    borderWidth: 1,
	    borderBottomWidth :1,
    	borderBottomColor: '#000',
	    // alignItems:'center',
	    justifyContent: 'center',
	  },
	  insuranceDateContainer: {
	  	flexDirection:'row',
	  },
	  timePrefOptionsContainer: {
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between', 
	  	alignItems: 'center', 
	  	marginTop: 16, 
	  	marginHorizontal:28,
	  },
	  timePrefOptions2Container: {
	  	flexDirection: 'row', 
	  	marginTop: 16, 
	  	marginHorizontal:28,
	  },
	  timePrefSpinnerGroupContainer: {
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between',
	  	marginHorizontal:28,
	  },
	  timePrefSpinnerContainer: {
	  	width:160, 
	  	height:48, 
	  	marginHorizontal: 0, 
	  	marginTop:2, 
	  	backgroundColor: "#FFFFFF", 
	  	color:'#1B1E29', 
	  	fontSize:16, 
	  	fontFamily:'Rubik-Regular', 
	  	borderColor: '#FFFFFF',  
	  	borderWidth: 1, 
	  	borderBottomWidth :1, 
	  	borderBottomColor: '#000', 
	  	justifyContent: 'center',
	  },
	  timePrefWeekDaysButton: {
	  	borderRadius: 30, 
	  	backgroundColor: '#0086C3', 
	  	alignItems:'center', 
	  	justifyContent :'center',
	  },
	  timePrefWeekDaysText: {
	  	color:'#FFFFFF', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14, 
	  	paddingLeft:16, 
	  	paddingRight:16, 
	  	paddingTop:6, 
	  	paddingBottom:6,
	  }, 
	  timePrefWeekOffButton: {
	  	borderRadius: 30, 
	  	borderColor: '#0086C3', 
	  	borderWidth: 1, 
	  	alignItems:'center', 
	  	justifyContent :'center',
	  },
	  timePrefWeekOffText: {
	  	color:'#C5C5C5', 
	  	fontFamily:'Rubik-Regular', 
	  	fontSize:14, 
	  	paddingLeft:16, 
	  	paddingRight:16, 
	  	paddingTop:6, 
	  	paddingBottom:6
	  },
	  timePrefSpinnerTitleText: {
	  	fontFamily:'Rubik-Regular', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:14, 
	  	marginTop:16, 
	  	marginHorizontal: 0, 
	  	textTransform: 'uppercase',
	  },
	  patientHomeAddrStateContainer: {
	  	flexDirection:'row',
	  	marginLeft:24,
	  },
	  insuranceDateinputLayout: {
	  	width:150,
	  	height:48,
	    marginHorizontal: 28,
	    marginTop:2,
	    backgroundColor: "#FFFFFF",
	    color:'#1B1E29',
	    fontSize:16,
	    fontFamily:'Rubik-Regular',
	    borderColor: '#FFFFFF', 
	    borderWidth: 1,
	    borderBottomWidth :1,
    	borderBottomColor: '#000',
	    // alignItems:'center',
	    justifyContent: 'center',
	  },
	  payInputExpDateinputLayout: {
	  	width:77,
	  	height:48,
	    marginLeft:28,
	    marginTop:2,
	    backgroundColor: "#FFFFFF",
	    color:'#1B1E29',
	    fontSize:16,
	    fontFamily:'Rubik-Regular',
	    borderColor: '#FFFFFF', 
	    borderWidth: 1,
	    borderBottomWidth :1,
    	borderBottomColor: '#000',
	    // alignItems:'center',
	    justifyContent: 'center',
	  },
	  payInputCvvInputLayout: {
	  	width:77,
	  	height:48,
	    marginHorizontal: 24,
	    marginLeft:2,
	    marginTop:2,
	    backgroundColor: "#FFFFFF",
	    color:'#1B1E29',
	    fontSize:16,
	    fontFamily:'Rubik-Regular',
	    borderColor: '#FFFFFF', 
	    borderWidth: 1,
	    borderBottomWidth :1,
    	borderBottomColor: '#000',
	    // alignItems:'center',
	    justifyContent: 'center',
	  },
	  insuranceDateMarginLayout: {
		marginHorizontal: -23
	  },
	  patientHomeAddrZipLayout: {
		marginHorizontal: -23,
		marginLeft:2,
	  },
	  phoneinputLayout: {
	  	width:"85%",
	  	height:48,
	    color:'#1B1E29',
	    fontSize:16,
	    fontFamily:'Rubik-Regular',
	  },
	  inputLayoutPassword: {
	    // marginHorizontal: 28,
	    // marginVertical:10,
	    // backgroundColor: "#FFFFFF",
	    color:'#1B1E29',
	    // borderColor: '#FFFFFF', 
	    // borderWidth: 1,
	    width:"90%",
	    // underlineColorAndroid :'transparent',
     //    placeholderTextColor:"#EAEAEA",
     //    autoCapitalize:"none"
	  },
	  inputLayoutDateMask: {
	  	color:'#1B1E29',
	  	width:"90%",
	  	marginLeft:-35
	  },
	  inputLayoutPaymentInput: {
	  	marginHorizontal: 28,
    	color:'black',
	  },
	  inputLayoutContainer: {
	    color:'black',
	  },
	  titleText: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:16,
	    marginHorizontal: 28
	  },
	  titleTextScanner: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28
	  },
	  titleText1: {
	    fontFamily:'Rubik-Regular',
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontSize:16,
	    marginHorizontal: 28
	  },
	  successTitleText: {
	    fontFamily:'Rubik-Light',
	    textAlign: 'left',
	    color:'#FAFAFA',
	    fontSize:16,
	    marginHorizontal: 28,
	    marginTop:24,
	  },
	  titleUnorderText: {
	    textAlign: 'left',
	    color:'#1B1E29',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	  },
	  patientInsuIntroCardTitle:{
	  	width:"80%",
	  	// flexShrink: 1,
		fontFamily:'Rubik-Regular', 
		fontWeight: 'bold', 
		// fontStyle:'bold', 
		textAlign: 'left', 
		color:'#1B1E29', 
		fontSize:16, 
		marginTop:0, 
		marginHorizontal:-30
	  },
	  patientInsuIntroCardSubTitle:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300', 
	  	textAlign: 'right', 
	  	color:'#00A896', 
	  	fontSize:16, 
	  	marginTop:0, 
	  	marginHorizontal:100,
	  },
	  patientInsuIntroCardSubHead:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight: 'bold', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	textTransform: 'uppercase', 
	  	fontSize:12,
	  	marginTop:0, 
	  	marginHorizontal:-16
	  },
	  patientInsuIntroCardData:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300',
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:14, 
	  	marginTop:0, 
	  	marginHorizontal:-16
	  },
	  patientInsuIntroCardAddIns:{
		fontFamily:'Rubik-Regular', 
		fontWeight:'300', 
		textAlign: 'right', 
		color:'#00A896', 
		fontSize:16, 
		marginTop:0, 
		marginHorizontal:5
	  },
	  providerFacilityAddText:{
		fontFamily:'Rubik-Regular', 
		fontWeight:'300', 
		textAlign: 'right', 
		color:'#0086C3', 
		fontSize:16, 
		marginTop:0, 
		marginHorizontal:5
	  },
	  patientSubcriptionCardTitle:{
	  	//width:231, 
	  	width:201, 
	  	height:19, 
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight: 'bold', 
	  	// fontStyle:'bold', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:16, 
	  	marginTop:0, 
	  	marginHorizontal:-30
	  },
	  patientSubcriptionCardSubTitle:{
	  	//width:101,
	  	width:91, 
	  	height:19, 
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300', 
	  	textAlign: 'right', 
	  	color:'#1B1E29', 
	  	fontSize:16, 
	  	marginTop:0
	  },
	  patientSubcriptionCardSubTitleMin:{
	  	//width:101, 
	  	width:50, 
	  	height:19, 
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300', 
	  	textAlign: 'right', 
	  	color:'#0086C3', 
	  	fontSize:16, 
	  	marginTop:0
	  },
	  patientSubcriptionCardHeading:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight: 'bold', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	textTransform: 'uppercase', 
	  	fontSize:12, 
	  	marginTop:0, 
	  	marginHorizontal:-16
	  },
	  patientSubcriptionCardData:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:14, 
	  	marginTop:0, 
	  	marginHorizontal:-16
	  },
	  patientSubcriptionCardDataNote:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300', 
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:12, 
	  	marginTop:0, 
	  	marginHorizontal:-16
	  },
	  unorderList: {
	  	marginHorizontal: 34
	  },
	  titlefaceidText: {
	    textAlign: 'center',
	    color:'#00A896',
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    marginTop:10,
	    marginHorizontal: 28,
	    marginVertical:10,
	    padding:12,
	    backgroundColor: "#FFFFFF",
	    borderColor: '#FFFFFF', 
	    borderWidth: 1
	  },
	  titlefaceidText_provider: {
	    textAlign: 'center',
	    color:'#29B6F6',
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    marginTop:10,
	    marginHorizontal: 28,
	    marginVertical:10,
	    padding:12,
	    backgroundColor: "#FFFFFF",
	    borderColor: '#FFFFFF', 
	    borderWidth: 1
	  },
	  titleVryPhoneText: {
	    textAlign: 'left',
	    color:'black',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  iagreeText: {
	    fontFamily:'Rubik-Regular',
	    color:'#1B1E29',
	    fontSize:14,
	    marginTop:0,
	  },
	  labelEmailText: {
	    textAlign: 'left',
	    color:'black',
	    fontFamily:'Rubik-Regular',
	    fontSize:12,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  labelPasswordText: {
	    textAlign: 'left',
	    color:'black',
	    fontFamily:'Rubik-Regular',
	    fontSize:12,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  textInput: {
	    fontSize: 16,
	    height: 20,
	    color:'black',
	  },
	  titleColorSmall: {
	    color:'#0086C3',
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    marginHorizontal: 0
	  },
	  titleColorSmall_provider: {
	    color:'#0086C3',
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    marginHorizontal: 0
	  },
	  titleColorSmallScanner: {
	    color:'#0086C3',
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    marginTop:16,
	    marginHorizontal: 0
	  },
	  titleColorSmallScan: {
	    textAlign: 'left',
	    color:'#0086C3',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginHorizontal: 28,
	  },
	  titleColorSmallPayInput: {
	    textAlign: 'left',
	    color:'#0086C3',
	    fontFamily:'Rubik-Regular',
	    fontSize:16,
	    marginTop:16,
	    marginHorizontal: 28,
	  },
	  rememberText: {
	    color:'black',
	    fontFamily:'Rubik-Regular',
	    fontSize:12,
	    marginTop:0,
	  },
	  loginHeadText : {
	    textAlign: 'left',
	    color:'black',
	    // fontFamily:'Rubik-Regular',
	    fontFamily:'Rubik-Light',
	    fontSize:30,
	    marginTop:50,
	    marginHorizontal: 28,
	  },
	  loginProfileText : {
	    textAlign: 'left',
	    color:'black',
	    // fontFamily:'Rubik-Regular',
	    fontFamily:'Rubik-Light',
	    fontSize:25,
	    marginTop:20,
	    marginHorizontal: 28,
	  },
	  loginNotAccountText : {
	  	//fontFamily:'Rubik',
	  	fontFamily:'Rubik-Regular',
	  	color:'#1B1E29',
	  	fontSize:16
	  },
	  patientProfileUploadText : {
	  	//fontFamily:'Rubik',
	  	fontFamily:'Rubik-Regular',
	  	color:'#1B1E29',
	  	fontSize:16,
	  	marginHorizontal:7,
	  },
	  patientProfileUploadTextLink : {
	  	//fontFamily:'Rubik',
	  	color:'#0086C3',
	    fontFamily:'Rubik-Regular',
	  	fontSize:16,
	  	marginHorizontal:7,
	  },
	  loginSignUpText : {
	  	fontFamily:'Rubik-Regular',
	  	color:'#0086C3',
	  	fontSize:16,
	  	marginHorizontal:1
	  },
	  labelEmailText: {
	    textAlign: 'left',
	    color:'black',
	    fontFamily:'Rubik-Regular',
	    fontSize:12,
	    marginTop:40,
	    marginHorizontal: 28,
	  },
	  labelPasswordText: {
	    textAlign: 'left',
	    color:'black',
	    fontFamily:'Rubik-Regular',
	    fontSize:12,
	    marginTop:10,
	    marginHorizontal: 28,
	  },
	  button: {
	    backgroundColor:'#0086C3',
	    marginTop:19.5,
	    paddingVertical: 13,
	    marginHorizontal: 28,
	  },
	  button_provider: {
	    backgroundColor:'#0086C3',
	    marginTop:19.5,
	    paddingVertical: 13,
	    marginHorizontal: 28,
	  },
	  buttonProviderPatientSelected: {
	  	width:328, height:40, backgroundColor:'#0086C3', marginTop:0, marginHorizontal: 24, paddingVertical:11.5, paddingHorizontal:7.5,
	  },
	  container_button_bottom_provider: {
	    marginTop: 'auto', 
	    marginBottom:32,
	  },
	  containerHeaderBackAiTalk:{
	  	flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop:30, justifyContent: 'space-between',
	  },
	  containerArrowBackAiTalk:{
	  	flexDirection: 'row', alignItems: 'center',
	  },
	  textArrowBackAiTalk:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:16, marginHorizontal:12,
	  },
	  containerBackSubMenuAiTalk:{
	  	height:25, borderRadius: 30, borderColor: '#0086C3', borderWidth: 1,  alignItems:'center', justifyContent :'center', paddingLeft:12, paddingRight:12,
	  },
	  textBackSubMenuAiTalk:{
	  	color:'#00A896', fontFamily:'Rubik-Regular', fontSize:12,
	  },
	  containerBotChatType1AiTalk:{
	  	backgroundColor:'#FFFFFF', width: 216, paddingTop:7, paddingBottom:7, marginTop: 14, marginHorizontal: 80, borderBottomLeftRadius:0, borderBottomRightRadius:5, borderTopLeftRadius:5, borderTopRightRadius:5, elevation: 0, justifyContent: 'center',
	  },
	  containerBotChatType2AiTalk:{
	  	backgroundColor:'#FFFFFF', width: 216, paddingTop:7, paddingBottom:7, marginTop: 0, marginLeft:16, borderBottomLeftRadius:0, borderBottomRightRadius:5, borderTopLeftRadius:5, borderTopRightRadius:5, elevation: 0, justifyContent: 'center',
	  },
	  containerBotIconType1AiTalk:{
	  	flexDirection: 'row', alignItems: 'center', marginTop: 15, marginHorizontal: 24,
	  },
	  imageBotIconType1AiTalk:{
	  	width:40, height:40,
	  },
	  textChatTypeAiTalk:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#1B1E29', fontSize:14, marginTop:0, marginHorizontal:8,
	  },
	  textChatTimeAiTalk:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#C5C5C5', fontSize:11, marginTop:15, marginHorizontal:8,
	  },
	  frameContainerUserChatType2AiTalk:{
	  	flexDirection: 'row', alignItems: 'center', marginTop: 15, marginLeft:80,
	  },
	  containerUserChatType2AiTalk:{
	  	backgroundColor:'#0086C3', width: 216, paddingTop:7, paddingBottom:7, marginTop: 0,  borderBottomLeftRadius:5, borderBottomRightRadius:0, borderTopLeftRadius:5, borderTopRightRadius:5, elevation: 0, justifyContent: 'center',
	  },
	  containerTabOptionAiTalk:{
	  	borderRadius: 30, backgroundColor: '#F9DC77', alignItems:'center', justifyContent :'center'
	  },
	  textTabOptionAiTalk:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:14, paddingLeft:15, paddingRight:15, paddingTop:7, paddingBottom:7
	  },
	  containerBottomNavigationAiTalk:{
	  	backgroundColor: '#FAFAFA', height: 100, marginTop: 'auto', borderTopWidth :1, borderTopColor: '#E5E5E5',
	  },
	  containerBottomNavigationMenuAiTalk:{
	  	flexDirection: 'row', alignItems:'center', marginHorizontal: 16, marginTop:8,
	  },
	  containerBottomNavigationChatBoxAiTalk:{
	  	backgroundColor:'#FFFFFF', width: 247, height: 40, marginTop: 0, marginHorizontal: 8, borderRadius: 5, elevation: 0, justifyContent: 'center',
	  },
	  containerHeaderBackDocLoad:{
	  	flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop:30,
	  },
	  textHeaderBackDocLoad:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:16, marginTop:10, marginHorizontal:18,
	  },
	  textHeaderTitleDocLoad:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:14, marginTop:20, marginHorizontal:28,
	  },
	  containerSubHeaderLoadingDocLoad:{
	  	flexDirection: 'row', alignItems: 'center', marginHorizontal: 28, marginTop:20,
	  },
	  imageSubHeaderLoadingDocLoad:{
	  	width:20, height:20,
	  },
	  textSubHeaderLoadingDocLoad:{
	  	color:'#1B1E29', fontFamily:'Rubik-Regular', fontSize:11, marginTop:0, marginHorizontal:18,
	  },
	  containerCardLoadingDocLoad:{
	  	flexDirection: 'row',
	  },
	  iconCardLoadingDocLoad:{
	  	width:48, height:48, backgroundColor: '#EAEAEA', borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
	  },
	  containerCardInfoLoadingDocLoad:{
	  	width:260, height:56,
	  },
	  textTitle1CardInfoLoadingDocLoad:{
	  	height:19, marginHorizontal:8, marginTop:2, backgroundColor: '#EAEAEA',
	  },
	  cotainerTitle2CardInfoLoadingDocLoad:{
	  	marginHorizontal:8, marginTop:8,
	  },
	  textTitle2CardInfoLoadingDocLoad:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#EAEAEA', fontSize:12,
	  },
	  textTitle3CardInfoLoadingDocLoad:{
	  	height:17, backgroundColor: '#EAEAEA',
	  },
	  containerTitle1CardInfoDocDefault:{
	  	height:19, marginHorizontal:8, marginTop:2, flexDirection: 'row', justifyContent: 'space-between',
	  },
	  textTitle1CardInfoDocDefault:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#1B1E29', fontSize:16,
	  },
	  textSubTitle1CardInfoDocDefault:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#00A896', fontSize:14,
	  },
	  textTitle2CardInfoDocDefault:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#1B1E29', fontSize:14, marginTop:0, marginHorizontal:0, textTransform: 'uppercase',
	  },
	  containerTitle3CardInfoDocDefault:{
	  	height:17, marginHorizontal:16, marginTop:0, flexDirection: 'row', justifyContent: 'space-between',
	  },
	  textTitle3CardInfoDocDefault:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#1B1E29', fontSize:11,
	  },
	  dividerlineTitle3CardInfoDocDefault:{
	  	width:1, backgroundColor:'#00A896',
	  },
	  containerSubTitle4CardInfoDocDefault:{
	  	height:17, flexDirection: 'row', 
	  },
	  textSubTitle4CardInfoDocDefault:{
	  	fontFamily:'Rubik-Light', fontWeight:'300', textAlign: 'left', color:'#1B1E29', fontSize:11, marginTop:2, marginHorizontal:5,
	  },
	  iconDolorSubTitle4CardInfoDocDefault:{
	  	width:16, height:16, marginHorizontal:2,
	  },
	  cotainerCardDocExperience:{
	  	backgroundColor:'#FFFFFF', 
	  	// height: 106, 
	  	marginTop: 16, 
	  	marginHorizontal: 28, 
	  	borderRadius: 5, 
	  	elevation: 3,
	  },
	  cotainerDataDocExperience:{
	  	flexDirection: 'row', 
	  	justifyContent: 'space-between', 
	  	// marginTop:16, 
	  	// marginHorizontal:16,
	  },
	  cotainerHeadDocExperience:{
	  	flexDirection:'row', 
	  	justifyContent: 'center',
	  },
	  cotainerSubHeadDocExperience:{
	  	marginTop:8, 
	  	// marginHorizontal:16,
	  },
	  textHeadTitleDocExperience:{
	  	fontFamily:'Rubik-Regular', fontWeight:'300', textAlign: 'left', color:'#00A896', fontSize:11,
	  },
	  iconHeadDocExperience:{
	  	width:32, 
	  	height:32, 
	  	backgroundColor: '#C5C5C5', 
	  	borderRadius: 30,
	  },
	  textHead1DocExperience:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight: 'bold', 
	  	textAlign: 'left',  
	  	color:'#1B1E29',  
	  	fontSize:16,
	  	marginTop:3,
	  },
	  textHead2DocExperience:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300', 
	  	textAlign: 'right', 
	  	color:'#29B6F6', 
	  	fontSize:16, 
	  	marginTop:3,
	  },
	  textHead1ConfirmInfo:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight: 'bold', 
	  	textAlign: 'left',  
	  	color:'#1B1E29',  
	  	fontSize:16,
	  },
	  textHead2LevelParticipation:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight: 'bold', 
	  	textAlign: 'left',  
	  	color:'#1B1E29',  
	  	fontSize:12,
	  	marginTop:3,
	  },
	  textHead2DocConfirmInfo:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300', 
	  	textAlign: 'right', 
	  	color:'#29B6F6', 
	  	fontSize:16,
	  },
	  buttonDocConfirmInfo:{
	  	backgroundColor:'#0086C3', 
	  	height:40, 
	  	paddingLeft:105, 
	  	paddingTop:12, 
	  	paddingRight:105, 
	  	paddingBottom:12, 
	  	justifyContent: 'center',
	  },
	  radioContainerDocLevelPart:{
	  	flexDirection: 'row', 
	  	justifyContent: 'center', 
	  	alignItems: 'center',
	  },
	  textSubHeadDocExperience:{
	  	fontFamily:'Rubik-Regular', 
	  	fontWeight:'300',
	  	textAlign: 'left', 
	  	color:'#1B1E29', 
	  	fontSize:14,
	  },
	  button1: {
	  	width:120,
	  	height:32,
	  	marginLeft:-176,
	    backgroundColor:'#0086C3',
	    marginTop:8,
	    paddingVertical: 13,
	    marginHorizontal: 0,
	    justifyContent: 'center',
	  },

	  buttonScanner1: {
	  	width:120,
	  	height:32,
	  	marginLeft:-176,
	    backgroundColor:'#E5E5E5',
	    marginTop:8,
	    paddingVertical: 13,
	    marginHorizontal: 0,
	    justifyContent: 'center',
	  },
	  
	  buttonScanner: {
	    backgroundColor:'#E5E5E5',
	    marginTop:19.5,
	    paddingVertical: 13,
	    marginHorizontal: 28,
	  },
	  buttonText: {
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    fontWeight:'300',
	    color:'#FAFAFA',
	    textAlign:'center'
	  },
	  buttonText_provider: {
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    fontWeight:'300',
	    color:'#FFFFFF',
	    textAlign:'center'
	  },
	  buttonCurbSubProvider: {
	    width:120, 
	    height:32, 
	    backgroundColor:'#0086C3', 
	    marginTop: 8,
	    justifyContent: 'center',
	  },
	  buttonText1: {
	    fontFamily:'Rubik-Regular',
	    fontSize:14,
	    fontWeight:'300',
	    color:'#FAFAFA',
	    textAlign:'center'
	  },
	  welcomeButton: {
	    width:130,
	    backgroundColor:'#0086C3',
	    marginVertical: 10,
	    paddingVertical: 13,
	    marginTop:0
	  },
	  welcomeButtonText: {
	    fontSize:16,
	    fontWeight:'400',
	    color:'#FAFAFA',
	    textAlign:'center',
	    fontFamily:'Rubik-Regular',
	  },
	  enableButton: {
	    backgroundColor:'#0086C3',
	    marginVertical: 15,
	    paddingVertical: 13,
	    marginHorizontal: 28,
	    marginTop: 30,
	  },
	  enableButton_provider: {
	    backgroundColor:'#0086C3',
	    marginVertical: 15,
	    paddingVertical: 13,
	    marginHorizontal: 28,
	    marginTop: 30,
	  },
	  onBoardingSuccessButton: {
	  	width:312,
	  	height:40,
	    backgroundColor:'#FFFFFF',
	    marginTop:24,
	    paddingVertical: 13,
	    marginHorizontal: 28,
	    alignItems: 'center',
	    justifyContent: 'center',
	  },
	  onBoardingSuccessButtonText: {
	    fontSize:14,
	    fontFamily:'Rubik-Regular',
	    fontWeight:'500',
	    color:'#FAFAFA',
	    textAlign:'center',
	    // alignItems: 'center',
	    // justifyContent: 'center',
	  },
	  onBoardingSuccessButtonText_provider: {
	    fontSize:14,
	    fontFamily:'Rubik-Regular',
	    fontWeight:'500',
	    color:'#0086C3',
	    textAlign:'center',
	    // alignItems: 'center',
	    // justifyContent: 'center',
	  },
	  roundedTextInput: {
	  	width:50,
	  	height:80,
	  	fontSize:30,
	  	fontFamily:'Rubik-Regular',
    	borderRadius: 10,
    	backgroundColor: "#FFFFFF",
	    borderColor: '#FFFFFF', 
	    borderWidth: 1
  	  },
  	  roleChooseImg:{
  	  	width: 95,
  	  	height: 95,
  	  	marginTop: 15,
  	  	resizeMode: 'stretch',
  	  },
  	  faceIdImg: {
  	  	width:80,
  	  	height: 80,
  	  	marginTop: 30,
  	  },
  	  faceIdImg_provider: {
  	  	width:80,
  	  	height: 80,
  	  	marginTop: 30,
  	  	tintColor:'#0086C3',
  	  },
  	  touchIdImg: {
  	  	width:80,
  	  	height: 80,
  	  	marginTop: 30
  	  },
  	  loginSignInArrowImg : {
	  	width:18,
	  	height: 8,
	  	marginTop: 0,
	  	tintColor: "#0086C3",
	  },
	  leftArrow1: {
	  	width:24,
	  	height:24,
	  	marginTop:-3
	  },
	  arrowLeftImg: {
	  	width:35,
	  	height: 15,
	  	marginTop: 10
	  },
	  infoImg: {
	  	height:18, 
	  	width:18, 
	  	marginTop:0, 
	  	marginHorizontal:7,
	  },
	  successLogoImg: {
	  	width:116,
	  	height: 116
	  },
	  onboardingImg: {
	  	width:340,
	  	height: 368,
	  	marginTop: 20
	  },
	  insuranceDefaultImg: {
	  	width:330,
	  	height: 220,
	  	marginTop: 16,
	  	marginHorizontal: 28,
	  	padding:0,
	  	// justifyContent: 'center'
	  },
	  scannerDefaultImg: {
	  	width:335,
	  	height: 215,
	  	marginTop: 16,
	  	marginHorizontal: 28,
	  	padding:0,
	  },
	  paymentDefaultImg: {
	  	width:335,
	  	height: 210,
	  	marginTop: 10,
	  	marginHorizontal: 28,
	  	marginRight: 0,
	  	borderRadius: 10,
	    elevation: 0,
	  },
	  pharmacyDefaultImg: {
	  	width:335,
	  	height: 205,
	  	marginTop: 16,
	  	marginHorizontal: 28,
	  	padding:0,
	  	// justifyContent: 'center'
	  },
	  selectProfileImg: {
	  	width:335,
	  	height:198,
	  	marginTop: 16,
	  	marginHorizontal: 28,
	  	padding:0,
	  },
	 
});