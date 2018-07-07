import React, { Component } from "react";
import Expo, {FileSystem,ImagePicker, SQLite} from 'expo'
import Globals from './Global'
// import RNFetchBlob from 'react-native-fetch-blob'
// import Pdf from 'react-native-pdf';

import { Image,Text, ActivityIndicator, View, StyleSheet, WebView,TouchableHighlight, Dimensions, Share ,Button, ScrollView,Platform } from "react-native";


// const db = SQLite.openDatabase('book3.db');

class ActionBarImage extends Component {

  state = {
 
    progressflag : false

  }
  update(filepath) {
    Globals.db_book.transaction(
      tx => {
        tx.executeSql('update books set flag = 1, filepath = ? where id = ?;',[filepath,Globals.share_id]);},
        null,
        null);
  }
  async downloadFile () {
   
    // // check if field was null
  
     this.setState({progressflag: true});

    if (Globals.share_url) {
      try {
 
         var filepath = FileSystem.documentDirectory +'/' + Globals.share_title + '.pdf'; 

         FileSystem.downloadAsync( Globals.share_url,
         FileSystem.documentDirectory +'/' + Globals.share_title + '.pdf'
        ).then(({ uri }) => {
           this.update(filepath);     
           console.log('Finished downloading to ', uri);
           alert("success");
           this.setState({progressflag: false});
          
         // Globals.share_navigate.navigate("BookOnline" , {url : filepath});

        })
         .catch(error => {
            console.error(error);
            this.setState({progressflag: false});
         });
      } catch (e) {
        console.log('Couldn\'t download from the uri: ', e)
        alert("Unable to download");
        this.setState({progressflag: false});
      }

    }

  }
  ShareDoc()
  {
      Share.share({
        message: 'share my favorite document',
        url: Globals.share_url,
        title: Globals.share_title
      }, {
        // Android only:
        dialogTitle: 'Share Doc',
        // iOS only:
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      })
    

  }
  render() {

    return (

      <View style={{flexDirection: 'row'}}>
           {/* {(this.state.progressflag === true)  */}
 
           {(this.state.progressflag === true)  && (<ActivityIndicator  size="large" color="#00ff00" />)}
         
         
         <Button title = "| share  |"  color="#841584"  onPress= {()=>this.ShareDoc()}/>
        
         <Button title = "download|" color="#841584"   onPress= {()=>this.downloadFile()}/>

        {/* //  <Icon type = "Ionicons" name = "md-musical-notes"/> 

        //  <Icon type = "Ionicons" name = "md-musical-notes"/> 
       */}

      </View>
    
    );
  
  
  }
}

class BookViewer extends Component {

  static navigationOptions = {
    
    headerRight : < ActionBarImage/>,

  };
  state = {
    items: [],
    progressflag : false

  }
  componentDidMount(){
    Globals.db_book.transaction(tx => {
      tx.executeSql(
        'create table if not exists books (id integer primary key not null, title text, url text, filepath text, flag int);'  /////// flag = 0:online flag = 1:offline
      );
    });
}
_onLongPressButton() {
  Alert.alert('You long-pressed the button!')
}
  render() {
       const {navigation} = this.props;
       const id= navigation.getParam('id','0');
       const title = navigation.getParam('title','No Title');
       var  url = navigation.getParam('url','Wrong URL');

       Globals.share_id = id;
       Globals.share_title = title;
       Globals.share_url = url;

       Globals.share_navigate =  this.props.navigation;

      if(Platform.OS === 'android')  {url = 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + url}
        
     // const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
     // url = "https://storage.googleapis.com/hiddeningredents.blogspot.com/Prapatti/10_Ten_Minute_Series_Anjali_Vaibhavam.m4a";
      return (
        <View style={styles.container}>
       
          <WebView
          bounces={false}
          scrollEnabled={false} 
          source={{ uri: url}} />

      </View>

      );
  }  
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    bottom: {
      flexDirection:'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      bottom: 0,
      right: 0
    },
    bottomcenter: 
    {
      flexDirection:'row',
      justifyContent: 'center',
      alignItems: 'center',
      left : Dimensions.get('window').width  / 2,
      position: 'absolute',
    }
  });
export default BookViewer;
