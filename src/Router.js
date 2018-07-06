//import {StackNavigator} from 'react-navigation';
import Home from './components/Home';
import MusicOffline from './components/MusicOffline';
import MusicOnline from './components/MusicOnline';
import BookOnline  from './components/BookOnline';
import BookOffline  from './components/BookOffline';

import BookViewer from './components/BookViewer';
import BookViewerOffline from './components/BookViewerOffline';
import Directory from './components/Directory';
import DiscoursesOnline from './components/DiscoursesOnline';
import onPlay from './components/onPlay';

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {createStackNavigator} from 'react-navigation';



export default Router = createStackNavigator({
  Home: {  screen: Home },
  
  MusicOffline:{  screen: MusicOffline},

  MusicOnline:{  screen: MusicOnline},
  BookOnline: {   screen: BookOnline },
  BookOffline: {   screen: BookOffline },
  BookViewer :{screen:BookViewer},
  BookViewerOffline :{screen:BookViewerOffline},

  Directory: { screen: Directory},
  DiscoursesOnline: {screen : DiscoursesOnline},
  onPlay : {screen:onPlay}
},
);
