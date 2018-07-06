
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

const data = require('../assets/PdfSelectionList.json');

// const db = SQLite.openDatabase('book3.db');


class BookOnline extends Component {
    constructor(props) {
        super(props);
        this.state = {
          online: this.props.navigation.state.params.online,   
          items :  null,
          name : null,
          data :[],
          finish: 0
        };
      }
  static navigationOptions = {
    title: "Book"
  };
  onLine() {
    this.setState({      
      online: !this.state.online
    });
  }
///rjc
componentDidMount(){

  // this.state.online = this.props.navigation.state.params.online; 

    Globals.db_book.transaction(tx => {
      tx.executeSql(
        'create table if not exists books (id integer primary key not null, title text, url text, filepath text, flag int);'  /////// flag = 0:online flag = 1:offline
      );
    }, ()=>{console.log('error1')}, (res)=>{console.log('success1', res)}
  );
    this.initDatabase()
  }
 
  async insertData(item)
  {
    Globals.db_book.transaction(
      tx => {
          tx.executeSql('insert into books (title,url,flag) values ( ?, ? , ?)', [item.title, item.url, 0]);
        },() =>{console.log('error2')},
        (res)=>{
                  console.log('success 2',res);
                  this.setState({finiish : this.state.finish+1})
                  this.update();
               }
     
    );
  }
  init(len)
  {
    if(len === 0)
    {
        var item = data.book;
    
        for(i in item)
        {
          this.insertData(item[i]);
         
       
        }

    }
  }
  async initDatabase()
  {
    await    Globals.db_book.transaction(
      tx => {
        tx.executeSql('select * from books', [], (_, { rows }) =>
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
  //  var  id = 6; 
    // var title = item[i].title;
    
      // var url = item[i].url;
//  await new Promise(    
    //  db.transaction(
    //     tx => {
    //       tx.executeSql('insert into books (title,url,flag) values ( ?, ? , ?)', [item.title, item.url, 0]);
    //     // tx.executeSql('select * from books', [], (_, { rows }) =>   console.log(JSON.stringify(rows)));
    //     },
    //   null
    //   );


   
//  }

////  to read book list file and insert database 

  render() {
      var {navigate} = this.props.navigation;
    
      Globals.online  = this.state.online;
      
      this.update();
        return (
     
        <Container>
            <Content>
               <Books
                   navigation = {navigate}
                   ref={done => (this.done = done)}  />
               </Content>

        <Footer>
          <FooterTab>
          <Button style={{backgroundColor:'#FFFFFF'}}  transparent onPress = {()=>navigate("Home", {online : this.state.online})}>
              <Icon type="FontAwesome" name="home" />
              <Text>Home</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}}  transparent onPress={() => navigate(this.state.online?"MusicOnline":"MusicOffline", {online: this.state.online})}>
              <Icon type="FontAwesome" name="music" />
              <Text> Discours</Text>
            </Button>
            <Button style={{backgroundColor:'#FFFFFF'}}  transparent>
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
class Books extends React.Component {
  constructor(props) {
        super(props);
        }
  state = {
    books: null,
  };

  componentDidMount() {
    this.update();
  }

  render() {
  
    const { books } = this.state;
    if (books === null || books.length === 0) {
      return null;
    }
    return (

      <View style={{ margin: 5 } }>

        {books.map(({ id,url, title }) => (

          <TouchableOpacity
           style={{flexDirection:'row', height:50, alignItems:'center', backgroundColor:'white', borderTopColor:'#ccc', borderTopWidth:1, paddingHorizontal:15}}
             key={id} 
             onPress={() => this.props.navigation("BookViewer",{id : id, title: title,  url: url})}>
           
             <Icon name = "book"/>
               <Text style={{flex:1, marginLeft:10}}>{title} </Text>
               <Icon name = "arrow-forward" />
           </TouchableOpacity>



        // <ListItem style={{ position: 'absolute', zIndex: 20 }}
        //     key={id} 
        //     button={true} onPress={() => this.props.navigation("BookViewer",{id : id, title: title,  url: url})}>
          
        //   <Left> <Icon style={{ position: 'absolute', zIndex: 30 }} name = "book"/> </Left>
        //       <Text style={{ position: 'absolute', zIndex: 40 }}>{title} </Text>
        //       <Right> <Icon name = "arrow-forward" />
        //       </Right>
        //   </ListItem>
        ))}
      </View>
    );
  }

  update() {
    // console.log('update', this.props.name);
    Globals.db_book.transaction(tx => {
      tx.executeSql(
        `select * from books where flag = 0;`,
        [],
        (_, { rows: { _array } }) => 
          {
            console.log('+++++++++++', _array) 
            this.setState({ books: _array })
          }     
         
      );
      
    }, ()=>{console.log('erroe3')}, () =>{console.log('success 3')});
  }
}
export default BookOnline;


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