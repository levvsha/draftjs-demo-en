import React, { Component } from 'react';
import Type from 'prop-types';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme  from 'material-ui/styles/getMuiTheme';

import { hasClass, closest } from 'utils';
import { DraftEditor } from 'components';

export default class App extends Component {
  static get childContextTypes() {
    return { muiTheme: Type.object };
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(lightBaseTheme) };
  }

  componentDidMount() {
    window.addEventListener('dragover', (event) => {
      if (!closest(event.target, (element) => hasClass(element, 'DraftEditor-editorContainer'))) {
        event.preventDefault();
      }
    });

    window.addEventListener('drop', (event) => {
      event.preventDefault();
    });
  }

  render() {
    return (
      <div>
        <DraftEditor />
      </div>
    );
  }
}
