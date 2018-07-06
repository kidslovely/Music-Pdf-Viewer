import React, { Component } from "react";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text
} from "native-base";

import { Image, View, StyleSheet,WebView,Dimensions,Platform, Alert,ScrollView,ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '../screens/VideoPlayerRJC';

import { SQLite, FileSystem, Video } from 'expo';

import Globals from './Global';

// const db = SQLite.openDatabase('music3.db');

class onPlay extends Component {
  static navigationOptions = {
    title: "onLine Paly"
  };
constructor(props) {
    super(props);

    this.state = {
      playing: false,
      playexit:false,
      listcolor:"#FFFFFF",
       visible: false,
      dtext: "Download",
      online: this.props.navigation.state.params.online,   
      progressflag : false,
      downloaded_flag : false
    };
  } 
  update(id , title,filepath) {
    Globals.db_music.transaction(
      tx => {
        tx.executeSql('update discoures set flag = 1, filepath = ? where id = ?;',[filepath,id]);},
        null,
        null);
  }
  delete(id)
  {
    Globals.db_music.transaction(
      tx => {
        tx.executeSql('update discoures set flag = 0, where id = ?;',[id]);},
        null,
        null);
        
        this.setState( {downloaded_flag : false});   
     

  }
    async download (id, title,url) {
        // check if field was null
        this.setState({progressflag: true});
        if (url) {
          try {
           
             var filename  = url.substring(url.lastIndexOf('/') + 1);
            
             var filepath = FileSystem.documentDirectory +'/' + filename; 

             FileSystem.downloadAsync( url,
             FileSystem.documentDirectory +'/' + filename
            ).then(({ uri }) => {
               this.update(id, title, filepath);     
               console.log('Finished downloading to ', uri);
               alert("success");
               this.setState({progressflag: false});
               this.setState( {downloaded_flag : true});   
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

  onLine() {
        this.setState({      
          online: !this.state.online

        });
       
        Globals.online  = this.state.online ;
        console.log("online test     " + this.state.online );
      }

  render() {

    var { navigate } = this.props.navigation;
    
    
    var m_id = this.props.navigation.state.params.id;
    var m_title = this.props.navigation.state.params.title;
    var m_url = this.props.navigation.state.params.url;

    const COLOR = '#92DCE5';
    const icon = (name, size = 36) => () => (
      <Ionicons
        name={name}
        size={size}
        color={COLOR}
        style={{ textAlign: 'center' }}
      />);  
    return (
      <Container style={{backgroundColor:'#0909F0'}}>
        <Content>       
        <View style={{
            flex: 2,
            flexDirection: "row",
            marginLeft:90,
            marginTop:20
         }}>
        <Icon type="Ionicons" name="md-musical-notes" style={{ color: 'white', marginLeft: 10, marginRight: 10 }}/>
        <Text style={{ color: 'white' }}>{this.props.navigation.state.params.title}</Text>     
        </View>
        <View>
            <VideoPlayer
                videoProps={{
                  shouldPlay: true,
                  resizeMode: Video.RESIZE_MODE_CONTAIN,
                  source: {
                    uri: m_url
                  },
                  isMuted: false,
                }}
                playIcon={icon('ios-play-outline')}
                pauseIcon={icon('ios-pause-outline')}
                trackImage={require('../assets/track.png')}
                thumbImage={require('../assets/thumb.png')}
                textStyle={{
                color: COLOR,
                fontSize: 12,
              }}
            />
         </View>     

        {/* <View style={{marginLeft:90, marginTop:30}}> */}
        <View style={{flexDirection : "column" , marginTop:10}}>
        {(this.state.progressflag === true) &&(  <View style = {styles.bottomcenter}>
                 <ActivityIndicator  size="large" color="#00ff00" />
              </View>)
             }
            <View style={{marginLeft:90, marginTop:30}}>
              <Image
                style={{width:200, height:200}}
                source ={require('../assets/images/home.jpg')}
              />
              </View>


        </View>
        <View style={{marginLeft:100, marginTop:30, flex: 1,
            flexDirection: "row"}}>
            <Text style={{color: 'white'}}>Play Type: Streaming</Text>       
        </View>
        <View style={{marginLeft:100, marginTop:30, flex: 1,
            flexDirection: "row"}}>

          {(!this.state.downloaded_flag) &&(<Button transparent onPress = {()=>this.download(m_id, m_title, m_url)}>
              <Icon type="Entypo" name="download"/>
              <Text>download</Text>
            </Button>) 
          }

          {(this.state.downloaded_flag) &&(<Button transparent onPress = {()=>this.delete(m_id)}>
                <Icon type="MaterialIcons" name="delete-forever"/>
                <Text>delete</Text>
          </Button>) }


        </View>
        </Content>    
        <Footer>
          <FooterTab>
          <Button style={{backgroundColor:'#FFFFFF'}}  transparent onPress = {()=>navigate("Home" , {online : this.state.online})}>
              <Icon type="FontAwesome" name="home" />
              <Text>Home</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={() => navigate(this.state.online?"MusicOnline":"MusicOffline", {online: this.state.online})}>
              <Icon type="FontAwesome" name="music" />
              <Text> Discours</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={() => navigate(this.state.online?"BookOnline":"BookOffline", {online: this.state.online})}>
              <Icon type="FontAwesome" name="book" />
              <Text>Book</Text>
            </Button>           
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={this.onLine.bind(this)}>              
              
              {!this.state.online && <Icon style={{color: 'gray'}} type="FontAwesome" name="plug" />}
              {!this.state.online && <Text style={{color: 'gray'}} >offline</Text>}

              {this.state.online && <Icon  type="FontAwesome" name="plug" />}    
              {this.state.online && <Text>online</Text>}      

            </Button>
          </FooterTab>
        </Footer>
      </Container>
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
export default onPlay;
