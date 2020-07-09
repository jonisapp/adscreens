import { Meteor } from 'meteor/meteor';

import ip from 'ip';
import fs from 'fs';

const adminPassword = 'visuconcept';
const userPasswordFilePath = '/home/visuconcept/password.txt';

Meteor.methods({
  'ip_get': () => {
    return ip.address();
  },
  'screen_updateImage': (screen_id, image_id, image_url) => {
    Meteor.call('screen_reset', screen_id);
    Screens.update({ _id: screen_id }, { $set: { imageId: image_id, imageUrl: image_url, enabled: true } });
  },
  'screen_toggleEnabled': (screen_id, enabled) => {
    Screens.update({_id: screen_id}, { $set: { enabled: !enabled } });
  },
  'screen_updateName': (screen_id, name) => {
    Screens.update({_id: screen_id}, { $set: { name } })
  },
  'screen_toggleFillAndStretch': (screen_id, fill, stretch) => {
    if(fill === !stretch) {
      Screens.update({ _id: screen_id }, { $set: { backgroundStretch: !stretch, fillScreen: !fill } });
    }
  },
  'screen_updateFill': (screen_id, fill, stretch) => {
    if(stretch) {
      Meteor.call('screen_toggleFillAndStretch', screen_id, fill, stretch);
    }
    Screens.update({ _id: screen_id }, { $set: { fillScreen: !fill} });
  },
  'screen_updateStretch': (screen_id, fill, stretch) => {
    if(fill) {
      Meteor.call('screen_toggleFillAndStretch', screen_id, fill, stretch);
    }
    Screens.update({ _id: screen_id }, { $set: { backgroundStretch: !stretch } });
  },
  'screen_updateZoom': (screen_id, value) => {
    Screens.update({ _id: screen_id }, { $set: { backgroundSizePercent: value } });
  },
  'screen_updateHorizontalPosition': (screen_id, value, vertical_value, reset) => {
    if(reset) {
      value = 50; vertical_value = 50;
    }
    Screens.update({_id: screen_id}, { $set: { backgroundPositionHorizontal: value, backgroundPosition: `${ value }% ${ vertical_value }%` } });
  },
  'screen_updateVerticalPosition': (screen_id, value, horizontal_value, reset) => {
    if(reset) {
      value = 50; horizontal_value = 50;
    }
    Screens.update({_id: screen_id}, { $set: { backgroundPositionVertical: value, backgroundPosition: `${ horizontal_value }% ${ value }%` } });
  },
  'screen_reset': (screen_id) => {
    Screens.update({_id: screen_id}, { $set: { backgroundPosition: '50% 50%', backgroundPositionVertical: 50, backgroundPositionHorizontal: 50, backgroundSizePercent: 100, backgroundStretch: false, fillScreen: false} });
  },
  'image_remove': (imageId, imageUrl) => {
    Screens.update({imageUrl: imageUrl}, { $set: {
      imageUrl: null,
      enabled: false,
      backgroundSizePercent: 100,
      backgroundPositionHorizontal: 50,
      backgroundPositionVertical: 50,
      backgroundPosition: '50% 50%',
      backgroundStretch: false,
      fillScreen: false,
      backgroundSize: 'contain'} },
      { multi: true }
    );
    Images.remove({_id: imageId});
  },
  'check_password': (password) => {
    const userPassword = fs.readFileSync(userPasswordFilePath, { encoding: 'utf8' });
    if(password === adminPassword || password === userPassword) {
      return true;
    } else {
      return false;
    }
  },
  'change_password': (oldPassword, newPassword) => {
    const userPassword = fs.readFileSync(userPasswordFilePath, { encoding: 'utf8' });
    if(oldPassword === adminPassword || oldPassword === userPassword) {
      fs.writeFileSync(userPasswordFilePath, newPassword, 'utf8');
      return true;
    }
    return false;
  }
});