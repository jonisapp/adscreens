import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect, useRef } from 'react';

import Images from '../api/images';
import Screens from '../api/screens';
import Switch from 'react-switch';

import Colors from '../constants/colors';

import Viewer from './Viewer.component';
import PasswordPannel from './PasswordPannel.component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faArrowUp, faLock } from '@fortawesome/free-solid-svg-icons';

const App = ({ imagesData, tvData }) => {
  const [ isAllowed, setIsAllowed ] = useState(false);

  const imageUploadRef = useRef(null);
  const [ images, setImages ] = useState([]);
  const [ selectedTvDataId, setSelectedTvDataId ] = useState(tvData.length > 0 ? tvData[0]._id : { _id: null });
  const selectedTvData = Screens.find({_id: selectedTvDataId}).fetch().length === 1 ? Screens.find({_id: selectedTvDataId}).fetch()[0] : [];
  const [ imageSelectedOptions, setImageSelectedOptions ] = useState('gallery');

  const { backgroundStretch, fillScreen, backgroundSizePercent, backgroundPosition, backgroundSize } = selectedTvData;
  const isDefault = !backgroundStretch && backgroundSizePercent === 100 && backgroundPosition === '50% 50%' && !fillScreen;

  console.log(selectedTvData);

  useEffect(() => {
    window.addEventListener("drop",function(e){
      e = e || event;
      e.preventDefault();
    }, false);
  });

  useEffect(() => {
    if(imagesData) {
      setImages(imagesData);
    }
  }, [ imagesData ]);

  useEffect(() => {
    if(tvData.length > 0 && selectedTvData.length === 0) {
      setSelectedTvDataId(tvData[0]._id);
    }
  }, [ tvData ]);

  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
      if(e.nativeEvent.dataTransfer.files && e.nativeEvent.dataTransfer.files[0]) {
      FS.Utility.eachFile(e.nativeEvent, function(file) {
        Images.insert(file, function (err, fileObj) {
        });
      });
    }
  }

  const toggleImageOptions = () => {
    setImageSelectedOptions(imageSelectedOptions === 'gallery' ? 'position' : 'gallery');
  };

  return(
    <div style={styles.outerBorder}>
      <PasswordPannel isAllowed={isAllowed} setIsAllowed={setIsAllowed} />
      <div style={styles.masterContainer}>
        <div style={styles.mainContainer}>
          <div style={styles.bodyContainer}>
            <div style={{position: 'absolute', right: 35, bottom: 30, backgroundColor: 'red', zIndex: 9}}>
              <div>
              <button
                style={{padding: '5px 10px 5px 10px'}}
                onClick={() => {
                  setIsAllowed(false);
                }}
              ><FontAwesomeIcon icon={faLock} size='2x' color='#bc8610' /></button>
              </div>
                
            </div> 
            <div style={styles.screensContainer}>
              {
                tvData.map(({ _id, imageUrl, name, enabled }) => {
                  return(
                    <div key={_id}
                      style={{...styles.tvContainer, ...(_id === selectedTvDataId) && styles.selectedTvContainerBorderShadow}}
                      onClick={() => {
                        setSelectedTvDataId(_id);
                      }}
                    >
                      <div style={{...styles.tv, ...(enabled && imageUrl) && { backgroundImage: `url('${ imageUrl }')`}}}>
                        <div style={styles.tvLabel}>
                          { name }
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div style={{display: 'flex', height: 516}}>
              <div style={styles.tvPannel}>
                <div style={styles.control}>
                  <div>Activer</div>
                  <Switch
                    onChange={() => {
                      Meteor.call('screen_toggleEnabled', selectedTvDataId, selectedTvData.enabled);
                    }}
                    checked={selectedTvData.enabled}
                    offColor={Colors.primary}
                  />
                </div>
                <input
                  type="text"
                  style={{display: 'inline-block', height: 30, marginBottom: 15, padding: 5, boxSizing: 'border-box', border: `1px solid ${ Colors.border.secondary }`, outline: 'none', fontSize: 16}}
                  onChange={({ currentTarget: { value } }) => {
                    Meteor.call('screen_updateName', selectedTvDataId, value);
                  }}
                  value={selectedTvData.name}
                />
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 15}}>
                  <input ref={imageUploadRef} style={{display: 'none'}} type="file"
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if(e.currentTarget.files && e.currentTarget.files[0]) {
                        setImageSelectedOptions('gallery');
                        FS.Utility.eachFile(e, function(file) {
                          Images.insert(file, function (err, fileObj) {});
                        });
                      }
                    }}
                  />
                  <button style={styles.button}
                    onClick={() => {
                      imageUploadRef.current.click();
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowUp} color='#333' /><span style={{marginLeft: 5}}>Importer...</span></button>
                  <button
                    style={styles.button}
                    onClick={toggleImageOptions}
                  >{ imageSelectedOptions === 'gallery' ? 'affichage...' : 'Images...' }</button>
                </div>
                { 
                  imageSelectedOptions === 'gallery' ?
                    <div style={styles.gallery}
                      onDrop={dropHandler}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {
                        images.length > 0 &&
                          <React.Fragment>
                            {
                              images.map(image => {
                                return(
                                  <div
                                    key={image._id}
                                    style={{display: 'flex', marginBottom: 10}}
                                  >
                                    <div style={{border: `5px solid ${image.url() === selectedTvData.imageUrl ? 'rgb(86, 134, 255)' : 'transparent'}`, width: 160, height: 90, backgroundImage: `url(${image.url()})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}
                                      onClick={() => {
                                        Meteor.call('screen_updateImage', selectedTvDataId, image._id, image.url());
                                      }}
                                    />
                                    <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                      <div
                                        onClick={() => {
                                          Meteor.call('image_remove', image._id, image.url());
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faTrashAlt} color='#ce0000' />
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </React.Fragment>
                      }
                    </div>
                  :
                    <React.Fragment>
                      <div style={styles.control}>
                        <div>Remplir</div>
                        <Switch
                          onChange={(value) => {
                            Meteor.call('screen_updateFill', selectedTvData._id, selectedTvData.fillScreen, selectedTvData.backgroundStretch);
                          }}
                          checked={selectedTvData.fillScreen}
                          offColor={Colors.primary}
                        />
                      </div>

                      <div style={styles.control}>
                        <div>Étirer</div>
                        <Switch
                          onChange={() => {
                            Meteor.call('screen_updateStretch', selectedTvData._id, selectedTvData.fillScreen, selectedTvData.backgroundStretch);
                          }}
                          checked={selectedTvData.backgroundStretch}
                          offColor={Colors.primary}
                        />
                      </div>

                      <div style={styles.control}>
                        <div>Zoom</div>
                        <input step={2} min={50} max={250} type="range" style={styles.range}
                          value={selectedTvData.backgroundSizePercent}
                          disabled={selectedTvData.backgroundStretch || selectedTvData.fillScreen ? true : false}
                          onDoubleClick={() => {
                            Meteor.call('screen_updateZoom', selectedTvDataId, 100);
                          }}
                          onChange={({currentTarget: { value }}) => {
                            Meteor.call('screen_updateZoom', selectedTvDataId, value);
                          }}
                        />
                      </div>
                      <div style={styles.control}>
                        <div>Horizontal</div>
                        <input type="range" step={1} min={0} max={100} style={styles.range}
                          value={selectedTvData.backgroundPositionHorizontal}
                          disabled={selectedTvData.backgroundStretch || selectedTvData.fillScreen ? true : false}
                          onDoubleClick={() => {
                            Meteor.call('screen_updateHorizontalPosition', selectedTvDataId, null, null, true);
                          }}
                          onChange={({currentTarget: { value }}) => {
                            Meteor.call('screen_updateHorizontalPosition', selectedTvDataId, value, selectedTvDataId.backgroundPositionVertical, false);
                          }}
                        />
                      </div>
                      <div style={styles.control}>
                        <div>Vertical</div>
                        <input type="range" step={1} min={0} max={100} style={styles.range}
                          value={selectedTvData.backgroundPositionVertical}
                          disabled={selectedTvData.backgroundStretch || selectedTvData.fillScreen ? true : false}
                          onDoubleClick={() => {
                            Meteor.call('screen_updateVerticalPosition', selectedTvDataId, null, null, true);
                          }}
                          onChange={({currentTarget: { value }}) => {
                            Meteor.call('screen_updateVerticalPosition', selectedTvDataId, value, selectedTvDataId.backgroundPositionHorizontal, false);
                          }}
                        />
                      </div>

                      { !isDefault &&
                        <div>
                          <button
                            style={{...styles.button, width: '100%'}}
                            onClick={() => {
                              Meteor.call('screen_reset', selectedTvDataId);
                            }}
                          >Paramètres par défaut</button>
                        </div>
                      }
                    </React.Fragment>
                }
              </div>
              <div style={{marginTop: 3, backgroundColor: '#A6ACC2', background: 'radial-gradient(circle, rgba(226,228,236,1) 29%, rgba(166,172,194,1) 100%)', borderRadius: 4}}>
                <div style={{position: 'relative', height: 473, width: 640, margin: 20, backgroundOrigin: 'border-box', backgroundRepeat: 'no-repeat', backgroundImage: 'url("/assets/tv.svg")'}}>
                  <Viewer
                    enabled={selectedTvData.enabled}
                    imageUrl={selectedTvData.imageUrl}
                    fillScreen={selectedTvData.fillScreen}
                    backgroundStretch={selectedTvData.backgroundStretch}
                    backgroundSizePercent={selectedTvData.backgroundSizePercent}
                    backgroundPositionHorizontal={selectedTvData.backgroundPositionHorizontal}
                    backgroundPositionVertical={selectedTvData.backgroundPositionVertical}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withTracker(() => {
  const imagesHandle = Meteor.subscribe('images');
  const screenHandle = Meteor.subscribe('screens');
  const images = Images.find({}).fetch();
  const tvData = Screens.find({}).fetch();
  return {
    imagesHandle,
    imagesData: images,
    tvData
  }
})(App);

const styles = {
  outerBorder: {
    position: 'relative',
    boxSizing: 'border-box',
    // padding: '18px 32px 18px 32px',
    background: 'radial-gradient(circle, rgba(226,228,236,1) 50%, rgba(166,172,194,1) 100%)',
    // backgroundColor: '#A6ACC2',
    fontFamily: 'sans-serif',
    height: '100%'
  },
  masterContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    // backgroundColor: '#F4F5F9',
    // borderRadius: 10,
    // border: `1px solid ${Colors.border.primary}`
  },
  mainContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 1010
  },
  bodyContainer: {
    padding: 4,
    // border: `1px solid ${Colors.border.primary}`,
    backgroundColor: Colors.primary,
    // borderRadius: 4
  },
  screensContainer: {
    display: 'flex',
    padding: 25,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    border: `1px solid ${Colors.border.primary}`,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  tvContainer: {
    padding: '5px',
    backgroundColor: '#d7dbe0',
    border: '1px solid #b7b7b7',
    borderRadius: '4px',
    color: '#b5b5b5',
  },
  tv: {
    boxSizing: 'border-box',
    width: 288,
    height: 162,
    border: '1px solid #747d93',
    backgroundColor: '#252630',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
  tvLabel: {
    display: 'inline-block',
    padding: 5,
    paddingRight: 10,
    backgroundColor: 'rgba(0, 0, 0, .55)',
    borderRight: '1px solid #8084a0',
    borderBottom: '1px solid #8084a0',
    borderBottomRightRadius: 15,
    fontWeight: 'bold',
    textShadow: '1px 0px 1px #000, -1px 0px 1px #000, 0px 1px 1px #000, 0px -1px 1px #000'
  },
  selectedTvContainerBorderShadow: {
    backgroundColor: '#5686ff',
    border: '1px solid #205be5',
    color: '#b7cdff'
  },
  tvPannel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: 4,
    padding: 33,
    border: `1px solid ${Colors.border.primary}`,
    borderRadius: 4,
    background: 'radial-gradient(circle, rgba(212,215,226,1) 23%, rgba(255,255,255,1) 100%)'
    // backgroundColor: '#F4F5F9'
  },
  control: {
    display: 'flex',
    height: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  button: {
    width: 120,
    fontSize: 14,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    border: `1px solid ${Colors.border.primary}`,
    outline: 'none'
  },
  range: {
    background: Colors.border.primary
  },
  gallery: {
    flex: 1,
    overflow: 'scroll',
    padding: 10,
    border: `1px solid ${Colors.border.secondary}`,
    backgroundColor: '#fff',
    borderRadius: 4
  }
}