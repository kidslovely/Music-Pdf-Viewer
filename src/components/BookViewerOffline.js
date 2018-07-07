import React, { Component } from "react";
import {
    Container,
    Contenet,
    Footer,
    // Button,
    FooterTab,
    Icon,
    Text,
    List,
    ListItem,
    Content,
    Left,
    Right,
    Body
} from "native-base"

import Expo, {FileSystem,ImagePicker, SQLite} from 'expo'
import Globals from './Global'


import { Image, SectionList, TouchableOpacity,Button, View, StyleSheet,WebView,Dimensions, Share, Alert,ScrollView,Platform} from "react-native";
import Global from "./Global";

// const db = SQLite.openDatabase('book3.db');

class ActionBarImage extends Component {
 
  delete()
  {
    
    Globals.db_book.transaction(tx => {
           tx.executeSql('update books set flag = 0  where id = ?;',[Globals.share_id]);
        },
        null,
        null
      );
     /////delete file

      Globals.share_navigate.navigate("BookOffline" , {url : Globals.share_filepath});
      
      FileSystem.deleteAsync(Globals.share_filepath, false);
   
  }
 
  ShareDoc()
  {
      Share.share({
        message: 'share my favorite document',
        url: Globals.share_filepath,
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
        
         <Button  title =  "| share  |" color="#841584"  onPress= {()=>this.ShareDoc()}>     </Button>
        
         <Button title = "delete|" color="#841584"  onPress= {()=>this.delete()}/>

        {/* //  <Icon type = "Ionicons" name = "md-musical-notes"/> 

        //  <Icon type = "Ionicons" name = "md-musical-notes"/> 
       */}

      </View>
    
    );
  
  
  }
}


class BookViewerOffline extends React.Component {
  
  static navigationOptions = {
 
    headerRight : < ActionBarImage/>,
    
  };
  state = {
    items: [],
    fullscreen: null,
    

  }
  componentDidMount(){
    
    Globals.db_book.transaction(tx => {
      tx.executeSql(
        'create table if not exists books (id integer primary key not null, title text, url text, filepath text, flag int);'  /////// flag = 0:online flag = 1:offline
      );
    });
}
  fullScreen()
  {
    this.props.navigationOptions = null;
    alert("vgfgs");
  }
  render() {
   
       const {navigation} = this.props;

       const title = navigation.getParam('title','No Title');
       var  url = navigation.getParam('filepath','Wrong URL');
       const id = navigation.getParam('id', 0);
      
       Globals.share_id = id;
       Globals.share_title = title;
       Globals.share_filepath = url;
       Globals.share_navigate =  this.props.navigation;

       if(Platform.OS === 'android')  {url = 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + url}
      // const source = {uri:'http://samples.leanpub.com/thereactnativebook-sample.pdf',cache:true};
      return (
        <View style={styles.container}>
       
          <WebView
          bounces={false}
          scrollEnabled={false} 
          source={{ uri: url}} 
          />
       
          <View  style = {styles.bottom}>
          {/* <Icon type="FontAwesome" name="book" onPress = {()=>this.fullScreen()}/> */}
            {/* <Button rounded info onPress = {() => this.delete(id,url)}>
              <Text>Delete</Text>
            </Button>
            <Button rounded info onPress = {()=>this.ShareDoc(id,title,url)}>
                  <Text> Share </Text>
                </Button> */}
            {/* <Button rounded info onPress = {()=>this.props.navigation.navigate("Directory")}>
              <Text>Test</Text>
            </Button> */}
          </View>
      </View>
  
      );
  }  
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    bottom: {
      flexDirection:'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      bottom: 0,
      right: 0
    }
  });
export default BookViewerOffline;



////////////// reference ///////////////////////////
// update(title,filepath) {
//   db.transaction(
//     tx => {
//       tx.executeSql('update books set flag = 1, filepath = ? where title = ?;',[filepath,title]);},
//       null,
//       null);
// }


//  async downloadFile (title,url) {
//   // check if field was null
//   if (url) {
//     try {
//       //https://bitcoin.org/bitcoin.pdf
//        ///var filename  = url.substring(url.lastIndexOf('/') + 1);
//        var filepath = FileSystem.documentDirectory +'/pdf/' + title + '.pdf'; 
//        FileSystem.downloadAsync( url,
//        FileSystem.documentDirectory +'/pdf/' + title + '.pdf'
//       ).then(({ uri }) => {
//          this.update(title, filepath);     
//          console.log('Finished downloading to ', uri);
//          alert("success");
//       })
//        .catch(error => {
//           console.error(error);
//        });
//     } catch (e) {
//       console.log('Couldn\'t download from the uri: ', e)
//       alert("Unable to download");
//     }

//   }
// }