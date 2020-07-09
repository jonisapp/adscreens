import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import "../imports/shared/methods";
import Interface from '/imports/ui/App';
import TvScreen from '/imports/ui/TvScreen.component';

const App = () => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path='/adscreens/interface' component={Interface} />
        <Route exact path='/screens/:screenIndex' component={TvScreen} />
      </Switch>
      
    </BrowserRouter>
  );
};

Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'));
});
