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
import Globals from './Global';
import { Constants, SQLite } from 'expo';

const data = require('../assets/MusicList.json');

// const db = SQLite.openDatabase('music3.db');


class MusicOnline extends Component {
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

///rjc
componentDidMount(){
  Globals.db_music.transaction(tx => {
      tx.executeSql(
        'create table if not exists discoures (id integer primary key not null, part text, title text, url text, filepath text, fav int ,  flag int);'  /////// flag = 0:online flag = 1:offline
      );
    });
    this.initDatabase()
  
  }
  async insertData(item)
  {
    Globals.db_music.transaction(
      tx => {
        tx.executeSql('insert into discoures (part, title, url, fav, flag) values ( ?, ?, ? , ?, ?)', [item.part, item.title, item.url, 0, 0]);
        },()=>{console.log("error")},
        (res) =>{
          console.log('success 2',res);
          this.update();
        }
    );
  }
  init(len)
  {
    if(len === 0)
    {
        var item = data.discourses;
    
        for(i in item)
        {
          this.insertData(item[i]);  
        }

    }
  }
  async initDatabase()
  {
    await   Globals.db_music.transaction(
      tx => {
        tx.executeSql('select * from discoures', [], (_, { rows }) =>
        {
          console.log((rows).length);
          this.init((rows).length);
        })
        null,null
      } );
  }
  update = () => {
    this.done && this.done.update();
  }; 

  ////  to read book list file and insert database 

  render() {
      var {navigate} = this.props.navigation;
      Globals.online  = this.state.online;
        return (
     
        <Container>
            <Content>
               <Musics
                   navigation = {navigate}
                   ref={done => (this.done = done)}  />
               </Content>

        <Footer>
          <FooterTab>
          <Button style={{backgroundColor:'#FFFFFF'}}  transparent onPress = {()=>navigate("Home" , {online : this.state.online})}>
              <Icon type="FontAwesome" name="home" />
              <Text>Home</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}} transparent onPress={() => navigate(this.props.navigation.state.params.online?"MusicOnline":"MusicOffline", {online: this.props.navigation.state.params.online})}>
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
    parts: null,
  };

  componentDidMount() {
    this.update();
  }

  render() {
  
    const { parts } = this.state;
    if (parts === null || parts.length === 0) {
      return null;
    }
    return (

      <View style={{ margin: 5 }}>

        {parts.map(({ id,url, title, part }) => (

                <TouchableOpacity
                 style={{flexDirection:'row', height:50, alignItems:'center', backgroundColor:'white', borderTopColor:'#ccc', borderTopWidth:1, paddingHorizontal:15}}
                   key={id} 
                   onPress={() =>  this.props.navigation("DiscoursesOnline",{part: part, online : Globals.online})}>
                 
                 <Icon type = "Ionicons" name = "md-musical-notes"/> 
                     <Text style={{flex:1, marginLeft:10}}>{part} </Text>
                     <Icon type = "Ionicons" name = "ios-arrow-forward" />
                 </TouchableOpacity>
        ))}
      </View>
    );
  }

  update() {
    Globals.db_music.transaction(tx => {
      tx.executeSql(
        `select * from discoures where flag = 0 GROUP BY part;`,
        [],
        (_, { rows: { _array } }) => this.setState({ parts: _array })
      );
    });
  }
}
export default MusicOnline;


//////////////// reference code ///////////////////////////////////

  {/* <SectionList
                sections = {PdfSectionList}
                renderItem = {({item,index})=>
                {
                    return(
                        
                        <SectionListItem 
                        navigation = {navigate}
                        item={item}
                        index={index}/>

                    );
                }}
                renderSectionHeader={({ section: { header } }) => {
                    return <SectionHeader header={header} />;
                  }}
            >
            </SectionList> */}

// class SectionListItem extends Component
// {
//     constructor(props) {
//         super(props);
//         }
//     render()
//     {
//            return(
//             <ListItem button={true} onPress={() => this.props.navigation("BookViewer",{title:this.props.item.title,
//             url:this.props.item.url})}>
            
//             <Left> <Icon name = "book"/> </Left>
//                 <Text>{this.props.item.title} </Text>
//                 <Right> <Icon name = "arrow-forward" />
//                 </Right>
//             </ListItem>
//         );
        
//     }
// }
// class SectionHeader extends Component
// {
//     render()
//     {
//         return(
//             <ListItem itemDivider>
//             <Text>{this.props.header} </Text>
//             </ListItem>
//         );
//     }
// }