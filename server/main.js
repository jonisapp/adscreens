import { Meteor } from 'meteor/meteor';

import Images from '../imports/api/images';
import Screens from '../imports/api/screens';

import '../imports/shared/methods';

Images.allow({
  insert: () => true,
  update: () => true,
  remove: () => false,
  download: () => true
});

Meteor.publish('images', function() {
  return Images.find({});
});

Meteor.publish('screens', function() {
  return Screens.find({});
});

Meteor.publish('screen_image', function(screenIndex) {
  const screenCursor = Screens.find({screenIndex: parseInt(screenIndex)});
  const screen = screenCursor.fetch()[0];
  const imageCursor = Images.find({ _id: screen.imageId })
  return [
    screenCursor,
    imageCursor
  ];
});


Meteor.startup(() => {

});



