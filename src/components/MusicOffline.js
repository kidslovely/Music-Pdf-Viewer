import React, { Component } from "react";
import {
    Container,
    Contenet,
    Footer,
    Button,
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

import { Image, SectionList,StyleSheet, TouchableOpacity,View, Alert } from "react-native";

import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '../screens/VideoPlayerRJC';
import { Constants, SQLite ,Video } from 'expo';

import Globals from './Global';

const data = require('../assets/MusicList.json');

// const db = SQLite.openDatabase('music3.db');


class MusicOffline extends Component {
    constructor(props) {
        super(props);
        this.state = {
          online: this.props.navigation.state.params.online,   
          items :  null,
          name : null,
          data :[],
        };
      }
  static navigationOptions = {
    title: "Parts"
  };
  onLine() {
    this.setState({      
      online: !this.state.online
    });
  }

////  to read book list file and insert database 

  render() {
      var {navigate} = this.props.navigation;
      Globals.online  = this.state.online;
        return (
     
        <Container>
            <Content>
              
               <Musics
                   navigation = {navigate}
                   ref={name => (this.name = name)}    />
               </Content>

        <Footer>
          <FooterTab>
          <Button style={{backgroundColor:'#FFFFFF'}}  transparent onPress = {()=>navigate("Home" , {online : this.state.online})}>
              <Icon type="FontAwesome" name="home" />
              <Text>Home</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}}  transparent onPress={() => navigate(this.props.navigation.state.params.online?"MusicOnline":"MusicOffline", {online: this.props.navigation.state.params.online})}>
              <Icon type="FontAwesome" name="music" />
              <Text> Discours</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={() => navigate(this.state.online?"BookOnline":"BookOffline", {online: this.state.online, db : this.state.books_db})}>
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

/////////////////////  database  //////////////
class Musics extends React.Component {
  constructor(props) {
        super(props);
        }
  state = {
    discours: null,
    playing: false,
    playexit: false,
    listcolor:"#FFFFFF",
    songUrl: null,
    m_id : 0,
  };

  componentDidMount() {
    this.update();
  }

  playSound(id, urlPassed) {
    this.setState({
       songUrl: urlPassed,
       listcolor: "#000000",
       playexit:true,
       playing: !this.state.playing,
       m_id: id,
    });
  }
  playExit() {
    this.setState({
      listcolor: "#FFFFFF",
      playexit: false,
      m_id:0,
      playing: false
    });
 }
 async AddFavourite(id)
 {
    await Globals.db_music.transaction(
    tx => {
      tx.executeSql('select * from discoures where id = ?', [id], (_, { rows }) =>
      {
        var len = rows.length;
        console.log("ttttttt  " + len);
      for(i = 0; i < len ; i++)
      {
        var old_fav =  rows.item(i).fav;

        console.log("sssssssss   " + old_fav);
        
        var new_fav = !old_fav;
        
        Globals.db_music.transaction(
          tx => {
            tx.executeSql('update discoures set fav = ?  where id = ?;',[new_fav,id]);
          },
            null,
            null);

       }
       this.update();
            
      })
      null,null
    } );
  }

  async DeleteMusic(id)
  {
    await Globals.db_music.transaction(
      tx => {
        tx.executeSql('update discoures set flag = 0  where id = ?;',[id]);
      },
       null,
       null);
       this.update();
  }
  render() {
  
    const COLOR = '#92DCE5';
    const icon = (name, size = 36) => () => (
      <Ionicons
        name={name}
        size={size}
        color={COLOR}
        style={{ textAlign: 'center' }}
      />);

    const { discours } = this.state;
    if (discours === null || discours.length === 0) {
      return null;
    }
    return (

      <View style={{ margin: 5 }}>

        {discours.map(({ id, title, filepath, fav }) => (
       
        <TouchableOpacity
            style={((id !== this.state.m_id) || (!this.state.playing)) && {flexDirection:'row', height:80, alignItems:'center',  justifyContent: 'flex-end', backgroundColor:'white', borderTopColor:'#ccc', borderTopWidth:1, paddingHorizontal:15}}
            key={id} >
            {/* <Text> {this.state.m_id} </Text>
            <Text> {id} </Text>
            <Text> {this.state.playing} </Text> */}

            { (id === this.state.m_id) && (this.state.playing) &&(
                <View style = {{flexDirection: "row",backgroundColor:"black"}}>
                <VideoPlayer
                  videoProps={{
                      shouldPlay: true,
                      resizeMode: Video.RESIZE_MODE_CONTAIN,
                      source: {
                          uri: filepath,
                      },
                      isMuted: false,
                  }}
                  
                  playIcon={icon('ios-play-outline')}
                  pauseIcon={icon('ios-pause-outline')}
                  
                  title = {title}
              
                  trackImage={require('../assets/track.png')}
                  thumbImage={require('../assets/thumb.png')}
              
                  textStyle={{
                  color: COLOR,
                  fontSize: 12,
                }}
              /> 
             <Button transparent   onPress={this.playExit.bind(this)} style={{ marginTop:2,marginLeft: 0 }} >
                 <Icon type="FontAwesome" name="times"    style={{ color: "#FFFFFF"  , marginLeft: 0 }}/>   
             </Button>


              </View>
             
            )      
            }
          
            { ((id !== this.state.m_id) || (!this.state.playing))  && ( <View style = {{flex : 1, flexDirection : "row"}}>      
                   {<Icon type="Ionicons" name="md-musical-notes" style={{ marginTop:2,marginLeft: 10, marginRight: 10 }}/>}       
                   <Text style = {{marginTop: 10,  marginLeft : 20}}>{title}</Text>      
               
               </View>)
            }
            { ((id !== this.state.m_id) || (!this.state.playing)) && (
                <Button style = {{marginTop: 20 }}
                   transparent
                   onPress={this.playSound.bind(this, id, filepath)} >
                   {<Icon type="FontAwesome" name="play" />}
               
                </Button>
                )}

              {((id !== this.state.m_id) || (!this.state.playing))  && (
                 <Button   style = {{marginTop: 20 }}  transparent  
                 onPress = {this.AddFavourite.bind(this, id)}
                 >
                   {(fav === 0) &&(<Icon type="Ionicons" name="md-star" style = {{color: "gray"}}  />) } 
                   {(fav === 1) &&(<Icon type="Ionicons" name="md-star" style = {{color: "blue"}}  />) } 
                 </Button>
               )}
              { ((id !== this.state.m_id) || (!this.state.playing)) && ( 
                  <Button   style = {{marginTop: 20 }}  transparent
                  onPress = {this.DeleteMusic.bind(this,id)}
                  >
                     <Icon type="Ionicons" name="md-trash" />
               </Button>
              )}

       </TouchableOpacity>
      ))}
      </View>
    );
  }

  update() {
    Globals.db_music.transaction(tx => {
      tx.executeSql(
        `select * from discoures where flag = 1;`,
        [],
        (_, { rows: { _array } }) => this.setState({ discours: _array })
      );
    });
  }
}
export default MusicOffline;


//////////////// reference code ///////////////////////////////////

// import React, { Component } from "react";
// import {
//     Container,
//     Contenet,
//     Footer,
//     Button,
//     FooterTab,
//     Icon,
//     ListItem,
//     Text,
//     Content
// } from "native-base"
// import { Image, SectionList, View } from "react-native";

// import { PartSectionList } from "../assets/PartSectionList";

// import VideoPlayer from '../screens/VideoPlayerRJC';
// import { Ionicons } from '@expo/vector-icons';
// import BaseScreen from '../screens/BaseScreen';
// import { Video } from 'expo';
// import { Slider } from 'react-native-elements';
// import { offSoundSectionList } from "../assets/offSoundSectionList";
// import { addSound} from "../actions";
// // import Video from "react-native-video";
// //import { Video } from 'expo';

// class MusicOffline extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       online: false,     
//     };
//   }
//   static navigationOptions = {
//     title: "Downloaded Discourses"
//   };
//   addSound() {
//     this.props.addSound();
//   }
//   render() {
//       var {navigate} = this.props.navigation;
//     return (
//         //    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> 
//         //    <Image style={{ height: 100, flex: 1 }}  source = {require('../../images/home.jpg')} />
//         //    </View> 
//         <Container>
//          <Content>
//           <SectionList
//             renderItem={({ item, index, section }) => {
//               return (
//                 <SectionListItem
//                   section={section}
//                   item={item}
//                   index={index}
//                   addSound={this.props.addSound}
//                 />
//               );
//             }}
//             sections={offSoundSectionList}
//             keyExtractor={(item, index) => item.title}
//           />
//         </Content>
//         <Footer>
//           <FooterTab>
//           <Button transparent onPress = {()=>navigate("Home")}>
//               <Icon type="FontAwesome" name="home" />
//               <Text>Home</Text>
//             </Button>
//             <Button style={{backgroundColor:'#FFFFFF'}} style={{ width: 80}} transparent>
//               <Icon type="FontAwesome" name="music" />
//               <Text> Discours</Text>
//             </Button>
//             <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={() => navigate(this.props.navigation.state.params.online?"BookOnline":"BookOffline", {online: this.props.navigation.state.params.online})}>
//               <Icon type="FontAwesome" name="book" />
//               <Text>Book</Text>
//             </Button>           
//             <Button style={{backgroundColor:'#FFFFFF'}} transparent>              
              
//               {!this.props.navigation.state.params.online && <Icon style={{color: 'gray'}} type="FontAwesome" name="plug" />}
//               {!this.props.navigation.state.params.online && <Text style={{color: 'gray'}} >offline</Text>}

//               {this.props.navigation.state.params.online && <Icon  type="FontAwesome" name="plug" />}    
//               {this.props.navigation.state.params.online && <Text>online</Text>}

//            </Button>
//           </FooterTab>
//         </Footer>
         
//         </Container>
//     );
//   }  
// }

// class SectionListItem extends Component {
  
//   constructor(props) {
//     super(props);

//     this.state = {
//       playing: false,
//       playexit: false,
//       xxxexit : false,
//       listcolor:"#FFFFFF",
//       songUrl: null
//     };
//   }
// progress(e) {   
//   var cmin=parseInt(parseInt(e.currentTime)/60);
//   var ctext="";
//   var csec=parseInt(parseInt(e.currentTime)-cmin*60);
//   if(cmin<10)
//     {
//       ctext="0"
//     }
//     ctext=ctext+cmin;
//     ctext=ctext+":";
//     if(csec<10)
//     {
//      ctext=ctext+"0"
//     }
//     ctext=ctext+csec;

//   this.setState({     
//       progress: e.currentTime,
//       cTimeText:ctext
//     });
//   }
//   playSound(urlPassed) {
//     this.setState({
//       songUrl: urlPassed,
//        listcolor: "#000000",
//        playexit:!this.state.playexit,
//       playing: !this.state.playing,
//       //xxxexit : this.video.props.state.exit,
//     });
//   }
//   playSound1(urlPassed) {
//     this.setState({
//       songUrl: urlPassed,
//       listcolor: "#0000F0",
//       playing: !this.state.playing,
   
//     });

//   }
//   playExit() {
//     this.setState({
//       listcolor: "#FFFFFF",
//       playexit: false,  ///!this.state.playexit,
//       playing: false
     
//     });
//  }
//  onLoad(params) {
//     var endTime=params.duration;
//     var endmin=parseInt(parseInt(params.duration)/60);
//     var endsec=parseInt(parseInt(params.duration)-endmin*60);
//     var endText="";
//     if(endmin<10)
//     {
//       endText="0"
//     }
//     endText=endText+endmin;
//     endText=endText+":";
//     if(endsec<10)
//     {
//      endText=endText+"0"
//     }
//     endText=endText+endsec;
//     this.setState({ songDuration: params.duration, endTime:endText });
//   }

//   render() {

  
 
//     const COLOR = '#92DCE5';
//     const icon = (name, size = 36) => () => (
//       <Ionicons
//         name={name}
//         size={size}
//         color={COLOR}
//         style={{ textAlign: 'center' }}
//       />);
//       //alert(!this.state.xxxexit);
//       //this.state.xxxexit = video.state.exit;

//       return ( 
     
//       <ListItem style={{backgroundColor:this.state.listcolor}}>
//         {this.state.songUrl  &&  this.state.playexit&& (
//               <VideoPlayer
//                 videoProps={{
//                   shouldPlay: true,
//                   resizeMode: Video.RESIZE_MODE_CONTAIN,
//                   source: {
//                     uri: 'https://storage.googleapis.com/hiddeningredents.blogspot.com/Prapatti/01_Bhagavata_Mahimai_Supremacies_of_Narasimha_avataram.m4a',
//                   },
//                   isMuted: false,
//                 }}
//                 playIcon={icon('ios-play-outline')}
//                 pauseIcon={icon('ios-pause-outline')}
//                 // fullscreenEnterIcon={icon('ios-expand-outline', 28)}
//                 // fullscreenExitIcon={icon('ios-contract-outline', 28)}

//                 ref={exit => (this.name = exit)}

//                 trackImage={require('../assets/track.png')}
//                 thumbImage={require('../assets/thumb.png')}
//                 textStyle={{
//                 color: COLOR,
//                 fontSize: 12,
//               }}
//             />
           
//         )}
//        {this.state.songUrl && this.state.playexit &&
//        (
//           <Button transparent   onPress={this.playExit.bind(this)} >
//             <Icon type="FontAwesome" name="times"    style={{ color: "#FFFFFF" }}/>   
//           </Button>
//         )}
//         <View>
      
//         {!this.state.playexit && <Icon type="Ionicons" name="md-musical-notes" style={{ marginTop:2,marginLeft: 10, marginRight: 10 }}/>}
       
//         <Text key={this.props.index}>{this.props.item.title}</Text>      
//         </View>

//        {!this.state.playexit && (
//         <View
//           style={{
//             flex: 1,
//             flexDirection: "row",
//             justifyContent: "flex-end"
//           }}
//         >
//           <View style={{ marginLeft: 1, marginRight: 1 }}>
//             <Button
//               iconLeft
//               transparent
//               onPress={this.playSound.bind(this, this.props.item.url)}
//             >
//               {!this.state.playing && <Icon type="FontAwesome" name="play" />}
//               {this.state.playing && <Icon type="FontAwesome" name="pause" />}
//             </Button>
//           </View>

//           <View style={{ marginLeft: 1, marginRight: 1 }}>
//             <Button
//               iconLeft
//               transparent
//               // onPress={this.props.addSound.bind(this, this.props.item)}
//             >
//               <Icon type="Ionicons" name="md-star" />
//             </Button>
//           </View>

//           <View style={{ marginLeft: 1, marginRight: 1 }}>
//             <Button iconLeft transparent>
//               <Icon type="Ionicons" name="md-trash" />
//             </Button>
//           </View>
//         </View>
//         )}        
//       </ListItem>
//     );
//   }
// }
// const mapStateToProps = ({ soundData }) => {
//   const { sounds } = soundData;
//   return { sounds };
// };

// const mapActionCreators = {
//   addSound
// };

// export default MusicOffline;
