import React, { Component } from "react";
import {
    Container,
    Contenet,
    Footer,
    Button,
    FooterTab,
    Icon,
    Text,
    Content,
    
} from "native-base"
import { Image, SectionList, View,Dimensions } from "react-native";
///rjc
import Expo, {FileSystem,ImagePicker, SQLite} from 'expo'
//rjc
import Globals from './Global'
const db = SQLite.openDatabase('books.db');

class Home extends Component {
  constructor(props)
  {
    super(props);

    this.state = {
      online : true,
      books_db : db,
      flag_param : 0,
    };
  }
 
  static navigationOptions = {
    title: "Home"
  };
///rjc
  componentDidMount(){
    this.state.books_db.transaction(tx => {
      tx.executeSql(
        'create table if not exists books (id integer primary key not null autoincrement,title text, url text, flag int);'  /////// flag = 0:online flag = 1:offline
      );
    });
 
  }
//rjc
  addSound() {
    this.props.addSound();
  }
  onLine() {
    Globals.online = !Globals.online;
    this.setState({      
      online: !this.state.online
      
    });
  }
  render() {
    
    var {navigate} = this.props.navigation;
    
    if(Globals.online === true) {this.state.online = true;  }
    
    else  {this.state.online = false; }
    
    console.log("fdsadfffffff    " + Globals.online);
    return (
        //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> 
        //    <Image style={{ height: 100, flex: 1 }}  source = {require('../../images/home.jpg')} />
        //    </View> 
        <Container>
            <Content>
                
              <Image style={{height: Dimensions.get('screen').height, width: Dimensions.get('screen').width, flex: 1}} source = {require('../assets/images/home.jpg')} />
            
            </Content>
        <Footer>
          <FooterTab>
          <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress = {()=>navigate("Home")}>
              <Icon type="FontAwesome" name="home" />
              <Text>Home</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={() => navigate(this.state.online?"MusicOnline":"MusicOffline", {online: this.state.online})}>
              <Icon type="FontAwesome" name="music" />
              <Text> Discours</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={() => navigate(this.state.online?"BookOnline":"BookOffline", {online: this.state.online, db : this.state.books_db})}>
              <Icon type="FontAwesome" name="book" />
              <Text>Book</Text>
            </Button>           
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={this.onLine.bind(this)}>              
              
              {!this.state.online && <Icon type="FontAwesome" name="plug" style={{color: 'gray'}}  />}
              {!this.state.online && <Text style={{color: 'gray'}} >offline</Text>}

              {this.state.online && <Icon type="FontAwesome" name="plug"  />}    
              {this.state.online && <Text>online</Text>}         

            </Button>
          </FooterTab>
        </Footer>
       
        </Container>
    );
  }  
}
export default Home;
