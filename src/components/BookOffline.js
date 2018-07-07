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

import { Image, SectionList,StyleSheet,TextInput, TouchableOpacity,View, Alert } from "react-native";

// import {PdfSectionList} from "../pdfAssetes/PdfSelectionList";

import { Constants, SQLite } from 'expo';
import Globals from './Global';
// const db = SQLite.openDatabase('book3.db');

class BookOffline extends Component {
    constructor(props) {
        super(props);
        this.state = {
          online: this.props.navigation.state.params.online,   
          items :  null,
          name : null,
          data :[],
          searchVal : null
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
  Globals.db_book.transaction(tx => {
      tx.executeSql(
        'create table if not exists books (id integer primary key not null, title text, url text, filepath text, flag int);'  /////// flag = 0:online flag = 1:offline
      );
    });
   
  }
  update = () => {
    this.done && this.done.update(this.state.searchVal);
  }; 
    ///// 7.7 updated 
    search = () => {
      //alert("this is search test");
      this.done && this.done.update(this.state.searchVal);
    }

  ////  to read book list file and insert database 
  render() {
      var {navigate} = this.props.navigation;
      Globals.online  = this.state.online;
      
      this.update();

        return (
     
        <Container>
            <Content>
                   {/* 7.7 updated */}
            <View
                style={{
                  marginLeft : 10,
                  flexDirection: 'row',}}>
            

                <TextInput
                    style={{
                      flex: 1,
                      
                      height: 50,
                      marginLeft : 10,
                      borderColor: 'gray',
                      borderWidth: 1,
                    }}
                    placeholder="what do you need to search?"

                    value={this.state.searchVal}
                    
                    onChangeText={searchVal => this.setState({ searchVal })}

                    onSubmitEditing={() => {
                      this.search();
                      // this.setState({ searchVal: null });
                    }}
                />

                     <Icon style = {{padding : 10}} type="FontAwesome" name="search" onPress = {()=>this.search()} />
             </View>
                {/* 7.7 updated */}

               <Books
                   navigation = {navigate}
                   ref={done => (this.done = done)}  />
               </Content>

        <Footer>
          <FooterTab>
          <Button style={{backgroundColor:'#FFFFFF'}}  transparent onPress = {()=>navigate("Home" , {flag : "1", online : this.state.online})}>
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
    this.update(null);
  }

  render() {

   
    const { books } = this.state;
    if (books === null || books.length === 0) {
      return null;
    }
    return (

      <View style={{ margin: 5 }}>

        {books.map(({ id,filepath, title }) => (
        <ListItem
            key={id} 
            button={true} onPress={() => this.props.navigation("BookViewerOffline",{id : id ,title: title,  filepath: filepath})}>
          
          <Left> <Icon name = "book"/> </Left>
              <Text>{title} </Text>
              <Right> <Icon name = "arrow-forward" />
              </Right>
          </ListItem>
        ))}
      </View>
    );
  }
  update(title) {
    // console.log('update', this.props.name);
   if(title === null)
   {
    Globals.db_book.transaction(tx => {
      tx.executeSql(
        `select * from books where flag = 1;`,
        [],
        (_, { rows: { _array } }) => 
          {
            console.log('+++++++++++', _array) 
            this.setState({ books: _array })
          }     
         
      );
      
    }, ()=>{console.log('erroe3')}, () =>{console.log('success 3')});
     
   } 
   else
   {
    title = '%' + title + '%';

    Globals.db_book.transaction(tx => {
      tx.executeSql(
        "select * from books where flag = 1 and title like ?;",
        [title],
        (_, { rows: { _array } }) => 
          {
            console.log('+++++++++++', _array) 
            this.setState({ books: _array })
          }     
         
      );
      
    }, ()=>{console.log('erroe3')}, () =>{console.log('success 3')});

   }

  }
  // update() {
  //   Globals.db_book.transaction(tx => {
  //     tx.executeSql(
  //       `select * from books where flag = 1;`,
  //       [this.props.name],
  //       (_, { rows: { _array } }) => this.setState({ books: _array })
  //     );
  //   });
  // }
}
export default BookOffline;


//////////////// reference code ///////////////////////////////////
// import Expo, { SQLite } from 'expo';
// import React from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

// const db = SQLite.openDatabase('sss.db');

// class Bookss extends React.Component {
//   state = {
//     books: null,
//   };

//   componentDidMount() {
//     this.update();
//   }

//   render() {
//     const { books } = this.state;
//     if (books === null || books.length === 0) {
//       return null;
//     }

//     return (
//       <View style={{ margin: 5 }}>

//         {books.map(({ id,url, title }) => (
//           <TouchableOpacity
//             key={id}
//             onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
//             style={{
//               padding: 20, //How big buttons are
//               backgroundColor: 'yellow', 
//               borderColor: 'blue',
//               borderWidth: 5,
//             }}>
//             <Text>{url}</Text>
//             <Text>{title}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }

//   update() {
//     db.transaction(tx => {
//       tx.executeSql(
//         `select * from books;`,
//         [this.props.name],
//         (_, { rows: { _array } }) => this.setState({ books: _array })
//       );
//     });
//   }
// }

// export default class App extends React.Component {
//   state = {
//     text: null,
//   };

//   componentDidMount() {
//     db.transaction(tx => {
//       tx.executeSql(
//       'create table if not exists books (id integer primary key not null ,title text, url text, flag int);'  /////// flag = 0:online flag = 1:offline
//       );
//     });
//   }

//   render() {
    
//      return (
//       <View style={styles.container}>
//         <View
//           style={{
//             flexDirection: 'row',
//           }}>
//           <TextInput
//             style={{
//               flex: 1,
//               padding: 5,
//               height: 40,
//               borderColor: 'gray',
//               borderWidth: 1,
//             }}
//             placeholder="what do you need to do?"
//             value={this.state.text}
//             onChangeText={text => this.setState({ text })}
//             onSubmitEditing={() => {
//               this.add(this.state.text);
//               this.setState({ text: null });
//             }}
//           />
//         </View>
//         <View style={{ flex: 1, backgroundColor: 'gray' }}>
//           <Bookss
//             ref={name => (this.name = name)}
//           />
//         </View>
//       </View>
//     );
//   }

//   add(text) {
//     Alert.alert('adding data');
//     db.transaction(
//       tx => {
//         tx.executeSql('insert into books (url, title) values ( ?, ?)', [text, text]);
//         tx.executeSql('select * from books', [], (_, { rows }) =>   console.log(JSON.stringify(rows))
//         );
//       },
//     this.update()
//     );
//   }

//   load() {
//   Alert.alert('LOADING data');
//   db.transaction(
//     tx => {
//       tx.executeSql('select * from books', [], (_, { rows }) =>   console.log(JSON.stringify(rows))
//       );
//     },
//     null,
//     this.update 
//     );
//   }

//   update = () => {
//     this.name && this.name.update();
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingTop: Expo.Constants.statusBarHeight,
//   },
// });
