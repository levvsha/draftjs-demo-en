import React, { Component } from 'react';
import Type from 'prop-types';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme  from 'material-ui/styles/getMuiTheme';

import { DraftEditor } from 'components';

export default class App extends Component {
  static get childContextTypes() {
    return { muiTheme: Type.object };
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(lightBaseTheme) };
  }

  render() {
    return (
      <div>
        <DraftEditor />
      </div>
    );
  }
}
