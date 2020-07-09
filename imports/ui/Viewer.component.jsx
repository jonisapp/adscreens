import React from 'react';

export default Viewer = ({ imageUrl, enabled, fillScreen, backgroundStretch, backgroundSizePercent, backgroundPositionHorizontal, backgroundPositionVertical }) => {
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

  return(
    <React.Fragment>
      {
        enabled &&
          <div style={{...styles.viewerScreen,
              backgroundImage: `url('${ imageUrl }')`,
              backgroundSize,
              backgroundPosition
            }}
          />
      }
    </React.Fragment>
  );
}

const styles = {
  viewerScreen: {
    opacity: 0.75,
    backgroundColor: '#252630',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    top: 25,
    left: 29,
    right: 28,
    height: 328
  }
}