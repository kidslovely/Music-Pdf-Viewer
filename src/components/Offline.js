import React, { Component } from "react";
import {
    Container,
    Contenet,
    Footer,
    Button,
    FooterTab,
    Icon,
    Text,
    Content
} from "native-base"
import { Image, SectionList, View } from "react-native";

class Offline extends Component {
  static navigationOptions = {
    title: "Offline"
  };
  render() {
      var {navigate} = this.props.navigation;
    return (
        //   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> 
        //    <Image style={{ height: 100, flex: 1 }}  source = {require('../../images/home.jpg')} />
        //    </View> 
        <Container>
            <Content>
                
                <Image style={{height: 200, width: 200, flex: 1}} source = {require('../../images/home.jpg')} />
            
            </Content>
        <Footer>
          <FooterTab>
          <Button transparent onPress = {()=>navigate("Home")}>
              <Icon type="FontAwesome" name="home" />
              <Text>Home</Text>
            </Button>
            <Button style={{ width: 80}} transparent onPress={() => navigate("Music")}>
              <Icon type="FontAwesome" name="music" />
              <Text> Music</Text>
            </Button>
            <Button transparent onPress={()=>navigate("Book")}>
              <Icon type="FontAwesome" name="book" />
              <Text>Book</Text>
            </Button>           
            <Button transparent onPress={() => navigate("Offline")}>
              <Icon type="FontAwesome" name="plug" />
              <Text>offline</Text>
            </Button>
          </FooterTab>
        </Footer>
        
        </Container>
    );
  }  
}
export default Offline;
