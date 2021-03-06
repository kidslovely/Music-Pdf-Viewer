import React from 'react';
import { ScrollView, View, TouchableHighlight, Text } from 'react-native';
import VideoPlayer from './VideoPlayerRJC';
import { Ionicons } from '@expo/vector-icons';
import BaseScreen from './BaseScreen';
import { Video } from 'expo';

var styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
};

export default class CustomScreen extends BaseScreen {
  render() {
    const COLOR = '#92DCE5';
    const icon = (name, size = 36) => () => (
      <Ionicons
        name={name}
        size={size}
        color={COLOR}
        style={{ textAlign: 'center' }}
      />
    );
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <VideoPlayer
            videoProps={{
              shouldPlay: false,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: {
                uri: 'https://storage.googleapis.com/hiddeningredents.blogspot.com/Prapatti/01_Bhagavata_Mahimai_Supremacies_of_Narasimha_avataram.m4a',
              },
            //  width: 200,
            //  height: 100,
              isMuted: false,
            }}
            playIcon={icon('ios-play-outline')}
            pauseIcon={icon('ios-pause-outline')}
            fullscreenEnterIcon={icon('ios-expand-outline', 28)}
            fullscreenExitIcon={icon('ios-contract-outline', 28)}
            trackImage={require('../assets/track.png')}
            thumbImage={require('../assets/thumb.png')}
            textStyle={{
              color: COLOR,
              fontSize: 12,
            }}
            showFullscreenButton={false}
            isPortrait={this.state.isPortrait}
            switchToLandscape={this.switchToLandscape.bind(this)}
            switchToPortrait={this.switchToPortrait.bind(this)}
            playFromPositionMillis={0}
          />
        </ScrollView>
      </View>
    );
  }
}
