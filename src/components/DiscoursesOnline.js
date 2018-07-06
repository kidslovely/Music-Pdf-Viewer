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

// import {PdfSectionList} from "../pdfAssetes/PdfSelectionList";

import { Constants, SQLite } from 'expo';

import Globals from './Global';

const data = require('../assets/MusicList.json');

// const db = SQLite.openDatabase('music3.db');


class DiscoursesOnline extends Component {
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
      var part = this.props.navigation.state.params.part;

        return (
     
        <Container>
            <Content>
               <Discourses
                   navigation = {navigate}
                   part = {part}
                   ref={name => (this.name = name)}    />
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

/////////////////////  database  //////////////
class Discourses extends React.Component {
  constructor(props) {
        super(props);
        }
  state = {
    d_lists: null,
  };

  componentDidMount() {
    this.update();
    //this.aaaa();
  }

  render() {
   
    const { d_lists } = this.state;

    if (d_lists === null || d_lists.length === 0) {
      return null;
    }
    return (

      <View style={{ margin: 5 }}>

        {d_lists.map(({ id,url, title, part }) => (

        <TouchableOpacity
        style={{flexDirection:'row', height:50, alignItems:'center', backgroundColor:'white', borderTopColor:'#ccc', borderTopWidth:1, paddingHorizontal:15}}
          key={id} 
          onPress={() => this.props.navigation("onPlay",{id : id, title: title,  url: url, online : Globals.online})}>
         <Icon type = "Ionicons" name = "md-musical-notes"/> 
            <Text style={{flex:1, marginLeft:10}}>{title} </Text>
            <Icon type = "Ionicons" name = "ios-arrow-forward" />
        </TouchableOpacity>
        // <ListItem
    
        //     key={id} 
        //     button={true} onPress={() => this.props.navigation("onPlay",{id : id, title: title,  url: url})}>
          
        //   <Left> <Icon type = "Ionicons" name = "md-musical-notes"/> </Left>
        //       <Text>{title} </Text>
        //       <Right> <Icon name = "arrow-forward" />
        //       </Right>
        //   </ListItem>
        ))}
      </View>
    );
  }

  update() {
   /// var m_part = this.props.part;
   Globals.db_music.transaction(tx => {
      tx.executeSql(
        'select * from discoures where flag = 0  and part = ?;',
        [this.props.part],
        (_, { rows: { _array } }) => this.setState({ d_lists: _array })
      );
    });
  }
}
export default DiscoursesOnline;


//////////////// reference code ///////////////////////////////////

