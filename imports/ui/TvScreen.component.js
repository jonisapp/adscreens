import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Images from '../api/images';
import Screens from '../api/screens';

import Colors from '../constants/colors';

const TvScreen = ({ screen }) => {
  if(!screen) return null;
  const { imageUrl, enabled, fillScreen, backgroundStretch, backgroundSizePercent, backgroundPositionHorizontal, backgroundPositionVertical } = screen;

  let backgroundSize = 'auto 100%';
  let backgroundPosition = 'center';
  if(fillScreen) {
    backgroundSize = '100%';
  } else if(backgroundStretch) {
    backgroundSize = '100% 100%';
  } else {
    backgroundSize = `auto ${ backgroundSizePercent }%`;
    backgroundPosition = `${backgroundPositionHorizontal}% ${backgroundPositionVertical}%`;
  }

  if(screen) {
    return(
      <React.Fragment>
        {
          enabled ?
            <div style={{...styles.screen, ...{ backgroundImage: `url('${imageUrl}')`, backgroundSize, backgroundPosition }}}>

            </div>
          :
            <div style={styles.screen} />
        }
      </React.Fragment>
    );
  }

  return null;
}

export default withTracker(({ match }) => {
  const screenImageHandle = Meteor.subscribe('screen_image', match.params.screenIndex);
  const screen = Screens.find({}).fetch()[0];
  return {
    screen
  }
})(TvScreen);

const styles = {
  screen: {
    margin: 0, padding: 0,
    height: window.screen.height,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#000'
  }
}